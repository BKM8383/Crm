package com.xeno.crm_backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.xeno.crm_backend.model.CommunicationLog;

@Repository
public interface CommunicationLogRepository extends MongoRepository<CommunicationLog, String> {
    List<CommunicationLog> findByCampaignId(String campaignId);
}
