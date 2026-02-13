package com.example.Plateforme.de.Recrutement.model;

import com.example.Plateforme.de.Recrutement.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    // Zid hédhom bech el rbat ykoun kamel
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Candidat candidat;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Entreprise entreprise;

    public void setRole(Role role) {
    }
}