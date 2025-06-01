package com.xeno.crm_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.xeno.crm_backend.model.Order;
import com.xeno.crm_backend.repository.OrderRepository;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository OrderRepository;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order Order) {
        Order savedOrder = OrderRepository.save(Order);
        return ResponseEntity.ok(savedOrder);
    }    
}
