package com.vitalcore.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorSchedule {
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    
    @Builder.Default
    private int slotDurationMinutes = 30;
    
    @Builder.Default
    private boolean isAvailable = true;
}
