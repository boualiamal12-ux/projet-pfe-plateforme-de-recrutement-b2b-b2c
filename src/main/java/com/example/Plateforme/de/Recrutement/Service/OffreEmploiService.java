package com.example.Plateforme.de.Recrutement.Service;

import com.example.Plateforme.de.Recrutement.exception.OffreNotFoundException;
import com.example.Plateforme.de.Recrutement.model.OffreEmploi;
import com.example.Plateforme.de.Recrutement.repository.EntrepriseRepository;
import com.example.Plateforme.de.Recrutement.repository.OffreEmploiRepository;
import com.example.Plateforme.de.Recrutement.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class OffreEmploiService {

    private final OffreEmploiRepository repository;
    private final EntrepriseRepository entrepriseRepository;
    private final UserRepository userRepository; // ✅ fallback si table entreprise vide

    // ✅ Résout nomEntreprise : d'abord table entreprise, sinon email utilisateur
    private String resolveNomEntreprise(Long entrepriseId) {
        return entrepriseRepository.findByUserId(entrepriseId)
                .map(e -> e.getNomEntreprise())
                .filter(nom -> nom != null && !nom.isBlank())
                .orElseGet(() -> userRepository.findById(entrepriseId)
                        .map(u -> u.getEmail())
                        .orElse(null));
    }

    public OffreEmploi createOffre(OffreEmploi offre) {
        offre.setNomEntreprise(resolveNomEntreprise(offre.getEntrepriseId()));
        return repository.save(offre);
    }

    public List<OffreEmploi> getOffresByEntreprise(Long id) {
        List<OffreEmploi> offres = repository.findByEntrepriseId(id);
        fillNomEntreprise(offres);
        return offres;
    }

    public List<OffreEmploi> getOffresOuvertes() {
        List<OffreEmploi> offres = repository.findByStatutOrderByDateCreationDesc("ouverte");
        fillNomEntreprise(offres);
        return offres;
    }

    public void deleteOffre(Long id) {
        if (!repository.existsById(id)) {
            throw new OffreNotFoundException(id);
        }
        repository.deleteById(id);
    }

    public OffreEmploi updateOffre(Long id, OffreEmploi updated) {
        OffreEmploi offre = repository.findById(id)
                .orElseThrow(() -> new OffreNotFoundException(id));
        offre.setStatut(updated.getStatut());
        offre.setTitre(updated.getTitre());
        offre.setDescription(updated.getDescription());
        offre.setLocalisation(updated.getLocalisation());
        offre.setTypeContrat(updated.getTypeContrat());
        offre.setSalaireMin(updated.getSalaireMin());
        offre.setSalaireMax(updated.getSalaireMax());
        offre.setDateExpiration(updated.getDateExpiration());
        offre.setNombrePostes(updated.getNombrePostes());
        if (offre.getNomEntreprise() == null) {
            offre.setNomEntreprise(resolveNomEntreprise(offre.getEntrepriseId()));
        }
        return repository.save(offre);
    }

    // ✅ Remplit nomEntreprise pour les anciennes offres null + sauvegarde en DB
    private void fillNomEntreprise(List<OffreEmploi> offres) {
        offres.stream()
                .filter(o -> o.getNomEntreprise() == null || o.getNomEntreprise().isBlank())
                .forEach(o -> {
                    String nom = resolveNomEntreprise(o.getEntrepriseId());
                    if (nom != null) {
                        o.setNomEntreprise(nom);
                        repository.save(o);
                    }
                });
    }
}