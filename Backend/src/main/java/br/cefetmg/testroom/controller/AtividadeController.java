package br.cefetmg.testroom.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import br.cefetmg.testroom.model.Atividade;
import br.cefetmg.testroom.repository.AtividadeRepository;

import java.util.List;

@RestController
@RequestMapping("/api/v1/atividades")
public class AtividadeController {
    
    private final AtividadeRepository repository;
    
    public AtividadeController(AtividadeRepository repository) {
        this.repository = repository;
    }
    
    @GetMapping
    public List<Atividade> getAll() {
        return repository.findAll();
    }
    
    @GetMapping("/{id}")
    public Atividade getById(@PathVariable Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Atividade não encontrada"));
    }
    
    @GetMapping("/turma/{turmaId}")
    public List<Atividade> getByTurma(@PathVariable Long turmaId) {
        return repository.findByIdTurma(turmaId);
    }
    
    @PostMapping
    public Atividade create(@RequestBody Atividade atividade) {
        atividade.setId(null);
        return repository.save(atividade);
    }
    
    @PutMapping("/{id}")
    public Atividade update(@PathVariable Long id, @RequestBody Atividade atividade) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Atividade não encontrada");
        }
        atividade.setId(id);
        return repository.save(atividade);
    }
    
    @DeleteMapping("/{id}")
    public Atividade delete(@PathVariable Long id) {
        Atividade atividade = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Atividade não encontrada"));
        repository.deleteById(id);
        return atividade;
    }
}