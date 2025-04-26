package com.company.b2bpayment.repository;

import com.company.b2bpayment.model.entity.PaymentNotify;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentNotifyRepository extends JpaRepository<PaymentNotify, Long> {
    List<PaymentNotify> findByPaymentIdOrderByNotifyTimeDesc(String paymentId);

    List<PaymentNotify> findByProcessStatusAndProcessTimesLessThan(String status, Integer maxTimes);
}