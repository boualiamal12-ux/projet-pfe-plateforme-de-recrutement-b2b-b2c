package com.example.Plateforme.de.Recrutement.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "document_visa")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Documentvisa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "demande_visa_id", nullable = false)
    private Long demandeVisaId;

    @Column(name = "nom_document", nullable = false)
    private String nomDocument;

    @Column(nullable = false)
    private String type = "REQUIS";

    @Column(nullable = false)
    private String statut = "MANQUANT";

    @Column(name = "fichier_url")
    private String fichierUrl;
}