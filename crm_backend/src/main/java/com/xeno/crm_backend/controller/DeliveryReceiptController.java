package com.xeno.crm_backend.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.xeno.crm_backend.model.CommunicationLog;
import com.xeno.crm_backend.repository.CommunicationLogRepository;

@RestController
@RequestMapping("/api")
public class DeliveryReceiptController {

    @Autowired
    private CommunicationLogRepository logRepository;

    @PostMapping("/delivery-receipt")
public void handleReceipt(@RequestBody Map<String, Object> payload) {
    String campaignId = (String) payload.get("campaignId");
    String customerId = (String) payload.get("customerId");
    String status = (String) payload.get("status");

    System.out.println("Received delivery receipt - Campaign: " + campaignId +
                       ", Customer: " + customerId + ", Status: " + status);

    CommunicationLog log = new CommunicationLog(campaignId, customerId, status, LocalDateTime.now());
    logRepository.save(log);
}

}
