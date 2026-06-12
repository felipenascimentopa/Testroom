package br.cefetmg.testroom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "alternativa")
public class Alternativa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_questao", nullable = false)
    private Long idQuestao;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    private Boolean correta = false;

    private Integer ordem = 0;
}