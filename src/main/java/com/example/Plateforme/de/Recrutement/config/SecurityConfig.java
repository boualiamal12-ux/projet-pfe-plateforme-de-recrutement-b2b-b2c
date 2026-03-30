package com.example.Plateforme.de.Recrutement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                // ✅ FIX PRINCIPAL — disable el HTTP Basic authentication
                // sinon Spring yb3ath 401/403 hatta lel permitAll endpoints
                // ken el Authorization header mish valid
                .httpBasic(basic -> basic.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/admin/**").permitAll()
                        .requestMatchers("/api/offres/**").permitAll()
                        .requestMatchers("/api/candidatures/**").permitAll()
                        .requestMatchers("/api/candidats/**").permitAll()
                        .requestMatchers("/api/visa/**").permitAll()
                        .requestMatchers("/api/entreprises/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}