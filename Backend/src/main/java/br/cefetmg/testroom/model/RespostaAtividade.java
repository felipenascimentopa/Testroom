package br.cefetmg.testroom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "resposta_atividade")
public class RespostaAtividade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_atividade", nullable = false)
    private Long idAtividade;

    @Column(name = "id_aluno", nullable = false)
    private Long idAluno;

    private Double nota = 0.0;

    @Column(name = "dt_envio")
    private LocalDateTime dtEnvio;

    @Column(name = "tempo_gasto")
    private Integer tempoGasto;

    @Column(name = "tentativa_numero")
    private Integer tentativaNumero = 1;

    @PrePersist
    protected void onCreate() {
        dtEnvio = LocalDateTime.now();
    }
}