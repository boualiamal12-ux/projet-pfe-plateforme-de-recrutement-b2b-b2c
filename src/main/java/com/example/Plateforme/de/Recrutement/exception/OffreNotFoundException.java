package com.example.Plateforme.de.Recrutement.exception;

public class OffreNotFoundException extends RuntimeException {
    public OffreNotFoundException(Long id) {
        super("Offre introuvable avec l'ID : " + id);
    }
}