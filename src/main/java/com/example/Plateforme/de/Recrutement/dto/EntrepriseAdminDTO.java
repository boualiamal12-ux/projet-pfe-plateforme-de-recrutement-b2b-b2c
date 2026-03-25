package com.example.Plateforme.de.Recrutement.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntrepriseAdminDTO {
    private Long id;
    private String email;
    private boolean validated;
    private String createdAt;
    private String nomEntreprise;
    private String secteur;
    private String ville;
    private String taille;
    private long nombreOffres;
    private long nombreCandidatures;
}