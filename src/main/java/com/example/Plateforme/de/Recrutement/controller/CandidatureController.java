package com.example.Plateforme.de.Recrutement.controller;

import com.example.Plateforme.de.Recrutement.Service.CandidatureService;
import com.example.Plateforme.de.Recrutement.Service.DemandevisaService;
import com.example.Plateforme.de.Recrutement.model.Demandevisa;
import com.example.Plateforme.de.Recrutement.repository.CandidatureRepository;
import com.example.Plateforme.de.Recrutement.repository.CVRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/candidatures")
@CrossOrigin(origins = "http://localhost:3000")
public class CandidatureController {

    private final CandidatureService candidatureService;
    private final CandidatureRepository candidatureRepository;
    private final CVRepository cvRepository;
    private final DemandevisaService demandevisaService; // ✅ JADID

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

    @GetMapping("/entreprise/{offreId}")
    public ResponseEntity<?> getByOffre(@PathVariable Long offreId) {
        return ResponseEntity.ok(candidatureService.getCandidaturesByEntreprise(offreId));
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<?> updateStatut(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return candidatureService.updateStatut(id, body.get("statut"));
    }

    // ✅ JADID — entreprise tcréia visa lel candidat accepté
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

                // ✅ FIX — convert String → LocalDate
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
}