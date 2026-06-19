package br.cefetmg.testroom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "atividade")
public class Atividade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_turma", nullable = false)
    private Long idTurma;

    @Column(length = 255, nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "dt_criacao")
    private LocalDateTime dtCriacao;

    @Column(name = "dt_entrega")
    private LocalDateTime dtEntrega;

    private Boolean disponivel = true;
    
    @Column(name = "tentativas_max")
    private Integer tentativasMax = 1;

    @Column(name = "calculo_nota")
    @Enumerated(EnumType.STRING)
    private CalculoNota calculoNota = CalculoNota.ULTIMA;

    @Column(name = "permite_ver_gabarito_antecipado")
    private Boolean permiteVerGabaritoAntecipado = false;

    @Column(name = "permite_ver_feedback_antecipado")
    private Boolean permiteVerFeedbackAntecipado = false;

    @Column(name = "permite_ver_nota_antecipado")
    private Boolean permiteVerNotaAntecipado = false;

    @Column(name = "permite_ver_respostas_antecipado")
    private Boolean permiteVerRespostasAntecipado = false;

    public enum CalculoNota {
        ULTIMA, MEDIA, MELHOR
    }

    @PrePersist
    protected void onCreate() {
        dtCriacao = LocalDateTime.now();
    }
}