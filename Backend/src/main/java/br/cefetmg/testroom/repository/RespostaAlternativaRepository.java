package br.cefetmg.testroom.repository;

import br.cefetmg.testroom.model.RespostaAlternativa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RespostaAlternativaRepository extends JpaRepository<RespostaAlternativa, Long> {
    List<RespostaAlternativa> findByIdRespostaQuestao(Long idRespostaQuestao);
}