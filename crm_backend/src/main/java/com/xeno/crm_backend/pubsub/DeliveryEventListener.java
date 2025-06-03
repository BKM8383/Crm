package com.xeno.crm_backend.pubsub;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.xeno.crm_backend.model.CommunicationLog;
import com.xeno.crm_backend.repository.CommunicationLogRepository;

@Component
public class DeliveryEventListener {

    @Autowired
    private CommunicationLogRepository logRepository;

    @EventListener
    public void handleDeliveryEvent(DeliveryEvent event) {
        System.out.println(" [PubSub] Event received for campaign: " + event.getCampaignId());

        CommunicationLog log = new CommunicationLog(
                event.getCampaignId(),
                event.getCustomerId(),
                event.getStatus(),
                LocalDateTime.now()
        );

        logRepository.save(log);
    }
}


