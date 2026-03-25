package com.example.Plateforme.de.Recrutement.repository;

import com.example.Plateforme.de.Recrutement.enums.Role;
import com.example.Plateforme.de.Recrutement.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmail(String email);

    List<Utilisateur> findByRole(Role role);

    List<Utilisateur> findByRoleAndValidatedFalse(Role role);

    Optional<Utilisateur> findByVerificationToken(String token);

    Optional<Utilisateur> findByResetToken(String resetToken);

    // ✅ Count par role — pour stats
    long countByRole(Role role);

    // ✅ Évolution inscriptions par mois
    @Query(value = """
        SELECT
            DATE_FORMAT(u.date_creation, '%Y-%m') AS mois,
            SUM(CASE WHEN u.role = 'ENTREPRISE' THEN 1 ELSE 0 END) AS entreprises,
            SUM(CASE WHEN u.role = 'CANDIDAT'   THEN 1 ELSE 0 END) AS candidats
        FROM utilisateur u
        WHERE u.date_creation IS NOT NULL
        GROUP BY DATE_FORMAT(u.date_creation, '%Y-%m')
        ORDER BY mois ASC
        LIMIT 12
        """, nativeQuery = true)
    List<Map<String, Object>> countInscriptionsByMonth();
}