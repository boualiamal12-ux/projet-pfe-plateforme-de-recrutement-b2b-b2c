package com.example.Plateforme.de.Recrutement.controller;

import com.example.Plateforme.de.Recrutement.model.Candidat;
import com.example.Plateforme.de.Recrutement.model.Utilisateur;
import com.example.Plateforme.de.Recrutement.repository.CandidatRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/api/candidats")
@CrossOrigin(origins = "http://localhost:3000")
public class CandidatController {

    private final CandidatRepository candidatRepository;
    private static final String PHOTO_DIR = "uploads/photos/";

    // ✅ GET par candidat.id
    @GetMapping("/by-id/{candidatId}")
    public ResponseEntity<?> getProfilByCandidatId(@PathVariable Long candidatId) {
        return candidatRepository.findById(candidatId)
                .map(c -> ResponseEntity.ok(toMap(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ GET par user.id
    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfil(@PathVariable Long userId) {
        Candidat candidat = candidatRepository.findByUser_Id(userId)
                .orElseGet(() -> {
                    Candidat empty = new Candidat();
                    Utilisateur user = new Utilisateur();
                    user.setId(userId);
                    empty.setUser(user);
                    return candidatRepository.save(empty);
                });
        return ResponseEntity.ok(toMap(candidat));
    }

    // ✅ PUT par user.id
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfil(@PathVariable Long userId,
                                          @RequestBody Map<String, String> body) {
        Candidat candidat = candidatRepository.findByUser_Id(userId)
                .orElseGet(() -> {
                    Candidat c = new Candidat();
                    Utilisateur u = new Utilisateur();
                    u.setId(userId);
                    c.setUser(u);
                    return c;
                });

        if (body.containsKey("nom"))         candidat.setNom(body.get("nom"));
        if (body.containsKey("prenom"))      candidat.setPrenom(body.get("prenom"));
        if (body.containsKey("telephone"))   candidat.setTelephone(body.get("telephone"));
        if (body.containsKey("ville"))       candidat.setVille(body.get("ville"));
        if (body.containsKey("nationalite")) candidat.setNationalite(body.get("nationalite"));
        if (body.containsKey("linkedin"))    candidat.setLinkedin(body.get("linkedin"));

        return ResponseEntity.ok(toMap(candidatRepository.save(candidat)));
    }

    // ✅ PUT par candidat.id
    @PutMapping("/by-id/{candidatId}")
    public ResponseEntity<?> updateByCandidatId(@PathVariable Long candidatId,
                                                @RequestBody Map<String, String> body) {
        return candidatRepository.findById(candidatId)
                .map(candidat -> {
                    if (body.containsKey("nom"))         candidat.setNom(body.get("nom"));
                    if (body.containsKey("prenom"))      candidat.setPrenom(body.get("prenom"));
                    if (body.containsKey("telephone"))   candidat.setTelephone(body.get("telephone"));
                    if (body.containsKey("ville"))       candidat.setVille(body.get("ville"));
                    if (body.containsKey("nationalite")) candidat.setNationalite(body.get("nationalite"));
                    if (body.containsKey("linkedin"))    candidat.setLinkedin(body.get("linkedin"));
                    return ResponseEntity.ok(toMap(candidatRepository.save(candidat)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ POST photo
    @PostMapping("/{userId}/photo")
    public ResponseEntity<?> uploadPhoto(@PathVariable Long userId,
                                         @RequestParam("file") MultipartFile file) {
        try {
            Path uploadPath = Paths.get(PHOTO_DIR);
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

            String ext = file.getOriginalFilename() != null
                    ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."))
                    : ".jpg";
            String fileName = "photo_" + userId + "_" + UUID.randomUUID() + ext;
            Path savedPath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), savedPath, StandardCopyOption.REPLACE_EXISTING);

            Candidat candidat = candidatRepository.findByUser_Id(userId)
                    .orElseGet(() -> {
                        Candidat c = new Candidat();
                        Utilisateur u = new Utilisateur();
                        u.setId(userId);
                        c.setUser(u);
                        return c;
                    });
            candidat.setPhotoUrl(savedPath.toAbsolutePath().toString());
            candidatRepository.save(candidat);

            return ResponseEntity.ok(Map.of("message", "Photo uploadée", "photoUrl", fileName));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ GET photo
    @GetMapping("/{userId}/photo")
    public ResponseEntity<?> getPhoto(@PathVariable Long userId) {
        try {
            Candidat candidat = candidatRepository.findByUser_Id(userId).orElse(null);
            if (candidat == null || candidat.getPhotoUrl() == null)
                return ResponseEntity.notFound().build();

            Path path = Paths.get(candidat.getPhotoUrl());
            if (!Files.exists(path)) return ResponseEntity.notFound().build();

            byte[] bytes = Files.readAllBytes(path);
            String contentType = path.toString().toLowerCase().endsWith(".png")
                    ? "image/png" : "image/jpeg";
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(bytes);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ─── helper ── ✅ FIX : inclut email depuis candidat.getUser() ───────────
    private Map<String, Object> toMap(Candidat c) {
        Map<String, Object> map = new HashMap<>();
        map.put("id",          c.getId()          != null ? c.getId()          : 0L);
        map.put("prenom",      c.getPrenom()      != null ? c.getPrenom()      : "");
        map.put("nom",         c.getNom()         != null ? c.getNom()         : "");
        map.put("telephone",   c.getTelephone()   != null ? c.getTelephone()   : "");
        map.put("ville",       c.getVille()       != null ? c.getVille()       : "");
        map.put("nationalite", c.getNationalite() != null ? c.getNationalite() : "");
        map.put("linkedin",    c.getLinkedin()    != null ? c.getLinkedin()    : "");
        map.put("photoUrl",    c.getPhotoUrl()    != null);
        map.put("competences", c.getCompetences() != null ? c.getCompetences() : "");

        // ✅ FIX PRINCIPAL : email depuis la table utilisateur liée
        String email = "";
        try {
            if (c.getUser() != null && c.getUser().getEmail() != null) {
                email = c.getUser().getEmail();
            }
        } catch (Exception ignored) {}
        map.put("email", email);

        return map;
    }
}