package br.cefetmg.testroom.service;

import br.cefetmg.testroom.model.Categoria;
import br.cefetmg.testroom.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoriaService {
    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    public List<Categoria> listarPorProfessor(Long idProfessor) {
        return repository.findByIdProfessor(idProfessor);
    }

    public Categoria salvar(Categoria categoria) {
        return repository.save(categoria);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}