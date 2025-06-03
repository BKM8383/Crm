package com.xeno.crm_backend.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.xeno.crm_backend.model.Campaign;
import com.xeno.crm_backend.model.CommunicationLog;
import com.xeno.crm_backend.model.Customer;
import com.xeno.crm_backend.repository.CampaignRepository;
import com.xeno.crm_backend.repository.CommunicationLogRepository;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {

    @Autowired
private CommunicationLogRepository logRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private org.springframework.data.mongodb.core.MongoTemplate mongoTemplate;

    @PostMapping
    public Campaign saveCampaign(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        List<Map<String, Object>> rules = new com.fasterxml.jackson.databind.ObjectMapper()
                .convertValue(request.get("rules"), new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>() {});
        long audienceSize = ((Number) request.get("audienceSize")).longValue();

        Campaign campaign = new Campaign(name, rules, audienceSize, LocalDateTime.now());
        return campaignRepository.save(campaign);
    }

    @GetMapping
    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }
    private final RestTemplate restTemplate = new RestTemplate();

@GetMapping("/stats/{campaignId}")
public Map<String, Long> getStats(@PathVariable String campaignId) {
    List<CommunicationLog> logs = logRepository.findByCampaignId(campaignId);

    long sent = logs.stream().filter(log -> "SENT".equalsIgnoreCase(log.getStatus())).count();
    long failed = logs.stream().filter(log -> "FAILED".equalsIgnoreCase(log.getStatus())).count();

    Map<String, Long> stats = new HashMap<>();
    stats.put("sent", sent);
    stats.put("failed", failed);
    return stats;
}

@PostMapping("/deliver")
public void deliverCampaign(@RequestBody Map<String, Object> payload) {
    String campaignId = (String) payload.get("campaignId");
    List<Map<String, Object>> rules = new com.fasterxml.jackson.databind.ObjectMapper()
            .convertValue(payload.get("rules"), new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>() {});
    Query query = new Query();
    Criteria combined = null;

    for (int i = 0; i < rules.size(); i++) {
        Map<String, Object> rule = rules.get(i);
        String field = (String) rule.get("field");
        String op = (String) rule.get("operator");
        Object rawValue = rule.get("value");

        Number value;
        if (rawValue instanceof Number n) {
            value = n;
        } else if (rawValue != null) {
            value = Double.valueOf(rawValue.toString());
        } else {
            throw new IllegalArgumentException("Rule value cannot be null");
        }

        Criteria criteria = switch (op) {
            case ">" -> Criteria.where(field).gt(value);
            case "<" -> Criteria.where(field).lt(value);
            case "=" -> Criteria.where(field).is(value);
            default -> null;
        };
        if (criteria == null) {
            continue;
        }

        if (i == 0) {
            combined = criteria;
        } else {
            String condition = (String) rule.get("condition");
            combined = "AND".equalsIgnoreCase(condition)
                    ? new Criteria().andOperator(combined, criteria)
                    : new Criteria().orOperator(combined, criteria);
        }
    }

    if (combined != null) {
        query.addCriteria(combined);
    }

    List<Customer> recipients = mongoTemplate.find(query, Customer.class);

    for (Customer customer : recipients) {
        Map<String, Object> body = new HashMap<>();
        body.put("campaignId", campaignId);
        body.put("customerId", customer.getId());

        restTemplate.postForObject("http://localhost:8080/vendor/send", body, Void.class);
    }
    System.out.println("🚀 Delivering campaign: " + campaignId);
    System.out.println("📬 Matching customers: " + recipients.size());

}
}
