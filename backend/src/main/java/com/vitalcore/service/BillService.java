package com.vitalcore.service;

import com.vitalcore.enums.PaymentStatus;
import com.vitalcore.exception.ResourceNotFoundException;
import com.vitalcore.model.Bill;
import com.vitalcore.model.BillItem;
import com.vitalcore.repository.BillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillService {

    private final BillRepository billRepository;

    public Bill generateBill(Bill bill) {
        if (bill.getBillDate() == null) {
            bill.setBillDate(LocalDate.now());
        }
        
        // Calculate totals
        double total = 0;
        if (bill.getItems() != null) {
            for (BillItem item : bill.getItems()) {
                double itemTotal = item.getQuantity() * item.getUnitPrice();
                item.setTotalPrice(itemTotal);
                total += itemTotal;
            }
        }
        
        bill.setTotalAmount(total);
        double net = total - bill.getDiscount() + bill.getTax();
        bill.setNetAmount(net);
        
        if (bill.getPaymentStatus() == null) {
            bill.setPaymentStatus(PaymentStatus.PENDING);
        }
        
        return billRepository.save(bill);
    }

    public List<Bill> getBillsByPatientId(String patientId) {
        return billRepository.findByPatientId(patientId);
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Bill getBillById(String id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "id", id));
    }

    public Bill updatePaymentStatus(String id, PaymentStatus status) {
        Bill bill = getBillById(id);
        bill.setPaymentStatus(status);
        return billRepository.save(bill);
    }
}
