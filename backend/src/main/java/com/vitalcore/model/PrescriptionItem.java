package com.vitalcore.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionItem {
    private String medicineId;
    private String medicineName;
    private String dosage;
    private String frequency;
    private String duration;
    private String instructions;
}
