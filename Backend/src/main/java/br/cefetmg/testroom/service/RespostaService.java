package br.cefetmg.testroom.service;

import br.cefetmg.testroom.model.*;
import br.cefetmg.testroom.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RespostaService {

    private final RespostaAtividadeRepository respostaAtividadeRepository;
    private final RespostaQuestaoRepository respostaQuestaoRepository;
    private final RespostaAlternativaRepository respostaAlternativaRepository;
    private final QuestaoRepository questaoRepository;
    private final AlternativaRepository alternativaRepository;
    private final AtividadeRepository atividadeRepository;

    public RespostaService(RespostaAtividadeRepository respostaAtividadeRepository,
            RespostaQuestaoRepository respostaQuestaoRepository,
            RespostaAlternativaRepository respostaAlternativaRepository,
            QuestaoRepository questaoRepository,
            AlternativaRepository alternativaRepository,
            AtividadeRepository atividadeRepository) {
        this.respostaAtividadeRepository = respostaAtividadeRepository;
        this.respostaQuestaoRepository = respostaQuestaoRepository;
        this.respostaAlternativaRepository = respostaAlternativaRepository;
        this.questaoRepository = questaoRepository;
        this.alternativaRepository = alternativaRepository;
        this.atividadeRepository = atividadeRepository;
    }

    @Transactional(rollbackFor = Exception.class)
    public RespostaAtividade submeterRespostas(Long alunoId, Long atividadeId,
            Map<Long, Object> respostasPorQuestao,
            Integer tempoGasto) {

        Atividade atividade = atividadeRepository.findById(atividadeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Atividade não encontrada"));

        long tentativasFeitas = respostaAtividadeRepository.countByIdAlunoAndIdAtividade(alunoId, atividadeId);
        int tentativaAtual = (int) tentativasFeitas + 1;

        // Verifica se o limite de tentativas foi excedido
        if (tentativasFeitas >= atividade.getTentativasMax()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Limite de " + atividade.getTentativasMax() + " tentativas excedido para esta atividade.");
        }

        RespostaAtividade respostaAtividade = new RespostaAtividade();
        respostaAtividade.setIdAluno(alunoId);
        respostaAtividade.setIdAtividade(atividadeId);
        respostaAtividade.setTempoGasto(tempoGasto != null ? tempoGasto : 0);
        respostaAtividade.setTentativaNumero(tentativaAtual); // Salva o número da nova tentativa
        respostaAtividade = respostaAtividadeRepository.save(respostaAtividade);

        List<Questao> questoes = questaoRepository.findByIdAtividade(atividadeId);
        double somaPesos = questoes.stream().mapToDouble(Questao::getPeso).sum();
        double notaTotal = 0.0;

        for (Questao q : questoes) {
            Object respostaUsuario = respostasPorQuestao.get(q.getId());
            boolean correta = false;

            RespostaQuestao rq = new RespostaQuestao();
            rq.setIdRespostaAtividade(respostaAtividade.getId());
            rq.setIdQuestao(q.getId());

            switch (q.getTipoPergunta()) {
                case UNICA_ESCOLHA:
                case VF:
                    Long altId = converterParaLong(respostaUsuario);
                    if (altId != null) {
                        Alternativa alt = alternativaRepository.findById(altId).orElse(null);
                        correta = (alt != null && alt.getCorreta());
                        rq.setRespostaTexto(altId.toString());
                        rq = respostaQuestaoRepository.save(rq);
                        RespostaAlternativa ra = new RespostaAlternativa();
                        ra.setIdRespostaQuestao(rq.getId());
                        ra.setIdAlternativa(altId);
                        respostaAlternativaRepository.save(ra);
                    } else {
                        rq.setRespostaTexto("");
                        rq = respostaQuestaoRepository.save(rq);
                    }
                    break;

                case MULTIPLA_ESCOLHA:
                    List<Long> idsSelecionados = converterParaListaLong(respostaUsuario);
                    Set<Long> idsCorretos = alternativaRepository.findByIdQuestaoAndCorretaTrue(q.getId())
                            .stream().map(Alternativa::getId).collect(Collectors.toSet());
                    correta = new HashSet<>(idsSelecionados).equals(idsCorretos);
                    rq.setRespostaTexto(idsSelecionados.toString());
                    rq = respostaQuestaoRepository.save(rq);
                    for (Long idAlt : idsSelecionados) {
                        RespostaAlternativa ra = new RespostaAlternativa();
                        ra.setIdRespostaQuestao(rq.getId());
                        ra.setIdAlternativa(idAlt);
                        respostaAlternativaRepository.save(ra);
                    }
                    break;

                case NUMERICA:
                    String respostaStr = respostaUsuario != null ? respostaUsuario.toString().trim() : "";
                    rq.setRespostaTexto(respostaStr);

                    Double respostaNum = null;
                    if (respostaUsuario != null) {
                        if (respostaUsuario instanceof Number) {
                            respostaNum = ((Number) respostaUsuario).doubleValue();
                        } else if (respostaUsuario instanceof String) {
                            String normalized = ((String) respostaUsuario).trim().replace(',', '.');
                            try {
                                respostaNum = Double.parseDouble(normalized);
                            } catch (NumberFormatException e) {
                                // ignora
                            }
                        }
                    }

                    Double gabaritoNum = null;
                    if (q.getGabaritoTexto() != null) {
                        String gabStr = q.getGabaritoTexto().trim().replace(',', '.');
                        try {
                            gabaritoNum = Double.parseDouble(gabStr);
                        } catch (NumberFormatException e) {
                            // ignora
                        }
                    }

                    correta = false;
                    if (respostaNum != null && gabaritoNum != null) {
                        double diff = Math.abs(respostaNum - gabaritoNum);
                        correta = diff < 0.0000001;
                    } else {
                        String respText = respostaUsuario != null ? respostaUsuario.toString().trim() : "";
                        String gabText = q.getGabaritoTexto() != null ? q.getGabaritoTexto().trim() : "";
                        correta = respText.equalsIgnoreCase(gabText);
                    }

                    rq.setAcerto(correta);
                    rq = respostaQuestaoRepository.save(rq);
                    break;

                case DISSERTATIVA:
                    String resp = respostaUsuario != null ? respostaUsuario.toString().trim() : "";
                    rq.setRespostaTexto(resp);
                    boolean igual = resp
                            .equalsIgnoreCase(q.getGabaritoTexto() != null ? q.getGabaritoTexto().trim() : "");
                    rq.setAcerto(igual);
                    rq = respostaQuestaoRepository.save(rq);
                    break;
            }

            if (q.getTipoPergunta() != Questao.TipoPergunta.DISSERTATIVA) {
                rq.setAcerto(correta);
                respostaQuestaoRepository.save(rq);
            }

            if (correta) {
                notaTotal += q.getPeso();
            }
        }

        double notaFinal = (somaPesos > 0) ? notaTotal : 0;
        respostaAtividade.setNota(notaFinal);
        return respostaAtividadeRepository.save(respostaAtividade);
    }

    public Double calcularNotaFinal(Long alunoId, Long atividadeId) {
        Atividade atividade = atividadeRepository.findById(atividadeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Atividade não encontrada"));

        List<RespostaAtividade> tentativas = respostaAtividadeRepository.findAllByIdAlunoAndIdAtividade(alunoId,
                atividadeId);
        if (tentativas.isEmpty()) {
            return 0.0;
        }

        switch (atividade.getCalculoNota()) {
            case MELHOR:
                return tentativas.stream().mapToDouble(RespostaAtividade::getNota).max().orElse(0.0);
            case MEDIA:
                return tentativas.stream().mapToDouble(RespostaAtividade::getNota).average().orElse(0.0);
            case ULTIMA:
            default:
                return tentativas.get(tentativas.size() - 1).getNota();
        }
    }

    public RespostaAtividade obterResultado(Long alunoId, Long atividadeId) {
        return respostaAtividadeRepository
                .findFirstByIdAlunoAndIdAtividadeOrderByTentativaNumeroDesc(alunoId, atividadeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resposta não encontrada"));
    }

    private Long converterParaLong(Object obj) {
        if (obj == null)
            return null;
        if (obj instanceof Number)
            return ((Number) obj).longValue();
        if (obj instanceof String) {
            try {
                return Long.parseLong((String) obj);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    private List<Long> converterParaListaLong(Object obj) {
        List<Long> lista = new ArrayList<>();
        if (obj == null)
            return lista;
        if (obj instanceof List) {
            for (Object item : (List<?>) obj) {
                Long valor = converterParaLong(item);
                if (valor != null)
                    lista.add(valor);
            }
        }
        return lista;
    }
}