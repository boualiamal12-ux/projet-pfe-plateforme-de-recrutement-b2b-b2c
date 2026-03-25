package com.example.Plateforme.de.Recrutement.repository;

import com.example.Plateforme.de.Recrutement.model.Candidat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CandidatRepository extends JpaRepository<Candidat, Long> {

    // ✅ CORRIGÉ — @OneToOne nécessite user_Id (avec underscore) pas userId
    Optional<Candidat> findByUser_Id(Long userId);

    Optional<Candidat> findByTelephone(String telephone);
}