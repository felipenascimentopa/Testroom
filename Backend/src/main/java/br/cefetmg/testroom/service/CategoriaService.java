package br.cefetmg.testroom.service;

import br.cefetmg.testroom.model.Categoria;
import br.cefetmg.testroom.model.CategoriaCompartilhada;
import br.cefetmg.testroom.model.Questao;
import br.cefetmg.testroom.model.QuestaoBanco;
import br.cefetmg.testroom.repository.CategoriaCompartilhadaRepository;
import br.cefetmg.testroom.repository.CategoriaRepository;
import br.cefetmg.testroom.repository.QuestaoBancoRepository;
import br.cefetmg.testroom.repository.QuestaoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaService {
    private final CategoriaRepository repository;
    private final CategoriaCompartilhadaRepository compartilhadaRepository;
    private final QuestaoRepository questaoRepository;     
    private final QuestaoBancoRepository questaoBancoRepository; 

    public CategoriaService(CategoriaRepository repository,
                            CategoriaCompartilhadaRepository compartilhadaRepository,
                            QuestaoRepository questaoRepository,
                            QuestaoBancoRepository questaoBancoRepository) {
        this.repository = repository;
        this.compartilhadaRepository = compartilhadaRepository;
        this.questaoRepository = questaoRepository;
        this.questaoBancoRepository = questaoBancoRepository;
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

    public Categoria atualizar(Long id, Categoria categoriaAtualizada) {
        Categoria existente = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Categoria não encontrada com id " + id));

        existente.setNome(categoriaAtualizada.getNome());
        existente.setIdCategoriaPai(categoriaAtualizada.getIdCategoriaPai());

        return repository.save(existente);
    }

    @Transactional
    public void excluir(Long id) {
        List<Categoria> subcategorias = repository.findByIdCategoriaPai(id);
        if (!subcategorias.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Não é possível excluir: existem subcategorias vinculadas.");
        }

        List<Questao> questoes = questaoRepository.findByIdCategoria(id);
        if (!questoes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Não é possível excluir: existem questões (em atividades) vinculadas a esta categoria.");
        }

        List<QuestaoBanco> questoesBanco = questaoBancoRepository.findByIdCategoria(id);
        if (!questoesBanco.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Não é possível excluir: existem questões no banco vinculadas a esta categoria.");
        }

        repository.deleteById(id);
    }
}