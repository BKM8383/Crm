package com.xeno.crm_backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginRedirectController {

    @GetMapping("/login")
    public String redirectToGoogleOAuth() {
        return "redirect:/oauth2/authorization/google";
    }
}