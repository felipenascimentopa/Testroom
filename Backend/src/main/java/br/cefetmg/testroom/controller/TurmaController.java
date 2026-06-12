package br.cefetmg.testroom.controller;

import br.cefetmg.testroom.model.Turma;
import br.cefetmg.testroom.repository.TurmaRepository;
import br.cefetmg.testroom.service.TurmaService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/turmas")
public class TurmaController {
    private final TurmaRepository repository;
    private final TurmaService turmaService;

    public TurmaController(TurmaRepository repository, TurmaService turmaService) {
        this.repository = repository;
        this.turmaService = turmaService;
    }

    @GetMapping
    public List<Turma> getAll(@RequestParam(required = false) String codigo) {
        if (codigo != null) {
            return repository.findByCodigoAcesso(codigo).map(List::of).orElse(List.of());
        }
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Turma getById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Turma não encontrada"));
    }

    @GetMapping("/professor/{professorId}")
    public List<Turma> getByProfessor(@PathVariable Long professorId) {
        return repository.findByIdProfessor(professorId);
    }

    @PostMapping
    public Turma create(@RequestBody Turma turma) {
        turma.setId(null);
        return turmaService.criarTurma(turma);
    }

    @PutMapping("/{id}")
    public Turma update(@PathVariable Long id, @RequestBody Turma turma) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Turma não encontrada");
        }
        turma.setId(id);
        return repository.save(turma);
    }

    @DeleteMapping("/{id}")
    public Turma delete(@PathVariable Long id) {
        Turma turma = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Turma não encontrada"));
        repository.deleteById(id);
        return turma;
    }
}