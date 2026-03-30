package com.example.Plateforme.de.Recrutement.repository;

import com.example.Plateforme.de.Recrutement.model.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidatureRepository extends JpaRepository<Candidature, Long> {

    List<Candidature> findByCandidatId(Long candidatId);

    List<Candidature> findByOffreId(Long offreId);

    boolean existsByOffreIdAndCandidatId(Long offreId, Long candidatId);

    // ✅ Count par statut — pour stats admin
    long countByStatut(String statut);

    // ✅ Count candidatures pour toutes les offres d'une entreprise
    @Query("SELECT COUNT(c) FROM Candidature c WHERE c.offreId IN " +
            "(SELECT o.id FROM OffreEmploi o WHERE o.entrepriseId = :entrepriseId)")
    long countByEntrepriseId(@Param("entrepriseId") Long entrepriseId);
}