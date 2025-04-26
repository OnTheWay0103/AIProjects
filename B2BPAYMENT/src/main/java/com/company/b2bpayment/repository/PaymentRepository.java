package com.company.b2bpayment.repository;

import com.company.b2bpayment.model.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    Optional<Payment> findByOrderNo(String orderNo);

    List<Payment> findByStatus(String status);
}