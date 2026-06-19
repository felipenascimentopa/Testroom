package br.cefetmg.testroom.service;

import br.cefetmg.testroom.model.Categoria;
import br.cefetmg.testroom.model.CategoriaCompartilhada;
import br.cefetmg.testroom.repository.CategoriaCompartilhadaRepository;
import br.cefetmg.testroom.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaService {
    private final CategoriaRepository repository;
    private final CategoriaCompartilhadaRepository compartilhadaRepository; // Adicionado

    public CategoriaService(CategoriaRepository repository, CategoriaCompartilhadaRepository compartilhadaRepository) {
        this.repository = repository;
        this.compartilhadaRepository = compartilhadaRepository;
    }

    public List<Categoria> listarPorProfessor(Long idProfessor) {
        List<Categoria> proprias = repository.findByIdProfessor(idProfessor);
        
        List<CategoriaCompartilhada> compartilhamentos = compartilhadaRepository.findByIdProfessorCompartilhado(idProfessor);
        List<Long> idsCompartilhados = compartilhamentos.stream()
                .map(CategoriaCompartilhada::getIdCategoria)
                .collect(Collectors.toList());
                
        List<Categoria> compartilhadas = new ArrayList<>();
        if (!idsCompartilhados.isEmpty()) {
            compartilhadas = repository.findAllById(idsCompartilhados);
        }
        
        proprias.addAll(compartilhadas);
        return proprias;
    }

    public Categoria salvar(Categoria categoria) {
        return repository.save(categoria);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}