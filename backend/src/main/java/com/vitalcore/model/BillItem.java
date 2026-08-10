package com.vitalcore.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillItem {
    private String description;
    private String itemType;
    private int quantity;
    private double unitPrice;
    private double totalPrice;
}
