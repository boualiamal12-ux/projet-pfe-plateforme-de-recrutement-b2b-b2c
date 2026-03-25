package com.example.Plateforme.de.Recrutement.Service;

import com.example.Plateforme.de.Recrutement.model.Demandevisa;

import com.example.Plateforme.de.Recrutement.model.Documentvisa;
import com.example.Plateforme.de.Recrutement.model.Visa;
import com.example.Plateforme.de.Recrutement.repository.DemandeVisaRepository;
import com.example.Plateforme.de.Recrutement.repository.DocumentVisaRepository;
import com.example.Plateforme.de.Recrutement.repository.VisaRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@AllArgsConstructor
@Service
public class DemandevisaService {

    private final DemandeVisaRepository demandeVisaRepository;
    private final DocumentVisaRepository documentVisaRepository;
    private final VisaRepository visaRepository;

    private static final List<String> DOCS_DEFAUT = List.of(
            "Passeport", "Contrat travail", "Photo", "Justificatif"
    );

    public List<Demandevisa> getAllDemandes() {
        return demandeVisaRepository.findAllByOrderByDateCreationDesc();
    }

    public List<Demandevisa> getDemandesByCandidatId(Long candidatId) {
        return demandeVisaRepository.findByCandidatId(candidatId);
    }

    public Demandevisa getDemandeById(Long id) {
        return demandeVisaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande visa introuvable: " + id));
    }

    public Demandevisa createDemande(Demandevisa demande) {
        demande.setStatut("EN_COURS");
        Demandevisa saved = demandeVisaRepository.save(demande);

        DOCS_DEFAUT.forEach(nomDoc -> {
            Documentvisa doc = new Documentvisa();
            doc.setDemandeVisaId(saved.getId());
            doc.setNomDocument(nomDoc);
            doc.setType("REQUIS");
            doc.setStatut("MANQUANT");
            documentVisaRepository.save(doc);
        });

        log.info("✅ Demande visa créée id={}", saved.getId());
        return saved;
    }

    public Map<String, Object> updateStatut(Long id, String statut) {
        Demandevisa demande = getDemandeById(id);
        demande.setStatut(statut);
        demandeVisaRepository.save(demande);

        Map<String, Object> result = new HashMap<>();
        result.put("demande", demande);

        if ("APPROUVE".equals(statut)) {
            if (visaRepository.existsByDemandeVisaId(id)) {
                log.warn("Visa déjà existant pour demande {}", id);
                visaRepository.findByDemandeVisaId(id).ifPresent(v -> result.put("visa", v));
            } else {
                Visa visa = new Visa();
                visa.setDemandeVisaId(id);
                visa.setType(demande.getTypeVisa());
                visa.setPays(demande.getPays());
                visa.setStatut("VALIDE");
                Visa savedVisa = visaRepository.save(visa);
                result.put("visa", savedVisa);
                log.info("🎉 Visa généré id={} pour demande={}", savedVisa.getId(), id);
            }
        }

        return result;
    }

    public void deleteDemande(Long id) {
        if (!demandeVisaRepository.existsById(id))
            throw new RuntimeException("Demande visa introuvable: " + id);
        documentVisaRepository.deleteByDemandeVisaId(id);
        visaRepository.findByDemandeVisaId(id)
                .ifPresent(v -> visaRepository.deleteById(v.getId()));
        demandeVisaRepository.deleteById(id);
    }

    public List<Documentvisa> getDocumentsByDemandeId(Long demandeId) {
        return documentVisaRepository.findByDemandeVisaId(demandeId);
    }

    public Documentvisa updateDocumentStatut(Long docId, String statut, String fichierUrl) {
        Documentvisa doc = documentVisaRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document introuvable: " + docId));
        doc.setStatut(statut);
        if (fichierUrl != null) doc.setFichierUrl(fichierUrl);
        return documentVisaRepository.save(doc);
    }

    public Optional<Visa> getVisaByDemandeId(Long demandeId) {
        return visaRepository.findByDemandeVisaId(demandeId);
    }

    public List<Visa> getAllVisas() {
        return visaRepository.findAll();
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        long total        = demandeVisaRepository.count();
        long approuves    = demandeVisaRepository.countByStatut("APPROUVE");
        long attente      = demandeVisaRepository.countByStatut("EN_COURS")
                + demandeVisaRepository.countByStatut("SOUMIS")
                + demandeVisaRepository.countByStatut("DOCUMENTS_REQUIS");
        long refuses      = demandeVisaRepository.countByStatut("REFUSE");
        long visasValides = visaRepository.findByStatut("VALIDE").size();

        stats.put("total", total);
        stats.put("approuves", approuves);
        stats.put("attente", attente);
        stats.put("refuses", refuses);
        stats.put("visasValides", visasValides);
        stats.put("tauxApprobation", total > 0 ? Math.round((double) approuves / total * 100) : 0);
        return stats;
    }

    public Map<String, Object> getDemandeAvecDocs(Long id) {
        Demandevisa demande = getDemandeById(id);
        List<Documentvisa> docs = documentVisaRepository.findByDemandeVisaId(id);
        long fournis = docs.stream()
                .filter(d -> "FOURNI".equals(d.getStatut()) || "VALIDE".equals(d.getStatut()))
                .count();

        Map<String, Object> result = new HashMap<>();
        result.put("demande", demande);
        result.put("documents", docs);
        result.put("docsFournis", fournis);
        result.put("docsTotal", docs.size());
        visaRepository.findByDemandeVisaId(id).ifPresent(v -> result.put("visa", v));
        return result;
    }
}