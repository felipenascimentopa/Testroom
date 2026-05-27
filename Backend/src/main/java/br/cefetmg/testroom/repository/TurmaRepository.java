package br.cefetmg.testroom.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.cefetmg.testroom.model.Turma;
import java.util.List;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {
    List<Turma> findByIdProfessor(Long idProfessor);
    List<Turma> findByCodigoAcesso(String codigoAcesso);
}