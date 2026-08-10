package com.vitalcore.repository;

import com.vitalcore.enums.PaymentStatus;
import com.vitalcore.model.Bill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BillRepository extends MongoRepository<Bill, String> {
    List<Bill> findByPatientId(String patientId);
    List<Bill> findByPaymentStatus(PaymentStatus paymentStatus);
    List<Bill> findByBillDateBetween(LocalDate startDate, LocalDate endDate);
}
