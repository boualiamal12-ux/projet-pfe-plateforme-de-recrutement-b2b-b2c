package com.example.Plateforme.de.Recrutement.repository;

import com.example.Plateforme.de.Recrutement.model.Demandevisa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DemandeVisaRepository extends JpaRepository<Demandevisa, Long> {

    List<Demandevisa> findByCandidatId(Long candidatId);

    List<Demandevisa> findByStatut(String statut);

    List<Demandevisa> findAllByOrderByDateCreationDesc();

    @Query("SELECT d FROM Demandevisa d WHERE " +
            "LOWER(d.candidatNom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(d.pays) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Demandevisa> searchByNomOrPays(@Param("search") String search);

    long countByStatut(String statut);
}