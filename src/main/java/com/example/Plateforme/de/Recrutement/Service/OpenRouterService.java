package com.example.Plateforme.de.Recrutement.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@Slf4j
@Service
public class OpenRouterService {

    @Value("${openrouter.api.key}")
    private String openRouterKey;

    @Value("${openrouter.model:google/gemini-2.0-flash-001}")
    private String openRouterModel;

    private static final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Analyse la compatibilité entre un CV et une offre d'emploi.
     */
    public Map<String, Object> analyzeMatching(String cvText, String offreText) {
        if (cvText == null || cvText.isBlank() || offreText == null || offreText.isBlank()) {
            return buildFallback(0.0, "CV ou offre vide.");
        }

        try {
            String prompt = """
                Tu es un expert RH senior. Analyse la compatibilité entre ce CV et cette offre d'emploi.
                Réponds UNIQUEMENT en JSON valide, sans texte avant ou après, sans markdown, sans backticks :
                {
                  "score_matching": <nombre entier entre 0 et 100>,
                  "points_forts": ["compétence 1", "compétence 2", "compétence 3"],
                  "competences_manquantes": ["skill 1", "skill 2"],
                  "conseil": "<conseil personnalisé en 2-3 phrases en français, direct et actionnable>",
                  "resume_matching": "<une phrase résumant le niveau de compatibilité>"
                }
                
                CV du candidat: %s
                
                Description du poste: %s
                """.formatted(
                    cvText.substring(0, Math.min(cvText.length(), 3000)),
                    offreText.substring(0, Math.min(offreText.length(), 1500))
            );

            Map<String, Object> result = callOpenRouter(prompt);

            // ── Normalisation défensive du score ──
            Object rawScore = result.get("score_matching");
            if (rawScore == null) rawScore = result.get("scoreMatching");
            double score = 0.0;
            if (rawScore instanceof Number) {
                score = ((Number) rawScore).doubleValue();
            } else if (rawScore != null) {
                try { score = Double.parseDouble(rawScore.toString()); } catch (Exception ignored) {}
            }
            result.put("score_matching", score);

            // ── Garantir les listes et champs non-nulls ──
            if (!(result.get("points_forts") instanceof List))
                result.put("points_forts", new ArrayList<>());
            if (!(result.get("competences_manquantes") instanceof List))
                result.put("competences_manquantes", new ArrayList<>());

            // ── FIX PRINCIPAL : getOrDefault + null-safe toString ──
            Object conseilObj = result.get("conseil");
            result.put("conseil", conseilObj != null ? conseilObj.toString() : "");

            Object resumeObj = result.get("resume_matching");
            result.put("resume_matching", resumeObj != null ? resumeObj.toString() : "");

            return result;

        } catch (Exception e) {
            log.error("❌ Exception analyzeMatching: {}", e.getMessage(), e);
            return buildFallback(0.0, "Analyse impossible pour le moment.");
        }
    }

    /**
     * Génère une lettre de motivation personnalisée.
     */
    public Map<String, Object> genererLettre(String cvText, String offreDesc, String offreTitre, String nomEntreprise, String candidatNom) {
        try {
            String prompt = """
                Tu es un expert en recrutement. Rédige une lettre de motivation professionnelle en français.
                Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans texte avant ou après :
                {
                  "lettre": "<lettre de motivation complète>"
                }
    
                Instructions :
                - Commence par "Madame, Monsieur,"
                - 3 paragraphes : accroche + compétences clés du CV + motivation pour ce poste.
                - Ton professionnel mais naturel.
                - Termine par une formule de politesse et le nom du candidat.
                - Maximum 250 mots.
                - PAS de [crochets] ni de placeholders.
    
                Candidat : %s
                Poste : %s
                Entreprise : %s
                Description poste : %s
                Résumé CV : %s
                """.formatted(
                    (candidatNom != null && !candidatNom.isBlank()) ? candidatNom : "Le candidat",
                    offreTitre   != null ? offreTitre   : "ce poste",
                    nomEntreprise != null ? nomEntreprise : "votre entreprise",
                    offreDesc    != null ? offreDesc.substring(0, Math.min(offreDesc.length(), 600)) : "",
                    cvText       != null ? cvText.substring(0, Math.min(cvText.length(), 800))       : ""
            );

            Map<String, Object> result = callOpenRouter(prompt);

            // ── FIX PRINCIPAL : null-safe récupération de "lettre" ──
            Object lettreObj = result.get("lettre");
            String lettre = (lettreObj != null) ? lettreObj.toString() : "";

            Map<String, Object> safe = new HashMap<>();
            safe.put("lettre", lettre);
            return safe;

        } catch (Exception e) {
            log.error("❌ Erreur genererLettre: {}", e.getMessage(), e);
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("lettre", "");
            return fallback;
        }
    }

