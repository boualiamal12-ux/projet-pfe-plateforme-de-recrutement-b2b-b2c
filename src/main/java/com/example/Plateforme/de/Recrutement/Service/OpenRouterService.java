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

    public Map<String, Object> analyzeMatching(String cvText, String offreText) {
        if (cvText == null || cvText.isBlank() || offreText == null || offreText.isBlank()) {
            return Map.of("score", 0.0, "feedback", "CV ou offre vide.");
        }

        try {
            // 1. Prompt mriguel 0-10
            String prompt = """
                Tu es un expert RH technique. Analyse la compatibilité entre ce CV et cette offre.
                Réponds UNIQUEMENT en JSON valide :
                {
                  "score": <score entre 0 et 10>,
                  "feedback": "<Analyse concise en 3 phrases max en français>",
                  "competences_trouvees": ["A", "B"],
                  "competences_manquantes": ["X", "Y"]
                }
                
                CV: %s
                OFFRE: %s
                """.formatted(cvText, offreText);

            // 2. Body mta3 el requête (Format OpenAI/OpenRouter)
            Map<String, Object> body = new HashMap<>();
            body.put("model", openRouterModel);
            body.put("messages", List.of(Map.of("role", "user", "content", prompt)));

            String requestBody = objectMapper.writeValueAsString(body);

            // 3. Appel API avec Headers
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(OPENROUTER_URL))
                    .header("Authorization", "Bearer " + openRouterKey)
                    .header("Content-Type", "application/json")
                    .header("HTTP-Referer", "http://localhost:8081")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.error("❌ Erreur API: {}", response.body());
                return Map.of("score", 0.0, "feedback", "Erreur technique IA.");
            }

            // 4. Extraction du JSON de la réponse
            Map<String, Object> respMap = objectMapper.readValue(response.body(), Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) respMap.get("choices");
            String aiResponse = (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");

            // Nettoyage au cas où l'IA ajoute des balises ```json
            String cleanJson = aiResponse.trim().replaceAll("```json", "").replaceAll("```", "");
            return objectMapper.readValue(cleanJson, Map.class);

        } catch (Exception e) {
            log.error("❌ Exception GeminiService: {}", e.getMessage());
            return Map.of("score", 0.0, "feedback", "Analyse impossible pour le moment.");
        }
    }
}