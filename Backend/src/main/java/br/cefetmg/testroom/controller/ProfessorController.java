package br.cefetmg.testroom.controller;

import br.cefetmg.testroom.model.Professor;
import br.cefetmg.testroom.repository.ProfessorRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/professores")
public class ProfessorController {
    private final ProfessorRepository repository;

    public ProfessorController(ProfessorRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Professor> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Professor getById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor não encontrado"));
    }

    @PostMapping
    public Professor create(@RequestBody Professor professor) {
        professor.setId(null);
        return repository.save(professor);
    }

    @PutMapping
    public Professor update(@RequestBody Professor professor) {
        if (professor.getId() == null || !repository.existsById(professor.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID inválido");
        }
        return repository.save(professor);
    }

    @DeleteMapping("/{id}")
    public Professor delete(@PathVariable Long id) {
        Professor professor = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor não encontrado"));
        repository.deleteById(id);
        return professor;
    }
}