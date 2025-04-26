package com.company.b2bpayment.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {
    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private PaymentLogRepository paymentLogRepository;

    @Mock
    private PaymentNotifyRepository paymentNotifyRepository;

    @Mock
    private HuifuProperties huifuProperties;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    @BeforeEach
    void setUp() {
        when(huifuProperties.getAppId()).thenReturn("test_app_id");
        when(huifuProperties.getApiUrl()).thenReturn("http://test.huifu.com");
        when(huifuProperties.getNotifyUrl()).thenReturn("http://test.notify.com");
    }

    @Test
    void createPayment_Success() throws Exception {
        // Given
        PaymentRequestDTO request = createTestPaymentRequest();
        Payment payment = createTestPayment();
        Map<String, Object> apiResult = createTestApiResult();

        when(objectMapper.writeValueAsString(any())).thenReturn("{}");
        when(objectMapper.readValue(anyString(), any(TypeReference.class))).thenReturn(apiResult);
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);

        // When
        Payment result = paymentService.createPayment(request);

        // Then
        assertNotNull(result);
        assertEquals(payment.getId(), result.getId());
        assertEquals(PaymentStatus.SUCCEEDED.getCode(), result.getStatus());
        verify(paymentLogRepository).save(any(PaymentLog.class));
    }

    @Test
    void createPayment_ValidationFailed() {
        // Given
        PaymentRequestDTO request = new PaymentRequestDTO();

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            paymentService.createPayment(request);
        });
    }

    @Test
    void queryPayment_Success() throws Exception {
        // Given
        String paymentId = "test_payment_id";
        Payment payment = createTestPayment();
        Map<String, Object> queryResult = createTestQueryResult();

        when(paymentRepository.findById(paymentId)).thenReturn(Optional.of(payment));
        when(objectMapper.writeValueAsString(any())).thenReturn("{}");
        when(objectMapper.readValue(anyString(), any(TypeReference.class))).thenReturn(queryResult);

        // When
        Payment result = paymentService.queryPayment(paymentId);

        // Then
        assertNotNull(result);
        assertEquals(paymentId, result.getId());
        verify(paymentLogRepository).save(any(PaymentLog.class));
    }

    @Test
    void handlePaymentNotify_Success() throws Exception {
        // Given
        String notifyData = createTestNotifyData();
        Payment payment = createTestPayment();
        Map<String, Object> notifyMap = createTestNotifyMap();

        when(objectMapper.readValue(notifyData, Map.class)).thenReturn(notifyMap);
        when(paymentRepository.findById(anyString())).thenReturn(Optional.of(payment));

        // When
        paymentService.handlePaymentNotify(notifyData);

        // Then
        verify(paymentRepository).save(any(Payment.class));
        verify(paymentLogRepository).save(any(PaymentLog.class));
    }

    private PaymentRequestDTO createTestPaymentRequest() {
        PaymentRequestDTO request = new PaymentRequestDTO();
        request.setOrderNo("TEST_ORDER_" + System.currentTimeMillis());
        request.setPayChannel(PaymentConstant.CHANNEL_BANK_PAY);
        request.setPayAmt(new BigDecimal("100.00"));
        request.setGoodsTitle("测试商品");
        request.setGoodsDesc("测试商品描述");

        Map<String, Object> expend = new HashMap<>();
        expend.put("elements_type", "4");
        expend.put("card_name", "测试用户");
        expend.put("card_no", "6222021234567890");
        request.setExpend(expend);

        return request;
    }

    private Payment createTestPayment() {
        Payment payment = new Payment();
        payment.setId("test_payment_id");
        payment.setOrderNo("TEST_ORDER_" + System.currentTimeMillis());
        payment.setAppId("test_app_id");
        payment.setPayChannel(PaymentConstant.CHANNEL_BANK_PAY);
        payment.setPayAmt(new BigDecimal("100.00"));
        payment.setStatus(PaymentStatus.SUCCEEDED.getCode());
        payment.setCreatedTime(LocalDateTime.now());
        return payment;
    }

    private Map<String, Object> createTestApiResult() {
        Map<String, Object> result = new HashMap<>();
        result.put("id", "test_payment_id");
        result.put("status", PaymentStatus.SUCCEEDED.getCode());
        return result;
    }

    private Map<String, Object> createTestQueryResult() {
        return createTestApiResult();
    }

    private String createTestNotifyData() {
        return "{\"id\":\"test_payment_id\",\"status\":\"succeeded\"}";
    }

    private Map<String, Object> createTestNotifyMap() {
        return createTestApiResult();
    }
}