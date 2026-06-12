package br.cefetmg.testroom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "resposta_alternativa")
public class RespostaAlternativa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_resposta_questao", nullable = false)
    private Long idRespostaQuestao;

    @Column(name = "id_alternativa", nullable = false)
    private Long idAlternativa;
}