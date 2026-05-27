package br.cefetmg.testroom.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import br.cefetmg.testroom.model.Aluno;
import br.cefetmg.testroom.model.Professor;
import br.cefetmg.testroom.repository.AlunoRepository;
import br.cefetmg.testroom.repository.ProfessorRepository;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    
    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    
    public AuthController(AlunoRepository alunoRepository, ProfessorRepository professorRepository) {
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        String email = credenciais.get("email");
        String senha = credenciais.get("senha");
        
        // Tenta encontrar como Aluno
        Aluno aluno = alunoRepository.findAll().stream()
            .filter(a -> a.getEmail().equals(email) && a.getSenha().equals(senha))
            .findFirst()
            .orElse(null);
        
        if (aluno != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", aluno.getId());
            response.put("nome", aluno.getNome());
            response.put("email", aluno.getEmail());
            response.put("tipoUsuario", "ALUNO");
            return ResponseEntity.ok(response);
        }
        
        // Tenta encontrar como Professor
        Professor professor = professorRepository.findAll().stream()
            .filter(p -> p.getEmail().equals(email) && p.getSenha().equals(senha))
            .findFirst()
            .orElse(null);
        
        if (professor != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", professor.getId());
            response.put("nome", professor.getNome());
            response.put("email", professor.getEmail());
            response.put("tipoUsuario", "PROFESSOR");
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
    }
}