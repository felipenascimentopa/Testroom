package br.cefetmg.testroom.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import br.cefetmg.testroom.model.Matricula;
import br.cefetmg.testroom.repository.MatriculaRepository;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/matriculas")
public class MatriculaController {
    
    private final MatriculaRepository repository;
    
    public MatriculaController(MatriculaRepository repository) {
        this.repository = repository;
    }
    
    @GetMapping
    public List<Matricula> getAll() {
        return repository.findAll();
    }
    
    @GetMapping("/{id}")
    public Matricula getById(@PathVariable Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Matrícula não encontrada"));
    }
    
    @GetMapping("/aluno/{alunoId}")
    public List<Matricula> getByAluno(@PathVariable Long alunoId) {
        return repository.findByIdAluno(alunoId);
    }
    
    @GetMapping("/turma/{turmaId}")
    public List<Matricula> getByTurma(@PathVariable Long turmaId) {
        return repository.findByIdTurma(turmaId);
    }
    
    @PostMapping
    public Matricula create(@RequestBody Matricula matricula) {
        // Verifica se já existe matrícula
        java.util.Optional<Matricula> existing = repository.findByIdAlunoAndIdTurma(
            matricula.getIdAluno(), matricula.getIdTurma());
        if (existing.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Aluno já matriculado nesta turma");
        }
        matricula.setId(null);
        return repository.save(matricula);
    }
    
    @DeleteMapping("/{id}")
    public Matricula delete(@PathVariable Long id) {
        Matricula matricula = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Matrícula não encontrada"));
        repository.deleteById(id);
        return matricula;
    }
}