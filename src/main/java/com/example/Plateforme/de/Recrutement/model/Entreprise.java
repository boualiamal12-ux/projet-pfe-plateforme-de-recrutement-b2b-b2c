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

    /**
     * El rbat m3a el Utilisateur.
     * @JoinColumn ya3mel jdid esmou 'user_id' fil table 'entreprise'.
     */
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private Utilisateur user;
}