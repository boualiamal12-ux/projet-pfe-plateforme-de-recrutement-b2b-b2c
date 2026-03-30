package com.example.Plateforme.de.Recrutement.Security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    // 💡 Spring yjib el ra9m mel application.properties
    @Value("${jwt.expiration}")
    private long expirationTime;

    // 1. Génération mta3 el Token m3a Expiration
    public String generateToken(String email, String role) {
        long now = new Date().getTime();
        long expiryDate = now + expirationTime; // Nzidou el modda (24h)

        // El format mte3na ywalli: email:role:dateExpiration
        String rawToken = email + ":" + role + ":" + expiryDate;
        return Base64.getEncoder().encodeToString(rawToken.getBytes());
    }

    // 2. Validation mta3 el wa9t (Expiration)
    public boolean validateToken(String token) {
        try {
            if (token == null || token.isEmpty()) return false;

            String decodedString = new String(Base64.getDecoder().decode(token));
            String[] parts = decodedString.split(":");

            // Nejbdou el date d'expiration elli sena3neha fel generateToken
            long expiryDate = Long.parseLong(parts[2]);

            // N9arnou: ken el wa9t mta3 tawa fét el expiration => Token ghalat
            return new Date().getTime() < expiryDate;
        } catch (Exception e) {
            return false; // Token fased wala format ghalat
        }
    }

    // 3. Extraction mta3 el Email
    public String extractUsername(String token) {
        try {
            String decodedString = new String(Base64.getDecoder().decode(token));
            return decodedString.split(":")[0];
        } catch (Exception e) {
            return null;
        }
    }
}