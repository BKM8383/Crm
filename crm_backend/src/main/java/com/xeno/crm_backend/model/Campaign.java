package com.xeno.crm_backend.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "campaigns")
public class Campaign {

    @Id
    private String id;

    private String name;
    private List<Map<String, Object>> rules;
    private long audienceSize;
    private LocalDateTime createdAt;

    public Campaign() {}

    public Campaign(String name, List<Map<String, Object>> rules, long audienceSize, LocalDateTime createdAt) {
        this.name = name;
        this.rules = rules;
        this.audienceSize = audienceSize;
        this.createdAt = createdAt;
    }
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Map<String, Object>> getRules() {
        return rules;
    }

    public void setRules(List<Map<String, Object>> rules) {
        this.rules = rules;
    }

    public long getAudienceSize() {
        return audienceSize;
    }

    public void setAudienceSize(long audienceSize) {
        this.audienceSize = audienceSize;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
