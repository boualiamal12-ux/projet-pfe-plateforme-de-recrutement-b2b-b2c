package com.example.Plateforme.de.Recrutement.controller;

import com.example.Plateforme.de.Recrutement.Service.AuthService;

import com.example.Plateforme.de.Recrutement.Service.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private com.example.Plateforme.de.Recrutement.controller.RegisterService registerService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            Map<String, Object> response = authService.login(
                    request.get("email"),
                    request.get("password")
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // 💡 EL FAZA HOUNI: Nrajj3ou JSON object fih el "message"
            // bech React (err.response.data.message) ya9rah mrigel
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> data) {
        try {
            String result = registerService.register(data);
            // 💡 Nrajj3ou JSON object houni zeda lél sécurité
            return ResponseEntity.ok(Map.of("message", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        authService.processForgotPassword(request.get("email"));
        return ResponseEntity.ok(Map.of("message", "Email envoyé avec succès !"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        authService.updatePassword(request.get("token"), request.get("password"));
        return ResponseEntity.ok(Map.of("message", "Mot de passe modifié avec succès !"));
    }
    // ✅ AJOUTE dans AuthController
    @Autowired
    private VerificationService verificationService;

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        try {
            String role = verificationService.verifierEmail(token);
            return ResponseEntity.ok(Map.of("message", "ok", "role", role));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}