package br.cefetmg.testroom.repository;

import br.cefetmg.testroom.model.AlternativaBanco;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlternativaBancoRepository extends JpaRepository<AlternativaBanco, Long> {
    List<AlternativaBanco> findByIdQuestaoBanco(Long idQuestaoBanco);
}