package com.example.Plateforme.de.Recrutement.repository;

import com.example.Plateforme.de.Recrutement.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByPublieTrue();
    List<Course> findByPublieTrueAndCategorie(String categorie);
    List<Course> findByPublieTrueAndNiveau(String niveau);
    // ✅ Hadhi lezmetek bech l-matching yemchi mriguel
    List<Course> findBySkillsCiblesContainingIgnoreCase(String skill);
}