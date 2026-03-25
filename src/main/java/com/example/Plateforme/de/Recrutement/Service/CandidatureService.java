package com.example.Plateforme.de.Recrutement.Service;

import com.example.Plateforme.de.Recrutement.model.*;
import com.example.Plateforme.de.Recrutement.repository.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@Slf4j
@AllArgsConstructor
@Service
public class CandidatureService {

    private final CandidatureRepository candidatureRepository;
    private final CVRepository cvRepository;
    private final OffreEmploiRepository offreRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private OpenRouterService openRouterService;

    private static final String UPLOAD_DIR = "uploads/cv/";

    private String extractTextFromPdf(String pdfPath) {
        try {
            File file = new File(pdfPath);
            log.info("📁 PDF absolute path: {}", file.getAbsolutePath());
            log.info("📁 PDF exists: {}", file.exists());
            if (!file.exists()) {
                log.error("❌ PDF file NOT FOUND at: {}", file.getAbsolutePath());
                return "";
            }
            try (PDDocument document = Loader.loadPDF(file)) {
                String text = new PDFTextStripper().getText(document);
                log.info("📄 Extracted {} chars from PDF", text.length());
                return text;
            }
        } catch (Exception e) {
            log.error("❌ Erreur PDF: {}", e.getMessage());
            return "";
        }
    }

    public List<Candidature> getMesCandidatures(Long candidatId) {
        return candidatureRepository.findByCandidatId(candidatId);
    }

    public List<Candidature> getCandidaturesByEntreprise(Long offreId) {
        return candidatureRepository.findByOffreId(offreId);
    }

