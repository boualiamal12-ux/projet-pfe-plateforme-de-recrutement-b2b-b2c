package com.example.Plateforme.de.Recrutement.controller;

import com.example.Plateforme.de.Recrutement.Service.DemandevisaService;
import com.example.Plateforme.de.Recrutement.model.Demandevisa;
import com.example.Plateforme.de.Recrutement.model.Documentvisa;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/visa")
@CrossOrigin(origins = "http://localhost:3000")
public class DemandeVisaController {

    private final DemandevisaService demandevisaService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(demandevisaService.getAllDemandes());
    }

    @GetMapping("/candidat/{candidatId}")
    public ResponseEntity<?> getByCandidatId(@PathVariable Long candidatId) {
        return ResponseEntity.ok(demandevisaService.getDemandesByCandidatId(candidatId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(demandevisaService.getDemandeAvecDocs(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Demandevisa demande) {
        try {
            return ResponseEntity.ok(demandevisaService.createDemande(demande));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<?> updateStatut(@PathVariable Long id,
                                          @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(demandevisaService.updateStatut(id, body.get("statut")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            demandevisaService.deleteDemande(id);
            return ResponseEntity.ok(Map.of("message", "Demande supprimée"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(demandevisaService.getStats());
    }

    @GetMapping("/{id}/documents")
    public ResponseEntity<?> getDocuments(@PathVariable Long id) {
        return ResponseEntity.ok(demandevisaService.getDocumentsByDemandeId(id));
    }

    @GetMapping("/visas")
    public ResponseEntity<?> getAllVisas() {
        return ResponseEntity.ok(demandevisaService.getAllVisas());
    }
    @PutMapping("/documents/{docId}")
    public ResponseEntity<?> updateDocument(@PathVariable Long docId,
                                            @RequestBody Map<String, String> body) {
        try {
            Documentvisa doc = demandevisaService.updateDocumentStatut(
                    docId,
                    body.get("statut"),
                    body.get("fichierUrl")
            );
            return ResponseEntity.ok(doc);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}



