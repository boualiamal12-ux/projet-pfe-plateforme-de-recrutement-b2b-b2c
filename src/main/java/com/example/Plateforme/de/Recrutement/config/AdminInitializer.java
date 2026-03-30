package com.example.Plateforme.de.Recrutement.config;

import com.example.Plateforme.de.Recrutement.enums.Role;
import com.example.Plateforme.de.Recrutement.model.Utilisateur;
import com.example.Plateforme.de.Recrutement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminInitializer {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Bean
    CommandLineRunner initAdmin() {
        return args -> {
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                Utilisateur admin = new Utilisateur();
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ADMIN);
                admin.setValidated(true); // ✅

                userRepository.save(admin);

                System.out.println("--------------------------------------");
                System.out.println("✅ Compte Admin créé via configuration :");
                System.out.println("📧 Email : " + adminEmail);
                System.out.println("🔑 Password : [PROTECTED]");
                System.out.println("--------------------------------------");
            } else {
                System.out.println("ℹ️ Compte Admin existe déjà.");
            }
        };
    }
}