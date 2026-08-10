package com.vitalcore.controller;

import com.vitalcore.enums.QueueStatus;
import com.vitalcore.model.EmergencyQueueEntry;
import com.vitalcore.service.EmergencyQueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency-queue")
@RequiredArgsConstructor
public class EmergencyQueueController {

    private final EmergencyQueueService emergencyQueueService;

    @PostMapping
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    public ResponseEntity<EmergencyQueueEntry> addToQueue(@RequestBody EmergencyQueueEntry entry) {
        return new ResponseEntity<>(emergencyQueueService.addToQueue(entry), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<List<EmergencyQueueEntry>> getActiveQueue() {
        return ResponseEntity.ok(emergencyQueueService.getActiveQueue());
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<List<EmergencyQueueEntry>> getActiveQueueForDoctor(@PathVariable String doctorId) {
        return ResponseEntity.ok(emergencyQueueService.getActiveQueueForDoctor(doctorId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('DOCTOR', 'RECEPTIONIST', 'ADMIN')")
    public ResponseEntity<EmergencyQueueEntry> updateStatus(
            @PathVariable String id,
            @RequestParam QueueStatus status,
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String doctorName) {
        return ResponseEntity.ok(emergencyQueueService.updateStatus(id, status, doctorId, doctorName));
    }
}
