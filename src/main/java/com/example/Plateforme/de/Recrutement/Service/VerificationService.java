package com.example.Plateforme.de.Recrutement.Service;

import com.example.Plateforme.de.Recrutement.enums.Role;
import com.example.Plateforme.de.Recrutement.exception.TokenInvalideException;
import com.example.Plateforme.de.Recrutement.model.Utilisateur;
import com.example.Plateforme.de.Recrutement.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@AllArgsConstructor
@Service
public class VerificationService {

    private final UserRepository userRepository;

    public String verifierEmail(String token) {

        Utilisateur user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new TokenInvalideException("Lien invalide ou déjà utilisé"));

        if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new TokenInvalideException("Lien expiré — inscrivez-vous à nouveau");
        }

        user.setEmailVerifie(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);

        if (user.getRole() == Role.CANDIDAT) {
            user.setValidated(true);
            userRepository.save(user);
            return "CANDIDAT";
        } else {
            // ✅ Pas d'email ici — email envoyé par AdminController après validation
            user.setValidated(false);
            userRepository.save(user);
            return "ENTREPRISE";
        }
    }
}