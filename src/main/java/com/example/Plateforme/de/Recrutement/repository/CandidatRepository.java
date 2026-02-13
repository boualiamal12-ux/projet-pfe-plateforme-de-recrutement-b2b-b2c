package com.example.Plateforme.de.Recrutement.repository;

import com.example.Plateforme.de.Recrutement.model.Candidat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CandidatRepository extends JpaRepository<Candidat, Long> {

    // Hédhi mouhemma barcha bech tjib profile el candidat elli connecté tawa
    Optional<Candidat> findByUserId(Long userId);

    // Tnejem tzid hédhi ken t7eb t-farkess bél ra9m mta3 el hatif
    Optional<Candidat> findByTelephone(String telephone);
}