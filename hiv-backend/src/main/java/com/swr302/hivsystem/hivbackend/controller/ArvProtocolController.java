package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.ArvProtocol;
import com.swr302.hivsystem.hivbackend.repository.ArvProtocolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/arv-protocols")
public class ArvProtocolController {

    @Autowired
    private ArvProtocolRepository arvProtocolRepository;

    @GetMapping
    public List<ArvProtocol> getAllArvProtocols() {
        return arvProtocolRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArvProtocol> getArvProtocolById(@PathVariable Long id) {
        Optional<ArvProtocol> arvProtocol = arvProtocolRepository.findById(id);
        return arvProtocol.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ArvProtocol createArvProtocol(@RequestBody ArvProtocol arvProtocol) {
        return arvProtocolRepository.save(arvProtocol);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArvProtocol> updateArvProtocol(@PathVariable Long id, @RequestBody ArvProtocol arvProtocolDetails) {
        Optional<ArvProtocol> arvProtocol = arvProtocolRepository.findById(id);
        if (arvProtocol.isPresent()) {
            ArvProtocol existingArvProtocol = arvProtocol.get();
            existingArvProtocol.setName(arvProtocolDetails.getName());
            existingArvProtocol.setDescription(arvProtocolDetails.getDescription());
            existingArvProtocol.setIsForPregnant(arvProtocolDetails.getIsForPregnant());
            existingArvProtocol.setIsForChildren(arvProtocolDetails.getIsForChildren());
            return ResponseEntity.ok(arvProtocolRepository.save(existingArvProtocol));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArvProtocol(@PathVariable Long id) {
        if (arvProtocolRepository.existsById(id)) {
            arvProtocolRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 