package br.cefetmg.testroom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "professor")
public class Professor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 60, nullable = false)
    private String nome;

    @Column(length = 60, nullable = false, unique = true)
    private String email;

    @Column(length = 60, nullable = false)
    private String senha;

    @Column(length = 100)
    private String especialidade;
}