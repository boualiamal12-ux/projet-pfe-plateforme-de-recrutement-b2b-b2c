package com.example.Plateforme.de.Recrutement.repository;

import com.example.Plateforme.de.Recrutement.model.CV;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CVRepository extends JpaRepository<CV, Long> {
    List<CV> findByCandidatId(Long candidatId);
    Optional<CV> findFirstByCandidatIdOrderByIdDesc(Long candidatId);
}