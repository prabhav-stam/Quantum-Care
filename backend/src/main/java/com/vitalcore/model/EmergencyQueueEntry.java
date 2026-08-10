package com.vitalcore.model;

import com.vitalcore.enums.Priority;
import com.vitalcore.enums.QueueStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "emergency_queue")
public class EmergencyQueueEntry {

    @Id
    private String id;

    private String patientId;
    private String patientName;
    
    private String assignedDoctorId;
    private String assignedDoctorName;
    
    private String symptoms;
    private Priority priority;
    
    @Builder.Default
    private QueueStatus status = QueueStatus.WAITING;
    
    private String triageNotes;
    
    @Builder.Default
    private LocalDateTime checkedInAt = LocalDateTime.now();
    
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
