package com.company.b2bpayment.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import java.time.LocalDateTime;

@ExtendWith(MockitoExtension.class)
class PaymentNotifyProcessorTest {
    @Mock
    private PaymentService paymentService;

    @Mock
    private PaymentNotifyRepository notifyRepository;

    @InjectMocks
    private PaymentNotifyProcessor notifyProcessor;

    @Test
    void processNotify_Success() {
        // Given
        PaymentNotify notify = createTestNotify();
        when(notifyRepository.save(any(PaymentNotify.class))).thenReturn(notify);

        // When
        notifyProcessor.processNotify(notify);

        // Then
        assertEquals(NotifyStatus.SUCCESS.getCode(), notify.getProcessStatus());
        verify(paymentService).handlePaymentNotify(notify.getNotifyData());
        verify(notifyRepository, times(2)).save(notify);
    }

    @Test
    void processNotify_Failed_WithRetry() {
        // Given
        PaymentNotify notify = createTestNotify();
        doThrow(new RuntimeException("处理失败")).when(paymentService)
                .handlePaymentNotify(anyString());
        when(notifyRepository.save(any(PaymentNotify.class))).thenReturn(notify);

        // When & Then
        assertThrows(BusinessException.class, () -> {
            notifyProcessor.processNotify(notify);
        });

        assertEquals(NotifyStatus.FAILED.getCode(), notify.getProcessStatus());
        verify(notifyRepository, times(2)).save(notify);
    }

    private PaymentNotify createTestNotify() {
        PaymentNotify notify = new PaymentNotify();
        notify.setId(1L);
        notify.setPaymentId("test_payment_id");
        notify.setNotifyData("{\"id\":\"test_payment_id\",\"status\":\"succeeded\"}");
        notify.setNotifyTime(LocalDateTime.now());
        notify.setProcessStatus(NotifyStatus.PENDING.getCode());
        notify.setProcessTimes(0);
        return notify;
    }
}