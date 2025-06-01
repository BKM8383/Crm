package com.xeno.crm_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.xeno.crm_backend.model.Customer;

@RestController
@RequestMapping("/api/customers")
public class CustomerFilterController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @PostMapping("/filter")
    public long filterCustomers(@RequestBody List<Map<String, Object>> rules) {
        Query query = new Query();
        Criteria combined = null;

        for (int i = 0; i < rules.size(); i++) {
            Map<String, Object> rule = rules.get(i);
            String field = (String) rule.get("field");
            String op = (String) rule.get("operator");
            Object value = rule.get("value");
            String condition = (String) rule.get("condition");

            Criteria criteria;
            switch (op) {
                case ">":
                    criteria = Criteria.where(field).gt(value);
                    break;
                case "<":
                    criteria = Criteria.where(field).lt(value);
                    break;
                case "=":
                    criteria = Criteria.where(field).is(value);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid operator: " + op);
            }

            if (i == 0) {
                combined = criteria;
            } else if ("AND".equalsIgnoreCase(condition)) {
                combined = new Criteria().andOperator(combined, criteria);
            } else {
                combined = new Criteria().orOperator(combined, criteria);
            }
        }

        if (combined != null) {
            query.addCriteria(combined);
        }

        return mongoTemplate.count(query, Customer.class);
    }
}
