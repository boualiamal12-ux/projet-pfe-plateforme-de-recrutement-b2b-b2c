package com.example.Plateforme.de.Recrutement.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "cours")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String categorie; // ex: "Développement", "Marketing", "Design"

    @Column(name = "url_video")
    private String urlVideo; // lien YouTube ou autre

    @Column(name = "url_ressource")
    private String urlRessource; // PDF ou lien externe

    @Column(nullable = false)
    private String niveau; // "Débutant", "Intermédiaire", "Avancé"

    @Column(name = "duree_minutes")
    private Integer dureeMinutes;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false)
    private boolean publie = true;

    @Column(name = "date_creation", updatable = false)
    private LocalDate dateCreation;

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDate.now();
    }
    // Dans Course.java
    @Column(nullable = false)
    private String skillsCibles; // ex: "React" ou "Spring Boot"
}