    /**
     * Appel HTTP factorisé vers OpenRouter.
     */
    private Map<String, Object> callOpenRouter(String prompt) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("model", openRouterModel);
        body.put("messages", List.of(Map.of("role", "user", "content", prompt)));
        body.put("max_tokens", 1200);

        String requestBody = objectMapper.writeValueAsString(body);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(OPENROUTER_URL))
                .header("Authorization", "Bearer " + openRouterKey)
                .header("Content-Type", "application/json")
                .header("HTTP-Referer", "http://localhost:8081")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            log.error("❌ Erreur API OpenRouter status={} body={}", response.statusCode(), response.body());
            throw new RuntimeException("Erreur API OpenRouter: " + response.statusCode());
        }

        // ── Parse la réponse OpenRouter ──
        @SuppressWarnings("unchecked")
        Map<String, Object> respMap = objectMapper.readValue(response.body(), Map.class);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> choices = (List<Map<String, Object>>) respMap.get("choices");

        if (choices == null || choices.isEmpty()) {
            log.error("❌ Réponse OpenRouter sans choices: {}", response.body());
            throw new RuntimeException("Réponse IA vide");
        }

        Map<String, Object> choice = choices.get(0);

        // ── Vérifier finish_reason ──
        Object finishReasonObj = choice.get("finish_reason");
        String finishReason = (finishReasonObj != null) ? finishReasonObj.toString() : "";
        if ("content_filter".equals(finishReason) || "error".equals(finishReason)) {
            log.error("❌ Modèle bloqué: finish_reason={}", finishReason);
            throw new RuntimeException("Modèle IA bloqué: " + finishReason);
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> message = (Map<String, Object>) choice.get("message");

        if (message == null) {
            log.error("❌ Message null dans choices[0]. Choice: {}", choice);
            throw new RuntimeException("Message IA null");
        }

        // ── FIX : null-safe récupération du content ──
        Object contentObj = message.get("content");
        if (contentObj == null) {
            Object refusal = message.get("refusal");
            log.error("❌ content null dans le message IA. refusal={} message={}", refusal, message);
            throw new RuntimeException("Contenu IA null" + (refusal != null ? " - refus: " + refusal : ""));
        }

        String aiResponse = contentObj.toString().trim();
        log.debug("✅ Réponse IA brute: {}", aiResponse.substring(0, Math.min(aiResponse.length(), 200)));

        // ── Nettoyage robuste du JSON ──
        String cleanJson = aiResponse
                .replaceAll("(?s)^```json\\s*", "")
                .replaceAll("(?s)^```\\s*",     "")
                .replaceAll("(?s)\\s*```$",     "")
                .trim();

        // Extraire uniquement le bloc JSON si l'IA a mis du texte autour
        int jsonStart = cleanJson.indexOf('{');
        int jsonEnd   = cleanJson.lastIndexOf('}');
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
            cleanJson = cleanJson.substring(jsonStart, jsonEnd + 1);
        } else {
            log.error("❌ Impossible de trouver un bloc JSON dans: {}", cleanJson);
            throw new RuntimeException("Réponse IA non parseable en JSON");
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> parsed = objectMapper.readValue(cleanJson, Map.class);
        return parsed;
    }

    // ── Helper fallback ──
    private Map<String, Object> buildFallback(double score, String feedback) {
        Map<String, Object> m = new HashMap<>();
        m.put("score_matching", score);
        m.put("feedback", feedback);
        m.put("points_forts", new ArrayList<>());
        m.put("competences_manquantes", new ArrayList<>());
        m.put("conseil", feedback);
        m.put("resume_matching", "");
        m.put("lettre", "");
        return m;
    }
}