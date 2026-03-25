// ✅ AJOUTE HAD EL LIGNE FEL SecurityConfig.java
// fel .authorizeHttpRequests block, zid:
//    .requestMatchers("/api/cours/**").permitAll()
// Ba3d:
//    .requestMatchers("/api/entreprises/**").permitAll()

// ─────────────────────────────────────────────────────────
// FULL SecurityConfig.java (copie tout le fichier):
// ─────────────────────────────────────────────────────────

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
                        .requestMatchers("/api/cours/**").permitAll()  // ✅ JADID
                        .requestMatchers("/api/matching/**").permitAll() // ✅ AJOUTE CETTE LIGNE ICI
                        .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}