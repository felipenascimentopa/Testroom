package br.cefetmg.testroom.controller;

import br.cefetmg.testroom.model.Matricula;
import br.cefetmg.testroom.repository.MatriculaRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;

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
        if (matricula.getIdAluno() == null || matricula.getIdTurma() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "idAluno e idTurma são obrigatórios");
        }
        // Verifica duplicidade
        if (repository.findByIdAlunoAndIdTurma(matricula.getIdAluno(), matricula.getIdTurma()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Aluno já matriculado nesta turma");
        }
        matricula.setId(null);
        matricula.setDataMatricula(LocalDateTime.now());
        matricula.setAtivo(true);
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