package com.ecoomerce.sportscenter.repository;

import com.ecoomerce.sportscenter.entity.OrderAggregate.Order;
import com.ecoomerce.sportscenter.entity.OrderAggregate.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    // Define custom queries for Order entity

    // Example: Find orders by basketId
    List<Order> findByBasketId(String basketId);

    // Example: Find orders by order status
    List<Order> findByOrderStatus(OrderStatus orderStatus);

    // Example: Find orders by order date range
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Example: Find orders by product name in order items
    @Query("SELECT o FROM Order o JOIN o.orderItems oi WHERE oi.itemOrdered.name LIKE %:productName%")
    List<Order> findByProductNameInOrderItems(@Param("productName") String productName);

    // Example: Find orders by shipping address
    @Query("SELECT o FROM Order o WHERE o.shippingAddress.city = :city")
    List<Order> findByShippingAddressCity(@Param("city") String city);

}
