package br.cefetmg.testroom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "resposta_questao")
public class RespostaQuestao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_resposta_atividade", nullable = false)
    private Long idRespostaAtividade;

    @Column(name = "id_questao", nullable = false)
    private Long idQuestao;

    @Column(name = "resposta_texto", columnDefinition = "TEXT")
    private String respostaTexto;

    private Boolean acerto; // null = não corrigido (dissertativa)
}