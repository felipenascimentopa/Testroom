package br.cefetmg.testroom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "alternativa_banco")
public class AlternativaBanco {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_questao_banco", nullable = false)
    private Long idQuestaoBanco;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    private Boolean correta = false;

    private Integer ordem = 0;

    @Column(columnDefinition = "TEXT")
    private String feedback;
}