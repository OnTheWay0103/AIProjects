package com.company.b2bpayment.task;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentNotifyRetryTask {
    private final PaymentNotifyRepository notifyRepository;
    private final PaymentNotifyProcessor notifyProcessor;

    @Scheduled(fixedDelay = 300000) // 每5分钟执行一次
    public void retryFailedNotify() {
        log.info("开始处理失败的支付通知");
        try {
            // 查询需要重试的通知
            List<PaymentNotify> notifies = notifyRepository
                    .findByProcessStatusAndProcessTimesLessThan(
                            NotifyStatus.FAILED.getCode(), 3);

            for (PaymentNotify notify : notifies) {
                try {
                    notifyProcessor.processNotify(notify);
                } catch (Exception e) {
                    log.error("重试处理支付通知失败: {}", notify.getId(), e);
                }
            }
        } catch (Exception e) {
            log.error("重试任务执行失败", e);
        }
    }
}