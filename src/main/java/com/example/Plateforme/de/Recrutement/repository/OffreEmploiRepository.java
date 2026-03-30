package com.example.Plateforme.de.Recrutement.repository;

import com.example.Plateforme.de.Recrutement.model.OffreEmploi;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OffreEmploiRepository extends JpaRepository<OffreEmploi, Long> {
    List<OffreEmploi> findByEntrepriseId(Long entrepriseId);
    List<OffreEmploi> findByStatutOrderByDateCreationDesc(String statut);
    // ✅ NOUVEAU — pour notifier les candidats
    List<OffreEmploi> findByStatut(String statut);
    // OffreEmploiRepository
    long countByEntrepriseId(Long entrepriseId);


}