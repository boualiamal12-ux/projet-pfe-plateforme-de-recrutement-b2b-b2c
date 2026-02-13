package com.example.Plateforme.de.Recrutement.config;

import org.springframework.stereotype.Component;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    // Token simple: juste ya3mel encode lél Email + Date
    public String generateToken(String email, String role) {
        String rawToken = email + ":" + role + ":" + new Date().getTime();
        return Base64.getEncoder().encodeToString(rawToken.getBytes());
    }

    // Method bech t-thabbet fil token (Optionnel)
    public boolean validateToken(String token) {
        return token != null && !token.isEmpty();
    }

    public String extractUsername(String token) {
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(token);
            String decodedString = new String(decodedBytes);
            return decodedString.split(":")[0]; // Traja3 el Email
        } catch (Exception e) {
            return null;
        }
    }
}