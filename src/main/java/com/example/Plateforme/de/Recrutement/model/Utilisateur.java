package com.example.Plateforme.de.Recrutement.model;

import com.example.Plateforme.de.Recrutement.enums.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "utilisateur")
@Getter
@Setter
@NoArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;


    @Column(name = "is_validated")
    @JsonProperty("validated")
    private boolean validated = false;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "token_expiry")
    private LocalDateTime tokenExpiry;

    // ✅ Vérification email
    @Column(name = "email_verifie", columnDefinition = "boolean default false")
    private Boolean emailVerifie = false;

    @Column(name = "verification_token")
    private String verificationToken;

    @Column(name = "verification_token_expiry")
    private LocalDateTime verificationTokenExpiry;

    // ✅ Méthode manuelle pour Lombok
    public boolean isEmailVerifie() {
        return Boolean.TRUE.equals(this.emailVerifie);
    }
    //lang
}