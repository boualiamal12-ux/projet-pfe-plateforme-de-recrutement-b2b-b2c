package com.example.Plateforme.de.Recrutement.Service;

import com.example.Plateforme.de.Recrutement.model.Course;
import com.example.Plateforme.de.Recrutement.model.OffreEmploi;
import com.example.Plateforme.de.Recrutement.repository.CourseRepository;
import com.example.Plateforme.de.Recrutement.repository.OffreEmploiRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class MatchingService {

    @Autowired
    private OpenRouterService aiService;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private OffreEmploiRepository offreRepository;

    public Map<String, Object> getSmartAnalysis(String cvText, Long offreId) {

        // 1. Récupérer l'offre depuis la DB
        OffreEmploi offre = offreRepository.findById(offreId)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée: " + offreId));

        // ── null-safe description ──
        String description = offre.getDescription();
        if (description == null || description.isBlank()) {
            log.warn("⚠️ Description vide pour offre #{}", offreId);
            description = offre.getTitre() != null ? offre.getTitre() : "Poste à pourvoir";
        }

        // 2. Appeler l'IA
        Map<String, Object> aiResult;
        try {
            aiResult = aiService.analyzeMatching(cvText, description);
        } catch (Exception e) {
            log.error("❌ Erreur analyzeMatching pour offre #{}: {}", offreId, e.getMessage());
            aiResult = buildEmptyResult();
        }

        // 3. Extraire les compétences manquantes (null-safe)
        Object missingObj = aiResult.get("competences_manquantes");
        List<String> missingSkills = (missingObj instanceof List)
                ? (List<String>) missingObj
                : new ArrayList<>();

        // 4. Trouver les cours correspondants
        Set<Course> recommendedCourses = new HashSet<>();
        for (String skill : missingSkills) {
            if (skill != null && !skill.isBlank()) {
                try {
                    List<Course> matches = courseRepository.findBySkillsCiblesContainingIgnoreCase(skill.trim());
                    recommendedCourses.addAll(matches);
                } catch (Exception e) {
                    log.warn("⚠️ Erreur recherche cours pour skill '{}': {}", skill, e.getMessage());
                }
            }
        }

        // 5. Préparer la réponse finale
        Map<String, Object> finalResponse = new HashMap<>(aiResult);
        finalResponse.put("coursSuggeres", recommendedCourses);

        return finalResponse;
    }

    public String genererLettreMotivation(String cvText, Long offreId, String candidatNom) {

        OffreEmploi offre = offreRepository.findById(offreId)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée: " + offreId));

        // ── null-safe pour tous les champs de l'offre ──
        String description  = offre.getDescription()   != null ? offre.getDescription()   : "";
        String titre        = offre.getTitre()          != null ? offre.getTitre()          : "ce poste";
        // ⚠️ FIX PRINCIPAL : nomEntreprise peut être null → NPE dans OpenRouterService
        String nomEntreprise = offre.getNomEntreprise() != null ? offre.getNomEntreprise() : "votre entreprise";

        Map<String, Object> result;
        try {
            result = aiService.genererLettre(cvText, description, titre, nomEntreprise, candidatNom);
        } catch (Exception e) {
            log.error("❌ Erreur genererLettre pour offre #{}: {}", offreId, e.getMessage());
            return "";
        }

        Object lettreObj = result.get("lettre");
        return (lettreObj != null) ? lettreObj.toString() : "";
    }

    // ── Résultat vide si l'IA échoue complètement ──
    private Map<String, Object> buildEmptyResult() {
        Map<String, Object> m = new HashMap<>();
        m.put("score_matching", 0.0);
        m.put("points_forts", new ArrayList<>());
        m.put("competences_manquantes", new ArrayList<>());
        m.put("conseil", "Analyse indisponible pour le moment.");
        m.put("resume_matching", "");
        return m;
    }
}