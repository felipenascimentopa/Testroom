package br.cefetmg.testroom.repository;

import br.cefetmg.testroom.model.RespostaAtividade;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RespostaAtividadeRepository extends JpaRepository<RespostaAtividade, Long> {
    Optional<RespostaAtividade> findByIdAlunoAndIdAtividade(Long idAluno, Long idAtividade);
    List<RespostaAtividade> findByIdAtividade(Long idAtividade);
    List<RespostaAtividade> findByIdAluno(Long idAluno);
}