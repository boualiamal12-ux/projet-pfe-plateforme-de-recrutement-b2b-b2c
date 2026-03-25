package com.example.Plateforme.de.Recrutement.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "demande_visa")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Demandevisa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "candidature_id")
    private Long candidatureId;

    @Column(name = "candidat_id", nullable = false)
    private Long candidatId;

    @Column(nullable = false)
    private String pays;

    @Column(name = "type_visa", nullable = false)
    private String typeVisa;

    @Column(nullable = false)
    private String statut = "EN_COURS";
    // EN_COURS | DOCUMENTS_REQUIS | SOUMIS | APPROUVE | REFUSE

    @Column(name = "date_debut")
    private LocalDate dateDebut;

    @Column(name = "date_creation", updatable = false)
    private LocalDate dateCreation;

    @Column(name = "date_modification")
    private LocalDate dateModification;

    // ── infos candidat dénormalisées pour affichage rapide ──
    @Column(name = "candidat_nom")
    private String candidatNom;

    @Column(name = "candidat_poste")
    private String candidatPoste;

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDate.now();
        this.dateModification = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.dateModification = LocalDate.now();
    }
}