package com.xeno.crm_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.xeno.crm_backend.model.Customer;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {
	
}
