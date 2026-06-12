package br.cefetmg.testroom.repository;

import br.cefetmg.testroom.model.RespostaQuestao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RespostaQuestaoRepository extends JpaRepository<RespostaQuestao, Long> {
    List<RespostaQuestao> findByIdRespostaAtividade(Long idRespostaAtividade);
}