    public Candidature postuler(Long candidatId, Long offreId, String lettre, MultipartFile file) throws IOException {
        if (candidatureRepository.existsByOffreIdAndCandidatId(offreId, candidatId)) {
            throw new RuntimeException("Vous avez déjà postulé à cette offre !");
        }

        // ── Sauvegarder le CV ──
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
        Path savedPath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), savedPath, StandardCopyOption.REPLACE_EXISTING);

        String absolutePath = savedPath.toAbsolutePath().toString();
        log.info("✅ CV saved at absolute path: {}", absolutePath);

        CV cv = new CV();
        cv.setCandidatId(candidatId);
        cv.setUrl(absolutePath);
        cv.setNom(file.getOriginalFilename());
        CV savedCv = cvRepository.save(cv);

        // ── Extraire le texte du PDF ──
        String cvText = extractTextFromPdf(absolutePath);
        if (cvText == null || cvText.trim().length() < 50) {
            log.warn("⚠️ PDF image-based détecté ({} chars)", cvText != null ? cvText.trim().length() : 0);
            cvText = "Candidat a soumis un CV professionnel. " +
                    "Fichier: " + file.getOriginalFilename() + ". " +
                    "Le CV est au format image, analyse basée sur le profil du candidat.";
        }

        // ── Analyse IA ──
        OffreEmploi offre = offreRepository.findById(offreId).orElseThrow();

        // ✅ null-safe description pour l'IA
        String description = offre.getDescription();
        if (description == null || description.isBlank()) {
            description = offre.getTitre() != null ? offre.getTitre() : "Poste à pourvoir";
        }

        double score = 0.0;
        String aiFeedback = "";

        try {
            Map<String, Object> aiResult = openRouterService.analyzeMatching(cvText, description);
            log.info("📊 Résultat IA brut: {}", aiResult);

            // ✅ FIX PRINCIPAL : l'IA retourne "score_matching", pas "score"
            Object rawScore = aiResult.get("score_matching");
            if (rawScore == null) rawScore = aiResult.get("scoreMatching");
            if (rawScore == null) rawScore = aiResult.get("score");

            if (rawScore instanceof Number) {
                score = ((Number) rawScore).doubleValue();
            } else if (rawScore != null) {
                try { score = Double.parseDouble(rawScore.toString()); } catch (Exception ignored) {}
            }

            // ✅ FIX PRINCIPAL : l'IA retourne "conseil", pas "feedback"
            Object rawFeedback = aiResult.get("conseil");
            if (rawFeedback == null) rawFeedback = aiResult.get("resume_matching");
            if (rawFeedback == null) rawFeedback = aiResult.get("feedback");

            aiFeedback = (rawFeedback != null) ? rawFeedback.toString() : "Analyse disponible dans votre dashboard.";

            log.info("✅ Score extrait: {} | Feedback: {}", score, aiFeedback);

        } catch (Exception e) {
            log.error("❌ Erreur analyse IA (non bloquant): {}", e.getMessage());
            score = 0.0;
            aiFeedback = "Analyse indisponible pour le moment.";
        }

        // ── Créer la candidature ──
        Candidature candidature = new Candidature();
        candidature.setCandidatId(candidatId);
        candidature.setOffreId(offreId);
        candidature.setCvId(savedCv.getId());
        candidature.setLettreMotivation(lettre);
        candidature.setStatut("EN_ATTENTE");
        candidature.setScore(score);
        candidature.setAiFeedback(aiFeedback);
        candidature.setDateEnvoi(java.time.LocalDate.now());

        return candidatureRepository.save(candidature);
    }

    // ✅ updateStatut — avec email de notification
    public ResponseEntity<?> updateStatut(Long id, String statut) {
        return candidatureRepository.findById(id).map(c -> {
            c.setStatut(statut);
            candidatureRepository.save(c);

            if ("ACCEPTEE".equals(statut)) {
                try {
                    String offreTitre = offreRepository.findById(c.getOffreId())
                            .map(OffreEmploi::getTitre)
                            .orElse("un poste");

                    userRepository.findById(c.getCandidatId()).ifPresent(user -> {
                        String html = """
                            <div style="font-family: Arial, sans-serif; max-width: 520px;
                                        margin: 0 auto; background: #f0f4f8; padding: 40px 20px;">
                                <div style="background: white; border-radius: 18px; padding: 40px;
                                            box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
                                    <div style="text-align: center; margin-bottom: 32px;">
                                        <div style="display: inline-block; background: #060b13;
                                                    padding: 10px 24px; border-radius: 12px;">
                                            <span style="color: white; font-size: 18px; font-weight: 800;">
                                                RecruitPro
                                            </span>
                                        </div>
                                    </div>
                                    <div style="text-align: center; font-size: 52px; margin-bottom: 24px;">🎉</div>
                                    <h1 style="color: #0f172a; font-size: 22px; font-weight: 700;
                                               text-align: center; margin: 0 0 12px;">
                                        Candidature acceptée !
                                    </h1>
                                    <p style="color: #64748b; text-align: center; font-size: 14px;
                                               line-height: 1.7; margin: 0 0 32px;">
                                        Félicitations ! Votre candidature pour le poste de
                                        <strong>%s</strong> a été acceptée.<br/>
                                        Connectez-vous à votre dashboard pour voir
                                        votre demande de visa. ✈️
                                    </p>
                                    <div style="text-align: center; margin-bottom: 32px;">
                                        <a href="http://localhost:3000/dashboard"
                                           style="background: #26c1c9; color: white; padding: 14px 36px;
                                                  border-radius: 10px; text-decoration: none;
                                                  font-size: 15px; font-weight: 700; display: inline-block;">
                                            Voir mon dashboard →
                                        </a>
                                    </div>
                                    <div style="background: #f8fafc; border-radius: 10px; padding: 16px;
                                                border-left: 3px solid #26c1c9;">
                                        <p style="color: #64748b; font-size: 13px; margin: 0; line-height: 1.8;">
                                            ✅ Candidature acceptée<br/>
                                            ✈️ Demande de visa en cours de préparation<br/>
                                            📄 Documents requis bientôt disponibles
                                        </p>
                                    </div>
                                    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
                                        © 2026 RecruitPro · Tous droits réservés
                                    </p>
                                </div>
                            </div>
                        """.formatted(offreTitre);

                        emailService.sendHtmlEmail(
                                user.getEmail(),
                                "🎉 Votre candidature a été acceptée — RecruitPro",
                                html
                        );
                        log.info("✅ Email acceptation envoyé à {}", user.getEmail());
                    });
                } catch (Exception e) {
                    log.error("❌ Erreur email acceptation: {}", e.getMessage());
                }
            }

            return ResponseEntity.ok(Map.of("message", "Statut mis à jour", "statut", statut));
        }).orElse(ResponseEntity.notFound().build());
    }
}