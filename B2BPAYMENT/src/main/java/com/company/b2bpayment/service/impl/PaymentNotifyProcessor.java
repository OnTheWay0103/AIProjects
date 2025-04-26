package com.company.b2bpayment.service.impl;

import com.company.b2bpayment.entity.PaymentNotify;
import com.company.b2bpayment.repository.PaymentNotifyRepository;
import com.company.b2bpayment.service.PaymentService;
import com.company.b2bpayment.util.NotifyStatus;
import com.company.b2bpayment.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentNotifyProcessor {
    private final PaymentService paymentService;
    private final PaymentNotifyRepository notifyRepository;

    @Transactional
    public void processNotify(PaymentNotify notify) {
        try {
            // 更新通知状态为处理中
            notify.setProcessStatus(NotifyStatus.PROCESSING.getCode());
            notify.setProcessTimes(notify.getProcessTimes() + 1);
            notifyRepository.save(notify);

            // 处理通知
            paymentService.handlePaymentNotify(notify.getNotifyData());

            // 更新通知状态为成功
            notify.setProcessStatus(NotifyStatus.SUCCESS.getCode());
            notifyRepository.save(notify);
        } catch (Exception e) {
            log.error("处理支付通知失败: {}", notify.getId(), e);
            // 更新通知状态为失败
            notify.setProcessStatus(NotifyStatus.FAILED.getCode());
            notifyRepository.save(notify);

            // 如果处理次数未达到最大重试次数，则抛出异常以触发重试
            if (notify.getProcessTimes() < 3) {
                throw new BusinessException("处理支付通知失败，将进行重试");
            }
        }
    }
}