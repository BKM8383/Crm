package com.xeno.crm_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.xeno.crm_backend.model.Campaign;

public interface CampaignRepository extends MongoRepository<Campaign, String> {
}
