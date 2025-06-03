package com.xeno.crm_backend.pubsub;

public class DeliveryEvent {
    private String campaignId;
    private String customerId;
    private String status;

    public DeliveryEvent(String campaignId, String customerId, String status) {
        this.campaignId = campaignId;
        this.customerId = customerId;
        this.status = status;
    }

    // Getters
    public String getCampaignId() { return campaignId; }
    public String getCustomerId() { return customerId; }
    public String getStatus() { return status; }
}
