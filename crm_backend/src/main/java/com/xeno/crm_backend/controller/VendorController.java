package com.xeno.crm_backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/vendor")
public class VendorController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final Random random = new Random();

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> simulateDelivery(@RequestBody Map<String, Object> payload) {
        String campaignId = (String) payload.get("campaignId");
        String customerId = (String) payload.get("customerId");

        boolean isSent = random.nextDouble() < 0.9;
        String status = isSent ? "SENT" : "FAILED";

        Map<String, Object> receipt = new HashMap<>();
        receipt.put("campaignId", campaignId);
        receipt.put("customerId", customerId);
        receipt.put("status", status);

        restTemplate.postForObject("http://localhost:8080/api/delivery-receipt", receipt, Void.class);

        Map<String, Object> response = new HashMap<>();
        response.put("status", status);
        return ResponseEntity.ok(response);
    }
}
