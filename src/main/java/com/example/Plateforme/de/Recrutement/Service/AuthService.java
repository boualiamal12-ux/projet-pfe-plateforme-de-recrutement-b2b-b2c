package com.example.Plateforme.de.Recrutement.Service;

import com.example.Plateforme.de.Recrutement.Security.JwtUtil;
import com.example.Plateforme.de.Recrutement.model.Utilisateur;
import com.example.Plateforme.de.Recrutement.repository.UserRepository;
import com.example.Plateforme.de.Recrutement.enums.Role;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
@AllArgsConstructor
@Service
public class AuthService {

     private final UserRepository userRepository;
     private final BCryptPasswordEncoder passwordEncoder;
   private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public Map<String, Object> login(String email, String password) {
        Utilisateur user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        // ✅ Check candidat — email pas encore vérifié
        if (user.getRole() == Role.CANDIDAT && !user.isEmailVerifie()) {
            throw new RuntimeException("Veuillez vérifier votre email avant de vous connecter.");
        }

        // ✅ Check entreprise — pas encore validée par admin
        if (user.getRole() == Role.ENTREPRISE && !user.isValidated()) {
            throw new RuntimeException("Votre compte entreprise est en attente de validation.");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return Map.of(
                "id",    user.getId(),
                "token", token,
                "role",  user.getRole().name(),
                "email", user.getEmail()
        );
    }

    public void processForgotPassword(String email) {
        Utilisateur user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Aucun utilisateur trouvé avec cet email."));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        emailService.sendEmail(
                user.getEmail(),
                "Réinitialisation de mot de passe",
                "Cliquez ici pour changer votre mot de passe : " + resetLink
        );
    }

    public void updatePassword(String token, String newPassword) {
        Utilisateur user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Token invalide."));

        if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expiré.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setTokenExpiry(null);
        userRepository.save(user);
    }

}