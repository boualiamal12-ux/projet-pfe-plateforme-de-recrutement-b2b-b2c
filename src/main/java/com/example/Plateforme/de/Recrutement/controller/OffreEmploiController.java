package com.example.Plateforme.de.Recrutement.controller;

import com.example.Plateforme.de.Recrutement.Service.OffreEmploiService;
import com.example.Plateforme.de.Recrutement.model.OffreEmploi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/offres")
@CrossOrigin(origins = "http://localhost:3000")
public class OffreEmploiController {

    @Autowired
    private OffreEmploiService service;

    @PostMapping
    public ResponseEntity<?> createOffre(@RequestBody OffreEmploi offre) {
        try {
            OffreEmploi saved = service.createOffre(offre);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/entreprise/{id}")
    public ResponseEntity<?> getOffresParEntreprise(@PathVariable Long id) {
        try {
            List<OffreEmploi> offres = service.getOffresByEntreprise(id);
            return ResponseEntity.ok(offres);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur de chargement");
        }
    }

    // ✅ JADID — b hatha
    @GetMapping("/ouvertes")
    public ResponseEntity<?> getOuvertes() {
        List<OffreEmploi> offres = service.getOffresOuvertes();
        List<Map<String, Object>> result = offres.stream().map(o -> {
            Map<String, Object> map = new java.util.LinkedHashMap<>();
            map.put("id", o.getId());
            map.put("titre", o.getTitre());
            map.put("localisation", o.getLocalisation());
            map.put("typeContrat", o.getTypeContrat());
            map.put("statut", o.getStatut());
            map.put("salaireMin", o.getSalaireMin());
            map.put("salaireMax", o.getSalaireMax());
            map.put("dateExpiration", o.getDateExpiration());
            map.put("nombrePostes", o.getNombrePostes());
            map.put("description", o.getDescription());
            map.put("nomEntreprise", o.getNomEntreprise());
            map.put("entrepriseId", o.getEntrepriseId()); // ✅ EL MUHIM
            return map;
        }).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(result);
    }
    // ✅ NOUVEAU — update offre + statut
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOffre(@PathVariable Long id, @RequestBody OffreEmploi offre) {
        try {
            OffreEmploi updated = service.updateOffre(id, offre);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOffre(@PathVariable Long id) {
        try {
            service.deleteOffre(id);
            return ResponseEntity.ok(Map.of("message", "Offre supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}