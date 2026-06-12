package br.cefetmg.testroom.controller;

import br.cefetmg.testroom.model.RespostaAtividade;
import br.cefetmg.testroom.model.RespostaQuestao;
import br.cefetmg.testroom.service.RespostaService;
import br.cefetmg.testroom.repository.RespostaQuestaoRepository;  // importe o repositório
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/respostas")
public class RespostaController {
    private final RespostaService service;
    private final RespostaQuestaoRepository respostaQuestaoRepository;  // adicione

    public RespostaController(RespostaService service, RespostaQuestaoRepository respostaQuestaoRepository) {
        this.service = service;
        this.respostaQuestaoRepository = respostaQuestaoRepository;
    }

    @PostMapping("/submeter")
    public ResponseEntity<?> submeter(@RequestParam Long alunoId,
            @RequestParam Long atividadeId,
            @RequestBody Map<Long, Object> respostas,
            @RequestParam(required = false) Integer tempoGasto) {
        try {
            RespostaAtividade resposta = service.submeterRespostas(alunoId, atividadeId, respostas, tempoGasto);
            return ResponseEntity.ok(resposta);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (RuntimeException e) {
            if (e.getMessage().contains("já respondeu")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
            }
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro inesperado: " + e.getMessage());
        }
    }

    @GetMapping("/aluno/{alunoId}/atividade/{atividadeId}")
    public RespostaAtividade obterResultado(@PathVariable Long alunoId, @PathVariable Long atividadeId) {
        return service.obterResultado(alunoId, atividadeId);
    }

    @GetMapping("/detalhes/{respostaAtividadeId}")
    public List<RespostaQuestao> getDetalhes(@PathVariable Long respostaAtividadeId) {
        return respostaQuestaoRepository.findByIdRespostaAtividade(respostaAtividadeId);
    }
}