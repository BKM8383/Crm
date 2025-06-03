package com.xeno.crm_backend.controller;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
public class OAuthSuccessController {

    @GetMapping("/api/oauth2/success")
    public void success(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        String redirectUri = request.getParameter("redirect_uri");
        if (redirectUri == null || redirectUri.isEmpty()) {
            redirectUri = "http://localhost:3000/";
        }
        response.sendRedirect(redirectUri);
    }
}
