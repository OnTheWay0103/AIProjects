package com.company.b2bpayment.service.impl;

import com.company.b2bpayment.constant.PaymentConstant;
import com.company.b2bpayment.entity.Payment;
import com.company.b2bpayment.entity.PaymentLog;
import com.company.b2bpayment.entity.PaymentNotify;
import com.company.b2bpayment.exception.BusinessException;
import com.company.b2bpayment.repository.PaymentRepository;
import com.company.b2bpayment.repository.PaymentLogRepository;
import com.company.b2bpayment.repository.PaymentNotifyRepository;
import com.company.b2bpayment.service.PaymentService;
import com.company.b2bpayment.util.HttpUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final PaymentLogRepository paymentLogRepository;
    private final PaymentNotifyRepository paymentNotifyRepository;
    private final HuifuProperties huifuProperties;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public Payment createPayment(PaymentRequestDTO request) {
        // 1. 参数校验
        validatePaymentRequest(request);

        // 2. 构建支付对象
        Payment payment = buildPayment(request);

        // 3. 调用汇付API
        Map<String, Object> apiResult = callHuifuPayApi(payment);

        // 4. 更新支付对象
        updatePaymentWithApiResult(payment, apiResult);

        // 5. 保存支付对象
        payment = paymentRepository.save(payment);

        // 6. 记录日志
        savePaymentLog(payment, PaymentConstant.LOG_TYPE_CREATE,
                objectMapper.writeValueAsString(apiResult));

        return payment;
    }

    @Override
    public Payment queryPayment(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new BusinessException("支付订单不存在"));

        // 调用汇付查询API
        Map<String, Object> queryResult = callHuifuQueryApi(payment);

        // 更新支付状态
        updatePaymentStatus(payment, queryResult);

        // 记录查询日志
        savePaymentLog(payment, PaymentConstant.LOG_TYPE_QUERY,
                objectMapper.writeValueAsString(queryResult));

        return payment;
    }

    @Override
    @Transactional
    public void handlePaymentNotify(String notifyData) {
        // 1. 解析通知数据
        Map<String, Object> notifyMap = parseNotifyData(notifyData);

        // 2. 验证签名
        validateNotifySign(notifyMap);

        // 3. 查找支付订单
        String paymentId = (String) notifyMap.get("id");
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new BusinessException("支付订单不存在"));

        // 4. 保存通知记录
        savePaymentNotify(payment, notifyData);

        // 5. 更新支付状态
        updatePaymentStatus(payment, notifyMap);

        // 6. 记录通知日志
        savePaymentLog(payment, PaymentConstant.LOG_TYPE_NOTIFY, notifyData);
    }

    private void validatePaymentRequest(PaymentRequestDTO request) {
        // 基础参数验证
        Assert.hasText(request.getOrderNo(), "订单号不能为空");
        Assert.hasText(request.getPayChannel(), "支付渠道不能为空");
        Assert.notNull(request.getPayAmt(), "支付金额不能为空");
        Assert.isTrue(request.getPayAmt().compareTo(BigDecimal.ZERO) > 0, "支付金额必须大于0");

        // 银行支付特殊验证
        if (PaymentConstant.CHANNEL_BANK_PAY.equals(request.getPayChannel())) {
            Map<String, Object> expend = request.getExpend();
            Assert.notNull(expend, "银行支付参数不能为空");
            Assert.hasText((String) expend.get("elements_type"), "验证类型不能为空");

            String elementsType = (String) expend.get("elements_type");
            if (PaymentConstant.ELEMENTS_TYPE_THREE.equals(elementsType)
                    || PaymentConstant.ELEMENTS_TYPE_FOUR.equals(elementsType)) {
                Assert.hasText((String) expend.get("card_name"), "付款方户名不能为空");
            }

            if (PaymentConstant.ELEMENTS_TYPE_FOUR.equals(elementsType)) {
                Assert.hasText((String) expend.get("card_no"), "付款方账号不能为空");
            }
        }
    }

    private Payment buildPayment(PaymentRequestDTO request) {
        Payment payment = new Payment();
        payment.setOrderNo(request.getOrderNo());
        payment.setAppId(huifuProperties.getAppId());
        payment.setPayChannel(request.getPayChannel());
        payment.setPayAmt(request.getPayAmt());
        payment.setGoodsTitle(request.getGoodsTitle());
        payment.setGoodsDesc(request.getGoodsDesc());
        payment.setCurrency(PaymentConstant.CURRENCY_CNY);
        payment.setStatus(PaymentStatus.PENDING.getCode());
        payment.setExpendParams(objectMapper.writeValueAsString(request.getExpend()));
        payment.setNotifyUrl(
                StringUtils.hasText(request.getNotifyUrl()) ? request.getNotifyUrl() : huifuProperties.getNotifyUrl());
        payment.setCreatedTime(LocalDateTime.now());
        return payment;
    }

    private Map<String, Object> callHuifuPayApi(Payment payment) {
        try {
            // 构建API请求参数
            Map<String, Object> requestParams = buildHuifuPayParams(payment);

            // 添加签名
            addSignature(requestParams);

            // 发送请求
            String response = HttpUtil.post(huifuProperties.getApiUrl() + "/v1/payments",
                    objectMapper.writeValueAsString(requestParams));

            // 解析响应
            return objectMapper.readValue(response, new TypeReference<Map<String, Object>>() {
            });
        } catch (Exception e) {
            log.error("调用汇付支付API失败", e);
            throw new BusinessException("支付失败：" + e.getMessage());
        }
    }

    private void updatePaymentWithApiResult(Payment payment, Map<String, Object> apiResult) {
        payment.setId((String) apiResult.get("id"));
        String status = (String) apiResult.get("status");
        payment.setStatus(status);

        if (apiResult.containsKey("expire_time")) {
            payment.setExpireTime(LocalDateTime.parse((String) apiResult.get("expire_time")));
        }
    }

    private void savePaymentLog(Payment payment, String logType, String content) {
        PaymentLog log = new PaymentLog();
        log.setPaymentId(payment.getId());
        log.setOrderNo(payment.getOrderNo());
        log.setLogType(logType);
        log.setLogContent(content);
        log.setCreatedTime(LocalDateTime.now());
        paymentLogRepository.save(log);
    }

    // 其他私有方法实现...
}