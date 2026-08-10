package com.vitalcore.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "medical_records")
public class MedicalRecord {

    @Id
    private String id;

    @Indexed
    private String patientId;
    
    private String doctorId;
    private String appointmentId;
    
    private String patientName;
    private String doctorName;
    
    private String diagnosis;
    private String treatmentNotes;
    
    private LocalDate visitDate;

    @CreatedDate
    private LocalDateTime createdAt;
}
