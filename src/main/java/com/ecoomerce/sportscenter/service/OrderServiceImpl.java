package com.ecoomerce.sportscenter.service;

import com.ecoomerce.sportscenter.entity.Brand;
import com.ecoomerce.sportscenter.entity.OrderAggregate.Order;
import com.ecoomerce.sportscenter.entity.OrderAggregate.OrderItem;
import com.ecoomerce.sportscenter.entity.OrderAggregate.ProductItemOrdered;
import com.ecoomerce.sportscenter.entity.Product;
import com.ecoomerce.sportscenter.entity.Type;
import com.ecoomerce.sportscenter.mapper.OrderMapper;
import com.ecoomerce.sportscenter.model.BasketItemResponse;
import com.ecoomerce.sportscenter.model.BasketResponse;
import com.ecoomerce.sportscenter.model.OrderResponse;
import com.ecoomerce.sportscenter.repository.BrandRepository;
import com.ecoomerce.sportscenter.repository.OrderRepository;
import com.ecoomerce.sportscenter.repository.TypeRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final BrandRepository brandRepository;
    private final TypeRepository typeRepository;
    private final BasketService basketService;
    private final OrderMapper orderMapper;

    public OrderServiceImpl(OrderRepository orderRepository, BrandRepository brandRepository, TypeRepository typeRepository, BasketService basketService, OrderMapper orderMapper) {
        this.orderRepository = orderRepository;
        this.brandRepository = brandRepository;
        this.typeRepository = typeRepository;
        this.basketService = basketService;
        this.orderMapper = orderMapper;
    }

    @Override
    public OrderResponse getOrderById(Integer orderId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        return optionalOrder.map(orderMapper::orderToOrderResponse).orElse(null);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(orderMapper::orderToOrderResponse).collect(Collectors.toList());
    }

    @Override
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(orderMapper::orderToOrderResponse);
    }

    @Override
    public OrderResponse createOrder(OrderResponse orderResponse) {
        // Fetch basket details
        BasketResponse basketResponse = basketService.getBasketById(orderResponse.getBasketId());
        if (basketResponse == null) {
            // Basket not found
            log.error("Basket with ID {} not found.", orderResponse.getBasketId());
            return null;
        }

        // Map basket items to order items
        List<OrderItem> orderItems = basketResponse.getItems().stream()
                .map(this::mapBasketItemToOrderItem)
                .collect(Collectors.toList());

        // Set order details
        Order order = orderMapper.orderResponseToOrder(orderResponse);
        order.setOrderItems(orderItems);

        // Save the order
        return orderMapper.orderToOrderResponse(orderRepository.save(order));
    }

    @Override
    public OrderResponse updateOrder(OrderResponse orderResponse) {
        // Check if the order exists
        Optional<Order> optionalExistingOrder = orderRepository.findById(orderResponse.getId());
        if (optionalExistingOrder.isPresent()) {
            // Update the existing order
            Order existingOrder = optionalExistingOrder.get();
            // You might need to perform additional mappings here if necessary
            orderMapper.updateOrderFromOrderResponse(orderResponse, existingOrder);
            return orderMapper.orderToOrderResponse(orderRepository.save(existingOrder));
        } else {
            log.error("Order with ID {} not found, cannot update.", orderResponse.getId());
            return null;
        }
    }

    @Override
    public void deleteOrder(Integer orderId) {
        orderRepository.deleteById(orderId);
    }

    private OrderItem mapBasketItemToOrderItem(BasketItemResponse basketItemResponse) {
        if (basketItemResponse != null) {
            OrderItem orderItem = new OrderItem();
            orderItem.setItemOrdered(mapBasketItemToProduct(basketItemResponse));
            orderItem.setQuantity(basketItemResponse.getQuantity());
            return orderItem;
        } else {
            // Handle the case where basketItemResponse is null
            return null;
        }
    }

    private ProductItemOrdered mapBasketItemToProduct(BasketItemResponse basketItemResponse) {
        ProductItemOrdered productItemOrdered = new ProductItemOrdered();
        // Populate productItemOrdered with data from basketItemResponse
        productItemOrdered.setName(basketItemResponse.getName());
        productItemOrdered.setPictureUrl(basketItemResponse.getPictureUrl());
        productItemOrdered.setProductId(basketItemResponse.getId());
        // Set other properties as needed

        return productItemOrdered;
    }

    private Product mapBasketItemToProductEntity(BasketItemResponse basketItemResponse) {
        Product product = new Product();
        product.setId(basketItemResponse.getId());
        product.setName(basketItemResponse.getName());
        product.setDescription(basketItemResponse.getDescription());
        product.setPrice(basketItemResponse.getPrice());
        product.setPictureUrl(basketItemResponse.getPictureUrl());
        // Fetch Brand and Type entities based on the names provided in the BasketItemResponse
        Brand brand = brandRepository.findByName(basketItemResponse.getProductBrand());
        Type type = typeRepository.findByName(basketItemResponse.getProductType());
        product.setBrand(brand);
        product.setType(type);
        return product;
    }
}