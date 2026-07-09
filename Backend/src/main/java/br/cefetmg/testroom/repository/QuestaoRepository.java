package br.cefetmg.testroom.repository;

import br.cefetmg.testroom.model.Questao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestaoRepository extends JpaRepository<Questao, Long> {
    List<Questao> findByIdAtividade(Long idAtividade);
    List<Questao> findByIdCategoria(Long idCategoria);
}