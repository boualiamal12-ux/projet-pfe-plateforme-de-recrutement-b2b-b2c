package com.example.Plateforme.de.Recrutement.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "candidature")
public class Candidature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "offre_id", nullable = false)
    private Long offreId;

    @Column(name = "candidat_id", nullable = false)
    private Long candidatId;

    @Column(name = "cv_id")
    private Long cvId;

    @Column(name = "lettre_motivation", columnDefinition = "TEXT")
    private String lettreMotivation;

    @Column(nullable = false)
    private String statut = "EN_ATTENTE";

    @Column(name = "date_envoi")
    private LocalDate dateEnvoi;

    @Column(name = "date_modification")
    private LocalDate dateModification;

    private Double score;
    @Column(columnDefinition = "TEXT") // TEXT bech ye5ou barch maktoub
    private String aiFeedback;
    @PrePersist
    protected void onCreate() {
        this.dateEnvoi = LocalDate.now();
        this.dateModification = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.dateModification = LocalDate.now();
    }
}