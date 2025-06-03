package com.xeno.crm_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

    @GetMapping("/user")
    public ResponseEntity<?> getUser(Authentication authentication) {
        if (authentication == null) {
            System.out.println("No authentication found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
        OAuth2User user = (OAuth2User) authentication.getPrincipal();
        System.out.println(" Authenticated as: " + user.getAttribute("email"));

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("email", user.getAttribute("email"));
        userInfo.put("name", user.getAttribute("name"));
        return ResponseEntity.ok(userInfo);
    }
}
