package com.example.Plateforme.de.Recrutement.repository;

import com.example.Plateforme.de.Recrutement.model.Entreprise;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EntrepriseRepository extends JpaRepository<Entreprise, Long> {
    Optional<Entreprise> findByUserId(Long userId);
}