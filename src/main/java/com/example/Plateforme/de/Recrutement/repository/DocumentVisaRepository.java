package com.example.Plateforme.de.Recrutement.repository;

import com.example.Plateforme.de.Recrutement.model.Documentvisa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentVisaRepository extends JpaRepository<Documentvisa, Long> {
    List<Documentvisa> findByDemandeVisaId(Long demandeVisaId);
    long countByDemandeVisaIdAndStatut(Long demandeVisaId, String statut);
    void deleteByDemandeVisaId(Long demandeVisaId);
}