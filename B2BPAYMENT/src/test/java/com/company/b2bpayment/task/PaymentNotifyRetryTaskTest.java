package com.company.b2bpayment.task;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.Mockito;
import org.mockito.ArgumentMatchers;
import org.mockito.times;
import org.mockito.verify;
import org.mockito.when;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@ExtendWith(MockitoExtension.class)
class PaymentNotifyRetryTaskTest {
    @Mock
    private PaymentNotifyRepository notifyRepository;

    @Mock
    private PaymentNotifyProcessor notifyProcessor;

    @InjectMocks
    private PaymentNotifyRetryTask retryTask;

    @Test
    void retryFailedNotify_Success() {
        // Given
        List<PaymentNotify> notifies = Arrays.asList(
                createTestNotify(1L),
                createTestNotify(2L));

        when(notifyRepository.findByProcessStatusAndProcessTimesLessThan(
                ArgumentMatchers.eq(NotifyStatus.FAILED.getCode()), ArgumentMatchers.eq(3)))
                .thenReturn(notifies);

        // When
        retryTask.retryFailedNotify();

        // Then
        verify(notifyProcessor, Mockito.times(2)).processNotify(ArgumentMatchers.any(PaymentNotify.class));
    }

    @Test
    void retryFailedNotify_PartialSuccess() {
        // Given
        List<PaymentNotify> notifies = Arrays.asList(
                createTestNotify(1L),
                createTestNotify(2L));

        when(notifyRepository.findByProcessStatusAndProcessTimesLessThan(
                ArgumentMatchers.eq(NotifyStatus.FAILED.getCode()), ArgumentMatchers.eq(3)))
                .thenReturn(notifies);

        Mockito.doThrow(new RuntimeException("处理失败")).when(notifyProcessor)
                .processNotify(ArgumentMatchers.argThat(n -> n.getId().equals(2L)));

        // When
        retryTask.retryFailedNotify();

        // Then
        verify(notifyProcessor, Mockito.times(2)).processNotify(ArgumentMatchers.any(PaymentNotify.class));
    }

    private PaymentNotify createTestNotify(Long id) {
        PaymentNotify notify = new PaymentNotify();
        notify.setId(id);
        notify.setPaymentId("test_payment_id_" + id);
        notify.setNotifyData("{\"id\":\"test_payment_id_" + id + "\",\"status\":\"succeeded\"}");
        notify.setNotifyTime(LocalDateTime.now());
        notify.setProcessStatus(NotifyStatus.FAILED.getCode());
        notify.setProcessTimes(1);
        return notify;
    }
}