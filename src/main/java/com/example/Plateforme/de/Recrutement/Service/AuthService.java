package com.example.Plateforme.de.Recrutement.Service;

import com.example.Plateforme.de.Recrutement.config.JwtUtil;
import com.example.Plateforme.de.Recrutement.model.*;
import com.example.Plateforme.de.Recrutement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private CandidatRepository candidatRepository;
    @Autowired private EntrepriseRepository entrepriseRepository;
    @Autowired private BCryptPasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    @Transactional // Pour garantir que tout est enregistré ou rien du tout
    public String register(Map<String, Object> data) {
        // 1. Création de l'Utilisateur (Compte Auth)
        Utilisateur user = new Utilisateur();
        user.setEmail((String) data.get("email"));
        user.setPassword(passwordEncoder.encode((String) data.get("password")));

        // Convertir le rôle en Majuscule pour l'Enum
        Role role = Role.valueOf(((String) data.get("role")).toUpperCase());
        user.setRole(role);

        Utilisateur savedUser = userRepository.save(user);

        // 2. Création du profil selon le rôle
        if (role == Role.CANDIDAT) {
            Candidat candidat = new Candidat();
            candidat.setNom((String) data.get("nom"));
            candidat.setPrenom((String) data.get("prenom"));
            candidat.setTelephone((String) data.get("telephone"));
            candidat.setVille((String) data.get("ville"));
            candidat.setNationalite((String) data.get("nationalite"));
            candidat.setLinkedin((String) data.get("linkedin"));
            candidat.setUser(savedUser); // On lie le profil au compte
            candidatRepository.save(candidat);
        }
        else if (role == Role.ENTREPRISE) {
            Entreprise entreprise = new Entreprise();
            entreprise.setNomEntreprise((String) data.get("nomEntreprise"));
            entreprise.setSecteur((String) data.get("secteur"));
            entreprise.setTelephone((String) data.get("telephone"));
            entreprise.setVille((String) data.get("ville"));
            entreprise.setAdresse((String) data.get("adresse"));
            entreprise.setSiteWeb((String) data.get("siteWeb"));
            entreprise.setResponsableRH((String) data.get("responsableRH"));
            entreprise.setUser(savedUser);
            entrepriseRepository.save(entreprise);
        }

        return "Inscription réussie !";
    }

    public Map<String, Object> login(String email, String password) {
        Utilisateur user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (passwordEncoder.matches(password, user.getPassword())) {
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
            return Map.of(
                    "token", token,
                    "role", user.getRole().name(),
                    "email", user.getEmail()
            );
        } else {
            throw new RuntimeException("Mot de passe incorrect");
        }
    }

}