package com.vitalcore.service;

import com.vitalcore.exception.ResourceNotFoundException;
import com.vitalcore.model.InventoryTransaction;
import com.vitalcore.model.Medicine;
import com.vitalcore.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public Medicine addMedicine(Medicine medicine) {
        if (medicine.getTransactions() == null) {
            medicine.setTransactions(new ArrayList<>());
        }
        return medicineRepository.save(medicine);
    }

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public List<Medicine> searchMedicines(String query) {
        return medicineRepository.findByNameContainingIgnoreCase(query);
    }

    public List<Medicine> getLowStockMedicines() {
        // Need to check the repository method for this, we defined findByStockQuantityLessThanEqual
        // Wait, MongoDB might not support comparing two fields directly in a derived query easily without @Query
        // For simplicity, we just fetch all and filter in memory if needed, or rely on a simple query
        // For now, let's just fetch all and filter in memory for low stock
        return medicineRepository.findByIsActiveTrue().stream()
                .filter(m -> m.getStockQuantity() <= m.getReorderLevel())
                .toList();
    }

    public Medicine getMedicineById(String id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine", "id", id));
    }

    public Medicine addStock(String id, int quantity, String userId) {
        Medicine medicine = getMedicineById(id);
        medicine.setStockQuantity(medicine.getStockQuantity() + quantity);
        
        InventoryTransaction tx = new InventoryTransaction();
        tx.setType("PURCHASE");
        tx.setQuantity(quantity);
        tx.setDate(LocalDateTime.now());
        tx.setPerformedBy(userId);
        
        medicine.getTransactions().add(tx);
        return medicineRepository.save(medicine);
    }

    public Medicine dispenseStock(String id, int quantity, String userId, String notes) {
        Medicine medicine = getMedicineById(id);
        if (medicine.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock for " + medicine.getName());
        }
        
        medicine.setStockQuantity(medicine.getStockQuantity() - quantity);
        
        InventoryTransaction tx = new InventoryTransaction();
        tx.setType("DISPENSED");
        tx.setQuantity(-quantity);
        tx.setDate(LocalDateTime.now());
        tx.setPerformedBy(userId);
        tx.setNotes(notes);
        
        medicine.getTransactions().add(tx);
        return medicineRepository.save(medicine);
    }
}
