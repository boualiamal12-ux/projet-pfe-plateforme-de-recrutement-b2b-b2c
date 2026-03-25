package com.example.Plateforme.de.Recrutement.controller;

import com.example.Plateforme.de.Recrutement.Service.CandidatureService;
import com.example.Plateforme.de.Recrutement.Service.DemandevisaService;
import com.example.Plateforme.de.Recrutement.model.Candidat;
import com.example.Plateforme.de.Recrutement.model.Demandevisa;
import com.example.Plateforme.de.Recrutement.repository.CandidatRepository;
import com.example.Plateforme.de.Recrutement.repository.CandidatureRepository;
import com.example.Plateforme.de.Recrutement.repository.CVRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/candidatures")
@CrossOrigin(origins = "http://localhost:3000")
public class CandidatureController {

    private final CandidatureService candidatureService;
    private final CandidatureRepository candidatureRepository;
    private final CVRepository cvRepository;
    private final DemandevisaService demandevisaService;
    private final CandidatRepository candidatRepository; // ✅ AJOUTÉ pour récupérer les noms

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> postuler(
            @RequestParam Long candidatId,
            @RequestParam Long offreId,
            @RequestParam(required = false) String lettreMotivation,
            @RequestParam("cv") MultipartFile cvFile) {
        try {
            return ResponseEntity.ok(candidatureService.postuler(candidatId, offreId, lettreMotivation, cvFile));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/candidat/{candidatId}")
    public ResponseEntity<?> getMesCandidatures(@PathVariable Long candidatId) {
        return ResponseEntity.ok(candidatureService.getMesCandidatures(candidatId));
    }

    /**
     * ✅ CORRIGÉ : retourne les candidatures enrichies avec prenom + nom + email du candidat
     * Comme ça le frontend peut afficher directement le vrai nom sans faire un 2ème appel.
     */
    @GetMapping("/entreprise/{offreId}")
    public ResponseEntity<?> getByOffre(@PathVariable Long offreId) {
        try {
            List<?> candidatures = candidatureService.getCandidaturesByEntreprise(offreId);

            // Enrichir chaque candidature avec les infos du candidat
            List<Map<String, Object>> enriched = new ArrayList<>();
            for (Object cObj : candidatures) {
                // Convertir en Map pour pouvoir ajouter des champs
                @SuppressWarnings("unchecked")
                Map<String, Object> cMap = objectToMap(cObj);

                // Récupérer l'ID du candidat
                Object candidatIdObj = cMap.get("candidatId");
                if (candidatIdObj != null) {
                    try {
                        Long candidatId = Long.valueOf(candidatIdObj.toString());
                        Optional<Candidat> candidatOpt = candidatRepository.findById(candidatId);
                        if (candidatOpt.isPresent()) {
                            Candidat candidat = candidatOpt.get();
                            cMap.put("candidatPrenom", candidat.getPrenom() != null ? candidat.getPrenom() : "");
                            cMap.put("candidatNom",    candidat.getNom()    != null ? candidat.getNom()    : "");
                            // ✅ email récupéré depuis candidat.getUser().getEmail()
                            String email = "";
                            try {
                                if (candidat.getUser() != null && candidat.getUser().getEmail() != null) {
                                    email = candidat.getUser().getEmail();
                                }
                            } catch (Exception ignored) {}
                            cMap.put("candidatEmail", email);
                        }
                    } catch (Exception e) {
                        log.warn("⚠️ Impossible de récupérer le candidat #{}: {}", candidatIdObj, e.getMessage());
                    }
                }
                enriched.add(cMap);
            }
            return ResponseEntity.ok(enriched);

        } catch (Exception e) {
            log.error("❌ Erreur getByOffre #{}: {}", offreId, e.getMessage());
            return ResponseEntity.ok(candidatureService.getCandidaturesByEntreprise(offreId));
        }
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<?> updateStatut(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return candidatureService.updateStatut(id, body.get("statut"));
    }

    @PostMapping("/{id}/visa")
    public ResponseEntity<?> creerVisa(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            return candidatureRepository.findById(id).map(c -> {
                Demandevisa visa = new Demandevisa();
                visa.setCandidatId(c.getCandidatId());
                visa.setPays(body.get("pays"));
                visa.setTypeVisa(body.get("typeVisa"));

                String dateDeb = body.get("dateDebut");
                if (dateDeb != null && !dateDeb.isEmpty()) {
                    visa.setDateDebut(java.time.LocalDate.parse(dateDeb));
                }

                visa.setStatut("EN_COURS");
                Demandevisa saved = demandevisaService.createDemande(visa);
                return ResponseEntity.ok(saved);
            }).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/cv")
    public ResponseEntity<?> downloadCv(@PathVariable Long id) {
        return candidatureRepository.findById(id).map(c -> {
            if (c.getCvId() == null) return ResponseEntity.notFound().build();
            return cvRepository.findById(c.getCvId()).map(cv -> {
                try {
                    Path path = Paths.get(cv.getUrl());
                    byte[] bytes = Files.readAllBytes(path);
                    return ResponseEntity.ok()
                            .header("Content-Disposition", "inline; filename=\"" + cv.getNom() + "\"")
                            .contentType(MediaType.APPLICATION_PDF)
                            .body(bytes);
                } catch (Exception e) {
                    return ResponseEntity.notFound().build();
                }
            }).orElse(ResponseEntity.notFound().build());
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── Helper : convertir un objet en Map (supporte les entités JPA) ──
    @SuppressWarnings("unchecked")
    private Map<String, Object> objectToMap(Object obj) {
        if (obj instanceof Map) return new HashMap<>((Map<String, Object>) obj);
        // Utiliser Jackson pour sérialiser/désérialiser en Map
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            mapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
            mapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            String json = mapper.writeValueAsString(obj);
            return mapper.readValue(json, Map.class);
        } catch (Exception e) {
            log.error("❌ objectToMap error: {}", e.getMessage());
            return new HashMap<>();
        }
    }
}