package br.cefetmg.testroom.service;

import br.cefetmg.testroom.model.Alternativa;
import br.cefetmg.testroom.repository.AlternativaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AlternativaService {
    private final AlternativaRepository repository;

    public AlternativaService(AlternativaRepository repository) {
        this.repository = repository;
    }

    public List<Alternativa> listarPorQuestao(Long idQuestao) {
        return repository.findByIdQuestao(idQuestao);
    }

    public Alternativa salvar(Alternativa alternativa) {
        return repository.save(alternativa);
    }

    public Alternativa atualizar(Long id, Alternativa alternativa) {
        alternativa.setId(id);
        return repository.save(alternativa);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}