package com.example.Plateforme.de.Recrutement.controller;

import com.example.Plateforme.de.Recrutement.Service.MatchingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/matching")
@CrossOrigin(origins = "http://localhost:3000")
public class MatchingController {

    @Autowired
    private MatchingService matchingService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyze(@RequestBody Map<String, Object> request) {
        try {
            log.info("📥 Request reçue: {}", request);
            log.info("📥 Keys disponibles: {}", request.keySet());

            String cvText = (String) request.get("cvText");
            Object offreIdObj = request.get("offreId");

            if (cvText == null || cvText.isBlank()) {
                return ResponseEntity.badRequest().body("Erreur : cvText est requis.");
            }

            if (offreIdObj == null) {
                log.error("❌ offreId est NULL - keys reçues: {}", request.keySet());
                return ResponseEntity.badRequest().body("Erreur : offreId est requis. Keys reçues: " + request.keySet());
            }

            Long offreId;
            try {
                offreId = Long.valueOf(offreIdObj.toString());
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body("Erreur : offreId doit être un nombre valide. Valeur reçue: " + offreIdObj);
            }

            log.info("✅ offreId={} cvText.length={}", offreId, cvText.length());

            Map<String, Object> result = matchingService.getSmartAnalysis(cvText, offreId);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("❌ Erreur analyze: ", e);
            return ResponseEntity.badRequest().body("Erreur d'analyse : " + e.getMessage());
        }
    }

    @PostMapping("/lettre")
    public ResponseEntity<?> genererLettre(@RequestBody Map<String, Object> request) {
        try {
            log.info("📥 Lettre request reçue: {}", request.keySet());

            String cvText = (String) request.get("cvText");
            Object offreIdObj = request.get("offreId");

            if (cvText == null || cvText.isBlank()) {
                return ResponseEntity.badRequest().body("Erreur : cvText est requis.");
            }

            if (offreIdObj == null) {
                log.error("❌ offreId est NULL pour lettre - keys reçues: {}", request.keySet());
                return ResponseEntity.badRequest().body("Erreur : offreId est requis.");
            }

            Long offreId;
            try {
                offreId = Long.valueOf(offreIdObj.toString());
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body("Erreur : offreId doit être un nombre valide.");
            }

            // ── FIX : récupérer candidatNom sans risque de NPE ──
            Object candidatNomObj = request.get("candidatNom");
            String candidatNom = (candidatNomObj != null) ? candidatNomObj.toString() : "";

            log.info("✅ Génération lettre offreId={} candidat={}", offreId, candidatNom);

            String lettre = matchingService.genererLettreMotivation(cvText, offreId, candidatNom);
            return ResponseEntity.ok(Map.of("lettre", lettre));

        } catch (Exception e) {
            log.error("❌ Erreur genererLettre: ", e);
            return ResponseEntity.badRequest().body("Erreur génération lettre : " + e.getMessage());
        }
    }
}