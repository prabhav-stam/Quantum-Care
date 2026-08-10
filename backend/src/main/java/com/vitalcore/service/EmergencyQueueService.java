package com.vitalcore.service;

import com.vitalcore.enums.QueueStatus;
import com.vitalcore.exception.ResourceNotFoundException;
import com.vitalcore.model.EmergencyQueueEntry;
import com.vitalcore.repository.EmergencyQueueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmergencyQueueService {

    private final EmergencyQueueRepository emergencyQueueRepository;

    public EmergencyQueueEntry addToQueue(EmergencyQueueEntry entry) {
        entry.setStatus(QueueStatus.WAITING);
        entry.setCheckedInAt(LocalDateTime.now());
        return emergencyQueueRepository.save(entry);
    }

    public List<EmergencyQueueEntry> getActiveQueue() {
        List<QueueStatus> activeStatuses = Arrays.asList(QueueStatus.WAITING, QueueStatus.IN_PROGRESS);
        List<EmergencyQueueEntry> entries = emergencyQueueRepository.findByStatusIn(activeStatuses);
        
        // Sort in memory to respect enum sort order and checkIn time
        return entries.stream()
                .sorted(Comparator.comparing((EmergencyQueueEntry e) -> e.getPriority().getSortOrder())
                        .thenComparing(EmergencyQueueEntry::getCheckedInAt))
                .collect(Collectors.toList());
    }

    public List<EmergencyQueueEntry> getActiveQueueForDoctor(String doctorId) {
        List<QueueStatus> activeStatuses = Arrays.asList(QueueStatus.WAITING, QueueStatus.IN_PROGRESS);
        List<EmergencyQueueEntry> entries = emergencyQueueRepository.findByAssignedDoctorIdAndStatusIn(doctorId, activeStatuses);
        
        return entries.stream()
                .sorted(Comparator.comparing((EmergencyQueueEntry e) -> e.getPriority().getSortOrder())
                        .thenComparing(EmergencyQueueEntry::getCheckedInAt))
                .collect(Collectors.toList());
    }

    public EmergencyQueueEntry getEntryById(String id) {
        return emergencyQueueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EmergencyQueueEntry", "id", id));
    }

    public EmergencyQueueEntry updateStatus(String id, QueueStatus status, String doctorId, String doctorName) {
        EmergencyQueueEntry entry = getEntryById(id);
        
        entry.setStatus(status);
        
        if (doctorId != null && doctorName != null) {
            entry.setAssignedDoctorId(doctorId);
            entry.setAssignedDoctorName(doctorName);
        }
        
        if (status == QueueStatus.IN_PROGRESS && entry.getStartedAt() == null) {
            entry.setStartedAt(LocalDateTime.now());
        } else if (status == QueueStatus.COMPLETED) {
            entry.setCompletedAt(LocalDateTime.now());
        }
        
        return emergencyQueueRepository.save(entry);
    }
}
