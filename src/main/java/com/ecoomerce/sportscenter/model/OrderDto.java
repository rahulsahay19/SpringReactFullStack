package com.ecoomerce.sportscenter.model;

import com.ecoomerce.sportscenter.entity.OrderAggregate.ShippingAddress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto {
    private Integer id;
    private String basketId;
    private ShippingAddress shippingAddress;
    private Long subTotal;
    private Long deliveryFee;
}