package com.example.Plateforme.de.Recrutement.model;

import com.example.Plateforme.de.Recrutement.enums.TypeContrat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "offre_emploi")
@Getter
@Setter
@NoArgsConstructor
public class OffreEmploi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entreprise_id", nullable = false)
    private Long entrepriseId;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String localisation;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_contrat")
    private TypeContrat typeContrat;

    @Column(nullable = false)
    private String statut = "ouverte";

    @Column(name = "salaire_min")
    private Double salaireMin;

    @Column(name = "salaire_max")
    private Double salaireMax;

    @Column(name = "date_expiration")
    private LocalDate dateExpiration;

    // ✅ NOUVEAU
    @Column(name = "nombre_postes")
    private Integer nombrePostes = 1;

    @Column(name = "date_creation", updatable = false)
    private LocalDate dateCreation;

    @Column(name = "date_modification")
    private LocalDate dateModification;

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDate.now();
        this.dateModification = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.dateModification = LocalDate.now();
    }
    @Column(name = "nom_entreprise")
    private String nomEntreprise;
    @Column(name = "adresse_geocodee")
    private String adresseGeocodee;

    // getter + setter
    public String getAdresseGeocodee() { return adresseGeocodee; }
    public void setAdresseGeocodee(String adresseGeocodee) { this.adresseGeocodee = adresseGeocodee; }
    // Dans OffreEmploi.java
    @Column(name = "competences_requises", columnDefinition = "TEXT")
    private String competencesRequises; // ex: "Java, React, Spring Boot"
}
