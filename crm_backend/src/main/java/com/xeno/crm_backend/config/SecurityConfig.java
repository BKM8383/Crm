package com.xeno.crm_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/vendor/send").permitAll()
                .requestMatchers("/api/delivery-receipt").permitAll()
                .requestMatchers("/", "/login**", "/error", "/actuator/**",
                                 "/oauth2/**", "/login/oauth2/**").permitAll()
                .requestMatchers("/api/ai/**").permitAll()
                .requestMatchers("/api/**", "/vendor/**").authenticated()
                .anyRequest().permitAll()
            )
            .oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(auth -> auth.baseUri("/oauth2/authorization"))
                .redirectionEndpoint(redir -> redir.baseUri("/login/oauth2/code/*"))
                .defaultSuccessUrl("http://localhost:3000/", true)
                .failureUrl("/login?error=true")
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .maximumSessions(1)
                .maxSessionsPreventsLogin(false)
            );
        return http.build();
    }
}
