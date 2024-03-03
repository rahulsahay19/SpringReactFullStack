package com.ecoomerce.sportscenter.service;

import com.ecoomerce.sportscenter.model.OrderDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {
    OrderDto getOrderById(Integer orderId);
    List<OrderDto> getAllOrders();
    Page<OrderDto> getAllOrders(Pageable pageable);
    Integer createOrder(OrderDto order);
    void deleteOrder(Integer orderId);
}
