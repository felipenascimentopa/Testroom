package br.cefetmg.testroom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "questao")
public class Questao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_atividade", nullable = false)
    private Long idAtividade;

    @Column(name = "id_categoria", nullable = false)
    private Long idCategoria;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String enunciado;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_pergunta", nullable = false)
    private TipoPergunta tipoPergunta;

    private Double peso = 1.0;

    @Column(name = "feedback_correto", columnDefinition = "TEXT")
    private String feedbackCorreto;

    @Column(name = "feedback_errado", columnDefinition = "TEXT")
    private String feedbackErrado;

    @Column(name = "gabarito_texto", columnDefinition = "TEXT")
    private String gabaritoTexto;

    public enum TipoPergunta {
        DISSERTATIVA, NUMERICA, VF, MULTIPLA_ESCOLHA, UNICA_ESCOLHA
    }
}