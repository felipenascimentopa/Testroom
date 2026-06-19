package br.cefetmg.testroom.repository;

import br.cefetmg.testroom.model.CategoriaCompartilhada;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoriaCompartilhadaRepository extends JpaRepository<CategoriaCompartilhada, Long> {
    List<CategoriaCompartilhada> findByIdProfessorCompartilhado(Long idProfessor);
}