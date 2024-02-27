package com.ecoomerce.sportscenter.mapper;

import com.ecoomerce.sportscenter.entity.OrderAggregate.Order;
import com.ecoomerce.sportscenter.model.OrderResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
public interface OrderMapper {
    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);
    @Mapping(source = "id", target = "id")
    @Mapping(source = "basketId", target = "basketId")
    @Mapping(source = "shippingAddress", target = "shippingAddress")
    @Mapping(source = "subTotal", target = "subTotal")
    @Mapping(source = "deliveryFee", target = "deliveryFee")
    OrderResponse orderToOrderResponse(Order order);
    Order orderResponseToOrder(OrderResponse orderResponse);
    List<OrderResponse> ordersToOrderResponses(List<Order> orders);
    void updateOrderFromOrderResponse(OrderResponse orderResponse, @MappingTarget Order order);
}
