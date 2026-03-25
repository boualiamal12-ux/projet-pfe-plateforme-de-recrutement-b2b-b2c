package com.example.Plateforme.de.Recrutement.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "visa")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Visa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "demande_visa_id", nullable = false, unique = true)
    private Long demandeVisaId;

    @Column(nullable = false)
    private String type;
    // ex: "Visa Travail", "Visa Étudiant"

    @Column(nullable = false)
    private String pays;

    @Column(nullable = false)
    private String statut = "VALIDE";
    // VALIDE | EXPIRE | ANNULE

    @Column(name = "date_obtention")
    private LocalDate dateObtention;

    @Column(name = "date_expiration")
    private LocalDate dateExpiration;

    @Column(name = "numero_visa")
    private String numeroVisa;

    @Column(name = "date_creation", updatable = false)
    private LocalDate dateCreation;

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDate.now();
        if (this.dateObtention == null) this.dateObtention = LocalDate.now();
        // Expiration par défaut = 1 an après obtention
        if (this.dateExpiration == null) this.dateExpiration = this.dateObtention.plusYears(1);
        // Numéro auto si non fourni
        if (this.numeroVisa == null) this.numeroVisa = "VIS-" + System.currentTimeMillis();
    }
}