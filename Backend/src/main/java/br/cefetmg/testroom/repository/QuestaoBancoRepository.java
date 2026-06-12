package br.cefetmg.testroom.repository;

import br.cefetmg.testroom.model.QuestaoBanco;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestaoBancoRepository extends JpaRepository<QuestaoBanco, Long> {
    List<QuestaoBanco> findByIdCategoria(Long idCategoria);
    List<QuestaoBanco> findByIdProfessor(Long idProfessor);
}