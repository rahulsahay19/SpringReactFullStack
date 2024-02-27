package com.ecoomerce.sportscenter.mapper;

import com.ecoomerce.sportscenter.entity.OrderAggregate.Order;
import com.ecoomerce.sportscenter.model.OrderDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface OrderMapper {
    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);
    @Mapping(source = "id", target = "id")
    @Mapping(source = "basketId", target = "basketId")
    @Mapping(source = "shippingAddress", target = "shippingAddress")
    @Mapping(source = "subTotal", target = "subTotal")
    @Mapping(source = "deliveryFee", target = "deliveryFee")
    OrderDto orderToOrderResponse(Order order);
    Order orderResponseToOrder(OrderDto orderDto);
    List<OrderDto> ordersToOrderResponses(List<Order> orders);
    void updateOrderFromOrderResponse(OrderDto orderDto, @MappingTarget Order order);
}
