package com.example.Plateforme.de.Recrutement.controller;

import com.example.Plateforme.de.Recrutement.model.Entreprise;
import com.example.Plateforme.de.Recrutement.model.Utilisateur;
import com.example.Plateforme.de.Recrutement.repository.EntrepriseRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/api/entreprises")
@CrossOrigin(origins = "http://localhost:3000")
public class EntrepriseController {

    private final EntrepriseRepository entrepriseRepository;
    private static final String UPLOAD_DIR = "uploads/logos/";

    // ✅ GET profil entreprise — auto-create si n'existe pas
    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfil(@PathVariable Long userId) {
        return entrepriseRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    Entreprise e = new Entreprise();
                    Utilisateur user = new Utilisateur();
                    user.setId(userId);
                    e.setUser(user);
                    return ResponseEntity.ok(entrepriseRepository.save(e));
                });
    }

    // ✅ PUT update profil — avec tous les nouveaux champs
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfil(@PathVariable Long userId,
                                          @RequestBody Entreprise updated) {
        Entreprise entreprise = entrepriseRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Entreprise e = new Entreprise();
                    Utilisateur user = new Utilisateur();
                    user.setId(userId);
                    e.setUser(user);
                    return entrepriseRepository.save(e);
                });

        // Champs existants
        entreprise.setNomEntreprise(updated.getNomEntreprise());
        entreprise.setSecteur(updated.getSecteur());
        entreprise.setTelephone(updated.getTelephone());
        entreprise.setVille(updated.getVille());
        entreprise.setAdresse(updated.getAdresse());
        entreprise.setSiteWeb(updated.getSiteWeb());
        entreprise.setResponsableRH(updated.getResponsableRH());

        // ✅ Nouveaux champs
        entreprise.setTaille(updated.getTaille());
        entreprise.setPays(updated.getPays());
        entreprise.setDescription(updated.getDescription());
        entreprise.setEmailEntreprise(updated.getEmailEntreprise());

        return ResponseEntity.ok(entrepriseRepository.save(entreprise));
    }

    // ✅ POST upload logo
    @PostMapping("/{userId}/logo")
    public ResponseEntity<?> uploadLogo(@PathVariable Long userId,
                                        @RequestParam("file") MultipartFile file) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path savedPath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), savedPath, StandardCopyOption.REPLACE_EXISTING);

            Entreprise entreprise = entrepriseRepository.findByUserId(userId)
                    .orElseGet(() -> {
                        Entreprise e = new Entreprise();
                        Utilisateur user = new Utilisateur();
                        user.setId(userId);
                        e.setUser(user);
                        return e;
                    });

            entreprise.setLogoUrl(savedPath.toAbsolutePath().toString());
            entrepriseRepository.save(entreprise);

            return ResponseEntity.ok(Map.of(
                    "message", "Logo uploadé avec succès",
                    "logoUrl", "/api/entreprises/" + userId + "/logo/view"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ GET — serve l'image du logo
    @GetMapping("/{userId}/logo/view")
    public ResponseEntity<byte[]> getLogo(@PathVariable Long userId) {
        try {
            Entreprise entreprise = entrepriseRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Non trouvé"));

            if (entreprise.getLogoUrl() == null)
                return ResponseEntity.notFound().build();

            Path logoPath = Paths.get(entreprise.getLogoUrl());
            byte[] imageBytes = Files.readAllBytes(logoPath);

            String ct = "image/jpeg";
            String fn = logoPath.getFileName().toString().toLowerCase();
            if (fn.endsWith(".png"))  ct = "image/png";
            if (fn.endsWith(".gif"))  ct = "image/gif";
            if (fn.endsWith(".webp")) ct = "image/webp";

            return ResponseEntity.ok()
                    .header("Content-Type", ct)
                    .header("Cache-Control", "max-age=3600")
                    .body(imageBytes);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}