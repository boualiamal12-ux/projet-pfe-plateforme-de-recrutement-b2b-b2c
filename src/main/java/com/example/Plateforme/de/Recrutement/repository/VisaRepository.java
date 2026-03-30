package com.example.Plateforme.de.Recrutement.repository;

import com.example.Plateforme.de.Recrutement.model.Visa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VisaRepository extends JpaRepository<Visa, Long> {
    Optional<Visa> findByDemandeVisaId(Long demandeVisaId);
    boolean existsByDemandeVisaId(Long demandeVisaId);
    List<Visa> findByStatut(String statut);
}