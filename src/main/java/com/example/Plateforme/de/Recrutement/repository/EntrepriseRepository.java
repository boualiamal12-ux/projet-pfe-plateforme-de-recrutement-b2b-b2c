package com.example.Plateforme.de.Recrutement.repository;

import com.example.Plateforme.de.Recrutement.model.Entreprise;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EntrepriseRepository extends JpaRepository<Entreprise, Long> {

    // Becha tal9a el entreprise mta3 el User elli 3mal login
    Optional<Entreprise> findByUserId(Long userId);

    // Becha t-farkess bél esm mta3 el cherika
    Optional<Entreprise> findByNomEntreprise(String nomEntreprise);
}