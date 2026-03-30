package com.example.Plateforme.de.Recrutement.controller;

import com.example.Plateforme.de.Recrutement.Service.EmailService;
import com.example.Plateforme.de.Recrutement.dto.EntrepriseAdminDTO;
import com.example.Plateforme.de.Recrutement.enums.Role;
import com.example.Plateforme.de.Recrutement.model.Entreprise;
import com.example.Plateforme.de.Recrutement.model.Utilisateur;
import com.example.Plateforme.de.Recrutement.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final UserRepository userRepository;
    private final EntrepriseRepository entrepriseRepository;
    private final CandidatRepository candidatRepository;
    private final OffreEmploiRepository offreEmploiRepository;
    private final CandidatureRepository candidatureRepository;
    private final EmailService emailService;

    // ✅ GET /all
    @GetMapping("/all")
    public List<EntrepriseAdminDTO> getAllEntreprises() {
        return userRepository.findByRole(Role.ENTREPRISE).stream().map(user -> {
            Entreprise ent = entrepriseRepository.findByUserId(user.getId()).orElse(null);
            long nbOffres       = offreEmploiRepository.countByEntrepriseId(user.getId());
            long nbCandidatures = candidatureRepository.countByEntrepriseId(user.getId());
            return EntrepriseAdminDTO.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .validated(user.isValidated())
                    .nomEntreprise(ent != null ? ent.getNomEntreprise() : "")
                    .secteur(ent != null ? ent.getSecteur() : "")
                    .ville(ent != null ? ent.getVille() : "")
                    .taille(ent != null ? ent.getTaille() : "")
                    .nombreOffres(nbOffres)
                    .nombreCandidatures(nbCandidatures)
                    .build();
        }).collect(Collectors.toList());
    }

    @GetMapping("/candidats")
    public List<Utilisateur> getAllCandidats() {
        return userRepository.findByRole(Role.CANDIDAT);
    }

    @GetMapping("/pending")
    public List<Utilisateur> getPending() {
        return userRepository.findByRoleAndValidatedFalse(Role.ENTREPRISE);
    }

    @PutMapping("/validate/{id}")
    public ResponseEntity<?> validate(@PathVariable Long id) {
        Utilisateur user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        user.setValidated(true);
        userRepository.save(user);

        String html = """
            <div style="font-family: Arial, sans-serif; max-width: 520px;
                        margin: 0 auto; background: #f0f4f8; padding: 40px 20px;">
                <div style="background: white; border-radius: 18px; padding: 40px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <div style="font-size: 52px;">🎉</div>
                    </div>
                    <h1 style="color: #0f172a; font-size: 22px; font-weight: 700;
                               text-align: center; margin: 0 0 12px;">Compte approuvé !</h1>
                    <p style="color: #64748b; text-align: center; font-size: 14px;
                               line-height: 1.7; margin: 0 0 32px;">
                        Votre compte entreprise sur <strong>RecruitPro</strong> a été validé.
                    </p>
                    <div style="text-align: center;">
                        <a href="http://localhost:3000/login"
                           style="background: #26c1c9; color: white; padding: 14px 36px;
                                  border-radius: 10px; text-decoration: none;
                                  font-size: 15px; font-weight: 700; display: inline-block;">
                            Accéder à mon compte →
                        </a>
                    </div>
                </div>
            </div>
        """;

        emailService.sendHtmlEmail(user.getEmail(),
                "🎉 Votre compte entreprise est approuvé — RecruitPro", html);

        return ResponseEntity.ok(Map.of("message", "Compte validé !"));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Utilisateur updated) {
        Utilisateur user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Non trouvé"));
        user.setEmail(updated.getEmail());
        user.setValidated(updated.isValidated());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Mis à jour !"));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Utilisateur user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (user.getRole() == Role.ENTREPRISE) {
            entrepriseRepository.findByUserId(id).ifPresent(entrepriseRepository::delete);
        } else if (user.getRole() == Role.CANDIDAT) {
            candidatRepository.findByUserId(id).ifPresent(candidatRepository::delete);
        }

        userRepository.delete(user);
        return ResponseEntity.ok(Map.of("message", "Compte supprimé !"));
    }

    // ✅ GET /stats — statistiques globales
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new LinkedHashMap<>();

        // 1. Totaux
        stats.put("totalEntreprises",  userRepository.countByRole(Role.ENTREPRISE));
        stats.put("totalCandidats",    userRepository.countByRole(Role.CANDIDAT));
        stats.put("totalOffres",       offreEmploiRepository.count());
        stats.put("totalCandidatures", candidatureRepository.count());

        // 2. Répartition par statut
        Map<String, Long> repartition = new LinkedHashMap<>();
        repartition.put("ACCEPTEE",   candidatureRepository.countByStatut("ACCEPTEE"));
        repartition.put("REFUSEE",    candidatureRepository.countByStatut("REFUSEE"));
        repartition.put("EN_ATTENTE", candidatureRepository.countByStatut("EN_ATTENTE"));
        stats.put("repartitionStatuts", repartition);

        // 3. Top 5 entreprises
        List<Map<String, Object>> topEntreprises = userRepository
                .findByRole(Role.ENTREPRISE).stream()
                .map(user -> {
                    Entreprise ent = entrepriseRepository.findByUserId(user.getId()).orElse(null);
                    long nbOffres = offreEmploiRepository.countByEntrepriseId(user.getId());
                    long nbCands  = candidatureRepository.countByEntrepriseId(user.getId());
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id",             user.getId());
                    m.put("nom",            ent != null && ent.getNomEntreprise() != null ? ent.getNomEntreprise() : user.getEmail());
                    m.put("nbOffres",       nbOffres);
                    m.put("nbCandidatures", nbCands);
                    return m;
                })
                .sorted((a, b) -> Long.compare((long) b.get("nbOffres"), (long) a.get("nbOffres")))
                .limit(5)
                .collect(Collectors.toList());
        stats.put("topEntreprises", topEntreprises);

        // 4. Évolution inscriptions par mois
        stats.put("evolutionInscriptions", userRepository.countInscriptionsByMonth());

        return ResponseEntity.ok(stats);
    }
}