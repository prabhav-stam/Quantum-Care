package com.vitalcore.controller;

import com.vitalcore.model.Medicine;
import com.vitalcore.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Medicine> addMedicine(@RequestBody Medicine medicine) {
        return new ResponseEntity<>(medicineService.addMedicine(medicine), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<List<Medicine>> searchMedicines(@RequestParam String query) {
        return ResponseEntity.ok(medicineService.searchMedicines(query));
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Medicine>> getLowStockMedicines() {
        return ResponseEntity.ok(medicineService.getLowStockMedicines());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable String id) {
        return ResponseEntity.ok(medicineService.getMedicineById(id));
    }

    @PostMapping("/{id}/add-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Medicine> addStock(
            @PathVariable String id,
            @RequestParam int quantity,
            @RequestParam String userId) {
        return ResponseEntity.ok(medicineService.addStock(id, quantity, userId));
    }

    @PostMapping("/{id}/dispense")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Medicine> dispenseStock(
            @PathVariable String id,
            @RequestParam int quantity,
            @RequestParam String userId,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(medicineService.dispenseStock(id, quantity, userId, notes));
    }
}
