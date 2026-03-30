package com.example.Plateforme.de.Recrutement.controller;

import com.example.Plateforme.de.Recrutement.Service.EmailService;
import com.example.Plateforme.de.Recrutement.enums.Role;
import com.example.Plateforme.de.Recrutement.model.Candidat;
import com.example.Plateforme.de.Recrutement.model.Entreprise;
import com.example.Plateforme.de.Recrutement.model.Utilisateur;
import com.example.Plateforme.de.Recrutement.repository.CandidatRepository;
import com.example.Plateforme.de.Recrutement.repository.EntrepriseRepository;
import com.example.Plateforme.de.Recrutement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class RegisterService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private EmailService emailService;
    @Autowired private CandidatRepository candidatRepository;
    @Autowired private EntrepriseRepository entrepriseRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public String register(Map<String, Object> data) {

        String email    = data.get("email").toString().trim().toLowerCase();
        String password = data.get("password").toString();
        String roleStr  = data.get("role").toString();
        Role role = Role.valueOf(roleStr.toUpperCase());

        Optional<Utilisateur> existing = userRepository.findByEmail(email);

        if (existing.isPresent()) {
            Utilisateur user = existing.get();
            if (!user.isEmailVerifie()) {
                String newToken = UUID.randomUUID().toString();
                user.setVerificationToken(newToken);
                user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));
                userRepository.save(user);
                envoyerEmailVerification(email, newToken, role);
                return "Un nouvel email de vérification a été envoyé !";
            }
            throw new RuntimeException("Email déjà utilisé !");
        }

        // ✅ Save utilisateur
        Utilisateur user = new Utilisateur();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setValidated(false);
        user.setEmailVerifie(false);

        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));

        Utilisateur savedUser = userRepository.save(user);

        // ✅ Save Candidat
        if (role == Role.CANDIDAT) {
            Candidat candidat = new Candidat();
            candidat.setUser(savedUser);
            candidat.setNom(getStr(data, "nom"));
            candidat.setPrenom(getStr(data, "prenom"));
            candidat.setVille(getStr(data, "ville"));
            candidat.setTelephone(getStr(data, "telephone"));
            candidat.setNationalite(getStr(data, "nationalite")); // ✅ fix
            candidat.setLinkedin(getStr(data, "linkedin"));       // ✅ fix
            candidatRepository.save(candidat);
        }

        // ✅ Save Entreprise
        else if (role == Role.ENTREPRISE) {
            Entreprise entreprise = new Entreprise();
            entreprise.setUser(savedUser);
            entreprise.setNomEntreprise(getStr(data, "nomEntreprise"));
            entreprise.setTelephone(getStr(data, "telephone"));
            entreprise.setVille(getStr(data, "ville"));
            entreprise.setSecteur(getStr(data, "secteur"));
            entreprise.setEmailEntreprise(getStr(data, "email"));      // ✅ fix: "email" mech "emailEntreprise"
            entreprise.setTaille(getStr(data, "taille"));              // ✅ fix
            entreprise.setPays(getStr(data, "pays"));                  // ✅ fix
            entreprise.setSiteWeb(getStr(data, "siteWeb"));            // ✅ fix
            entreprise.setDescription(getStr(data, "description"));    // ✅ fix
            entrepriseRepository.save(entreprise);
        }

        envoyerEmailVerification(email, token, role);
        return "Inscription réussie ! Vérifiez votre email.";
    }

    private String getStr(Map<String, Object> data, String key) {
        Object val = data.get(key);
        return val != null ? val.toString().trim() : null;
    }

    private void envoyerEmailVerification(String email, String token, Role role) {
        String lien = frontendUrl + "/verify-email?token=" + token;

        String messageRole = role == Role.ENTREPRISE
                ? "Après vérification, votre compte sera examiné par notre équipe avant activation."
                : "Après vérification, vous pouvez vous connecter directement.";

        String html = """
            <div style="font-family: Arial, sans-serif; max-width: 520px;
                        margin: 0 auto; background: #f0f4f8; padding: 40px 20px;">
                <div style="background: white; border-radius: 18px; padding: 40px;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <div style="display: inline-block; background: #060b13;
                                    padding: 10px 24px; border-radius: 12px;">
                            <span style="color: white; font-size: 18px; font-weight: 800;">
                                RecruitPro
                            </span>
                        </div>
                    </div>
                    <h1 style="color: #0f172a; font-size: 22px; font-weight: 700;
                               text-align: center; margin: 0 0 12px;">
                        Confirmez votre email
                    </h1>
                    <p style="color: #64748b; text-align: center; margin: 0 0 8px; font-size: 14px;">
                        %s
                    </p>
                    <p style="color: #94a3b8; text-align: center; margin: 0 0 32px; font-size: 13px;">
                        Ce lien expire dans <strong>24 heures</strong>.
                    </p>
                    <div style="text-align: center; margin-bottom: 32px;">
                        <a href="%s"
                           style="background: #26c1c9; color: white; padding: 14px 36px;
                                  border-radius: 10px; text-decoration: none;
                                  font-size: 15px; font-weight: 700; display: inline-block;">
                            Activer mon compte
                        </a>
                    </div>
                    <div style="background: #f8fafc; border-radius: 10px; padding: 16px;
                                border-left: 3px solid #26c1c9;">
                        <p style="color: #64748b; font-size: 13px; margin: 0;">
                            🔒 Si vous n'avez pas créé de compte, ignorez cet email.
                        </p>
                    </div>
                    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
                        © 2026 RecruitPro · Tous droits réservés
                    </p>
                </div>
            </div>
        """.formatted(messageRole, lien);

        emailService.sendHtmlEmail(email, "✅ Confirmez votre email — RecruitPro", html);
    }
}