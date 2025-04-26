package com.company.b2bpayment.repository;

import com.company.b2bpayment.model.entity.PaymentLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentLogRepository extends JpaRepository<PaymentLog, Long> {
    List<PaymentLog> findByPaymentIdOrderByCreatedTimeDesc(String paymentId);

    List<PaymentLog> findByOrderNoOrderByCreatedTimeDesc(String orderNo);
}