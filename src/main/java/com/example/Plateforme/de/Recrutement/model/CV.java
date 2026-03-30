package com.example.Plateforme.de.Recrutement.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cv")
public class CV {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "candidat_id", nullable = false)
    private Long candidatId;

    private String url;
    private String nom;
}