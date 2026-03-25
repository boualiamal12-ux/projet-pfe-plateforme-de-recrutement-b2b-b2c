package com.example.Plateforme.de.Recrutement.controller;

import com.example.Plateforme.de.Recrutement.model.Course;
import com.example.Plateforme.de.Recrutement.repository.CourseRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/cours")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    private final CourseRepository courseRepository;

    // ✅ GET tous les cours publiés — pour les candidats
    @GetMapping
    public ResponseEntity<List<Course>> getAllCours() {
        return ResponseEntity.ok(courseRepository.findByPublieTrue());
    }

    // ✅ GET par catégorie
    @GetMapping("/categorie/{cat}")
    public ResponseEntity<List<Course>> getByCategorie(@PathVariable String cat) {
        return ResponseEntity.ok(courseRepository.findByPublieTrueAndCategorie(cat));
    }

    // ✅ GET par niveau
    @GetMapping("/niveau/{niveau}")
    public ResponseEntity<List<Course>> getByNiveau(@PathVariable String niveau) {
        return ResponseEntity.ok(courseRepository.findByPublieTrueAndNiveau(niveau));
    }

    // ✅ POST créer un cours — admin seulement
    @PostMapping
    public ResponseEntity<?> createCours(@RequestBody Course course) {
        try {
            course.setPublie(true);
            return ResponseEntity.ok(courseRepository.save(course));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ PUT update cours
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCours(@PathVariable Long id, @RequestBody Course updated) {
        return courseRepository.findById(id).map(c -> {
            c.setTitre(updated.getTitre());
            c.setDescription(updated.getDescription());
            c.setCategorie(updated.getCategorie());
            c.setNiveau(updated.getNiveau());
            c.setUrlVideo(updated.getUrlVideo());
            c.setUrlRessource(updated.getUrlRessource());
            c.setDureeMinutes(updated.getDureeMinutes());
            c.setImageUrl(updated.getImageUrl());
            c.setPublie(updated.isPublie());
            return ResponseEntity.ok(courseRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ DELETE cours
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCours(@PathVariable Long id) {
        if (!courseRepository.existsById(id))
            return ResponseEntity.notFound().build();
        courseRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Cours supprimé"));
    }
}