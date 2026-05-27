package br.cefetmg.testroom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "matricula")
public class Matricula {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_aluno", nullable = false)
    private Long idAluno;

    @Column(name = "id_turma", nullable = false)
    private Long idTurma;

    @Column(name = "data_matricula")
    private LocalDateTime dataMatricula;

    private Boolean ativo = true;

    @PrePersist
    protected void onCreate() {
        dataMatricula = LocalDateTime.now();
    }
}