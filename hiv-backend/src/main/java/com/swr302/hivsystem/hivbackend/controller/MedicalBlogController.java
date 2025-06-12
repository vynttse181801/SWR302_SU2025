package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.MedicalBlog;
import com.swr302.hivsystem.hivbackend.repository.MedicalBlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medical-blogs")
public class MedicalBlogController {

    @Autowired
    private MedicalBlogRepository medicalBlogRepository;

    @GetMapping
    public List<MedicalBlog> getAllMedicalBlogs() {
        return medicalBlogRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalBlog> getMedicalBlogById(@PathVariable Long id) {
        Optional<MedicalBlog> medicalBlog = medicalBlogRepository.findById(id);
        return medicalBlog.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public MedicalBlog createMedicalBlog(@RequestBody MedicalBlog medicalBlog) {
        return medicalBlogRepository.save(medicalBlog);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalBlog> updateMedicalBlog(@PathVariable Long id, @RequestBody MedicalBlog medicalBlogDetails) {
        Optional<MedicalBlog> medicalBlog = medicalBlogRepository.findById(id);
        if (medicalBlog.isPresent()) {
            MedicalBlog existingMedicalBlog = medicalBlog.get();
            existingMedicalBlog.setTitle(medicalBlogDetails.getTitle());
            existingMedicalBlog.setContent(medicalBlogDetails.getContent());
            existingMedicalBlog.setAuthor(medicalBlogDetails.getAuthor());
            existingMedicalBlog.setPublishedDate(medicalBlogDetails.getPublishedDate());
            return ResponseEntity.ok(medicalBlogRepository.save(existingMedicalBlog));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalBlog(@PathVariable Long id) {
        if (medicalBlogRepository.existsById(id)) {
            medicalBlogRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 