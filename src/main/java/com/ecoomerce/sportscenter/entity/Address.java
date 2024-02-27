package com.ecoomerce.sportscenter.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="Address")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="Id")
    private Integer id;
    @Column(name="Name")
    private String name;
    @Column(name="Address1")
    private String address1;
    @Column(name="Address2")
    private String address2;
    @Column(name="City")
    private String city;
    @Column(name="State")
    private String state;
    @Column(name="ZipCode")
    private String zipCode;
    @Column(name="Country")
    private String country;
}
