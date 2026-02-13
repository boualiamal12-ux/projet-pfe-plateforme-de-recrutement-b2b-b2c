package com.example.Plateforme.de.Recrutement.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "candidat")
public class Candidat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String telephone;
    private String ville;
    private String nationalite;
    private String linkedin;

    /**
     * El rbat m3a el Utilisateur.
     * El Candidat houwa elli i-hez el 'user_id' k'clé étrangère.
     */
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private Utilisateur user;
}