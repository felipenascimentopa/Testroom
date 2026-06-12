package br.cefetmg.testroom.repository;

import br.cefetmg.testroom.model.Alternativa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlternativaRepository extends JpaRepository<Alternativa, Long> {
    List<Alternativa> findByIdQuestao(Long idQuestao);
    List<Alternativa> findByIdQuestaoAndCorretaTrue(Long idQuestao);
}