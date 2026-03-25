package com.example.Plateforme.de.Recrutement.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "entreprise")
public class Entreprise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomEntreprise;
    private String secteur;
    private String telephone;
    private String ville;
    private String adresse;
    private String siteWeb;
    private String responsableRH;
    private String logoUrl;

    // ✅ NOUVEAUX CHAMPS
    private String taille;           // "1-10", "11-50", "51-200", "201-500", "500+"
    private String pays;             // "Tunisie", "France"...
    @Column(columnDefinition = "TEXT")
    private String description;      // description libre
    private String emailEntreprise;  // email pro de l'entreprise

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private Utilisateur user;
}