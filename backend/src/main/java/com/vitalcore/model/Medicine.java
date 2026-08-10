package com.vitalcore.model;

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
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "medicines")
public class Medicine {

    @Id
    private String id;

    @Indexed
    private String name;
    
    private String genericName;
    private String category;
    private String manufacturer;
    private double unitPrice;
    private int stockQuantity;
    
    @Builder.Default
    private int reorderLevel = 10;
    
    private LocalDate expiryDate;
    
    @Builder.Default
    private boolean isActive = true;
    
    @Builder.Default
    private List<InventoryTransaction> transactions = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
