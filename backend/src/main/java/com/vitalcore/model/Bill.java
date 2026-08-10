package com.vitalcore.model;

import com.vitalcore.enums.PaymentMethod;
import com.vitalcore.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bills")
public class Bill {

    @Id
    private String id;

    @Indexed
    private String patientId;
    
    private String appointmentId;
    private String patientName;
    
    private LocalDate billDate;
    
    private List<BillItem> items;
    
    private double totalAmount;
    
    @Builder.Default
    private double discount = 0;
    
    @Builder.Default
    private double tax = 0;
    
    private double netAmount;
    
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    private PaymentMethod paymentMethod;
    
    // Image of the physical bill, stored as a Base64 string
    private String billImageBase64;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
