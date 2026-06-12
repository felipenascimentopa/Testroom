package br.cefetmg.testroom.service;

import br.cefetmg.testroom.model.Questao;
import br.cefetmg.testroom.repository.QuestaoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class QuestaoService {
    private final QuestaoRepository repository;

    public QuestaoService(QuestaoRepository repository) {
        this.repository = repository;
    }

    public List<Questao> listarPorAtividade(Long idAtividade) {
        return repository.findByIdAtividade(idAtividade);
    }

    public Questao buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Questão não encontrada"));
    }

    public Questao salvar(Questao questao) {
        return repository.save(questao);
    }

    public Questao atualizar(Long id, Questao questao) {
        questao.setId(id);
        return repository.save(questao);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}