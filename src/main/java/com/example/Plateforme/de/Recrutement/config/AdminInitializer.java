package com.example.Plateforme.de.Recrutement.config;

import com.example.Plateforme.de.Recrutement.enums.Role;
import com.example.Plateforme.de.Recrutement.model.Utilisateur;
import com.example.Plateforme.de.Recrutement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminInitializer {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initAdmin() {
        return args -> {
            if (userRepository.findByEmail("admin@pfe.com").isEmpty()) {
                Utilisateur admin = new Utilisateur();
                admin.setEmail("admin@pfe.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                System.out.println("✅ Compte Admin créé par défaut.");
                System.out.println("📧 Email: admin@pfe.com");
                System.out.println("🔑 Password: admin123");
            }
        };
    }
}