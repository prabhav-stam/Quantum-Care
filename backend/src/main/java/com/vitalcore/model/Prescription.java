package com.vitalcore.model;

import com.vitalcore.enums.PrescriptionStatus;
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
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "prescriptions")
public class Prescription {

    @Id
    private String id;

    private String medicalRecordId;

    @Indexed
    private String patientId;
    
    private String doctorId;
    private String patientName;
    private String doctorName;
    
    private LocalDate prescriptionDate;
    
    @Builder.Default
    private PrescriptionStatus status = PrescriptionStatus.ACTIVE;
    
    private String notes;
    
    private List<PrescriptionItem> items;
    
    // Image of the physical prescription, stored as a Base64 string
    private String prescriptionImageBase64;

    @CreatedDate
    private LocalDateTime createdAt;
}
