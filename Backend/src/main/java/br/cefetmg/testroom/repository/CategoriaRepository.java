package br.cefetmg.testroom.repository;

import br.cefetmg.testroom.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByIdProfessor(Long idProfessor);
    List<Categoria> findByIdCategoriaPai(Long idCategoriaPai);
}