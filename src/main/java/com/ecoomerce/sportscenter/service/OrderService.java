package com.ecoomerce.sportscenter.service;

import com.ecoomerce.sportscenter.model.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {
    OrderResponse getOrderById(Integer orderId);
    List<OrderResponse> getAllOrders();
    Page<OrderResponse> getAllOrders(Pageable pageable);
    OrderResponse createOrder(OrderResponse order);
    OrderResponse updateOrder(OrderResponse order);
    void deleteOrder(Integer orderId);
}
