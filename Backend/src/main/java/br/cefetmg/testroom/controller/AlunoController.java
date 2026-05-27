package br.cefetmg.testroom.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.cefetmg.testroom.model.Aluno;
import br.cefetmg.testroom.repository.AlunoRepository;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/v1/alunos")

public class AlunoController {
    private AlunoRepository repository;
    public AlunoController(AlunoRepository repository) {
        this.repository = repository;
    }
    @PostMapping("")
    public Aluno inserir(@RequestBody Aluno aluno) {
        aluno.setId(null);
        repository.save(aluno);
        return aluno;
    }

    @GetMapping("")
    public List<Aluno> getAll() {
        return repository.findAll();
    }
    @GetMapping("/{id}")
    public Aluno getById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }
    
    @DeleteMapping("/{id}")
    public Aluno excluirAluno(@PathVariable Long id){
        Aluno aluno = repository.findById(id).orElse(null);
        if(aluno == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Aluno com id " + id + " não encontrado");
        }
        repository.deleteById(id);
        return aluno;
    }
    @PutMapping("")
    public Aluno alterarAluno(@RequestBody Aluno aluno) {
        if(aluno.getId() == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"id é obrigatório");
        }
        repository.save(aluno);
        return aluno;
    }
}
    

    