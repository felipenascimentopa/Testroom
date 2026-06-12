package br.cefetmg.testroom.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "questao_banco")
public class QuestaoBanco {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_categoria", nullable = false)
    private Long idCategoria;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String enunciado;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_pergunta", nullable = false)
    private Questao.TipoPergunta tipoPergunta;

    private Double peso = 1.0;

    @Column(name = "feedback_correto", columnDefinition = "TEXT")
    private String feedbackCorreto;

    @Column(name = "feedback_errado", columnDefinition = "TEXT")
    private String feedbackErrado;

    @Column(name = "gabarito_texto", columnDefinition = "TEXT")
    private String gabaritoTexto;

    @Column(name = "id_professor", nullable = false) // dono da questão
    private Long idProfessor;
}