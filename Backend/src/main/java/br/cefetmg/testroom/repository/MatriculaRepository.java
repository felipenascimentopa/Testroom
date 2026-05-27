package br.cefetmg.testroom.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.cefetmg.testroom.model.Matricula;
import java.util.List;
import java.util.Optional;

@Repository
public interface MatriculaRepository extends JpaRepository<Matricula, Long> {
    List<Matricula> findByIdAluno(Long idAluno);
    List<Matricula> findByIdTurma(Long idTurma);
    Optional<Matricula> findByIdAlunoAndIdTurma(Long idAluno, Long idTurma);
}