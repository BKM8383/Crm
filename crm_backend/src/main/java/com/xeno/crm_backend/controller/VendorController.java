package com.xeno.crm_backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.xeno.crm_backend.pubsub.DeliveryEvent;
import com.xeno.crm_backend.pubsub.EventPublisher;

@RestController
@RequestMapping("/vendor")
public class VendorController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final Random random = new Random();

 @Autowired
private EventPublisher eventPublisher;

@PostMapping("/send")
public ResponseEntity<Map<String, Object>> simulateDelivery(@RequestBody Map<String, Object> payload) {
    String campaignId = (String) payload.get("campaignId");
    String customerId = (String) payload.get("customerId");

    boolean isSent = random.nextDouble() < 0.9;
    String status = isSent ? "SENT" : "FAILED";

    eventPublisher.publish(new DeliveryEvent(campaignId, customerId, status)); 

    Map<String, Object> response = new HashMap<>();
    response.put("status", status);
    return ResponseEntity.ok(response);
}

}
