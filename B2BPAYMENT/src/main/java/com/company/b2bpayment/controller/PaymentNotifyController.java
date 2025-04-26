package com.company.b2bpayment.controller;

import com.company.b2bpayment.entity.PaymentNotify;
import com.company.b2bpayment.repository.PaymentNotifyRepository;
import com.company.b2bpayment.service.impl.PaymentNotifyProcessor;
import com.company.b2bpayment.util.NotifyStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

@Slf4j
@RestController
@RequestMapping("/api/payment/notify")
@RequiredArgsConstructor
public class PaymentNotifyController {
    private final PaymentNotifyRepository notifyRepository;
    private final PaymentNotifyProcessor notifyProcessor;

    @PostMapping
    public String handleNotify(@RequestBody String notifyData) {
        log.info("收到支付通知: {}", notifyData);
        try {
            // 保存通知记录
            PaymentNotify notify = new PaymentNotify();
            notify.setNotifyData(notifyData);
            notify.setNotifyTime(LocalDateTime.now());
            notify.setProcessStatus(NotifyStatus.PENDING.getCode());
            notify.setProcessTimes(0);
            notify = notifyRepository.save(notify);

            // 异步处理通知
            CompletableFuture.runAsync(() -> notifyProcessor.processNotify(notify));

            // 立即返回成功
            return "success";
        } catch (Exception e) {
            log.error("处理支付通知失败", e);
            return "fail";
        }
    }
}