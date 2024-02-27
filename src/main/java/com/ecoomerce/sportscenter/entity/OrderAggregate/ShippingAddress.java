package com.ecoomerce.sportscenter.entity.OrderAggregate;

import com.ecoomerce.sportscenter.entity.Address;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable // Use Embeddable instead of Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShippingAddress {
    private String name;
    private String address1;
    private String address2;
    private String city;
    private String state;
    private String zipCode;
    private String country;
}
