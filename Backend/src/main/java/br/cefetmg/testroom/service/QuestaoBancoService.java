package br.cefetmg.testroom.service;

import br.cefetmg.testroom.model.*;
import br.cefetmg.testroom.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class QuestaoBancoService {
    private final QuestaoBancoRepository questaoBancoRepository;
    private final AlternativaRepository alternativaRepository;
    private final QuestaoRepository questaoRepository;

    public QuestaoBancoService(QuestaoBancoRepository questaoBancoRepository,
                               AlternativaRepository alternativaRepository,
                               QuestaoRepository questaoRepository) {
        this.questaoBancoRepository = questaoBancoRepository;
        this.alternativaRepository = alternativaRepository;
        this.questaoRepository = questaoRepository;
    }

    public List<QuestaoBanco> listarPorCategoria(Long categoriaId) {
        return questaoBancoRepository.findByIdCategoria(categoriaId);
    }

    public List<QuestaoBanco> listarPorProfessor(Long professorId) {
        return questaoBancoRepository.findByIdProfessor(professorId);
    }

    public QuestaoBanco salvar(QuestaoBanco questao) {
        return questaoBancoRepository.save(questao);
    }

    public void excluir(Long id) {
        questaoBancoRepository.deleteById(id);
    }

    @Transactional
    public void copiarParaAtividade(Long atividadeId, List<Long> idsQuestoesBanco, boolean randomizar) {
        List<QuestaoBanco> originais = questaoBancoRepository.findAllById(idsQuestoesBanco);
        if (randomizar) {
            Collections.shuffle(originais);
        }
        for (QuestaoBanco original : originais) {
            // Copiar questão
            Questao nova = new Questao();
            nova.setIdAtividade(atividadeId);
            nova.setIdCategoria(original.getIdCategoria());
            nova.setEnunciado(original.getEnunciado());
            nova.setTipoPergunta(original.getTipoPergunta());
            nova.setPeso(original.getPeso());
            nova.setFeedbackCorreto(original.getFeedbackCorreto());
            nova.setFeedbackErrado(original.getFeedbackErrado());
            nova.setGabaritoTexto(original.getGabaritoTexto());
            nova = questaoRepository.save(nova);

            // Copiar alternativas
            List<Alternativa> alternativasOriginais = alternativaRepository.findByIdQuestao(original.getId());
            for (Alternativa altOriginal : alternativasOriginais) {
                Alternativa novaAlt = new Alternativa();
                novaAlt.setIdQuestao(nova.getId());
                novaAlt.setTexto(altOriginal.getTexto());
                novaAlt.setCorreta(altOriginal.getCorreta());
                novaAlt.setOrdem(altOriginal.getOrdem());
                alternativaRepository.save(novaAlt);
            }
        }
    }
}