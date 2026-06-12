package br.cefetmg.testroom.controller;

import br.cefetmg.testroom.model.Questao;
import br.cefetmg.testroom.service.QuestaoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/questoes")
public class QuestaoController {
    private final QuestaoService service;

    public QuestaoController(QuestaoService service) {
        this.service = service;
    }

    @GetMapping("/atividade/{atividadeId}")
    public List<Questao> listarPorAtividade(@PathVariable Long atividadeId) {
        return service.listarPorAtividade(atividadeId);
    }

    @GetMapping("/{id}")
    public Questao buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Questao criar(@RequestBody Questao questao) {
        return service.salvar(questao);
    }

    @PutMapping("/{id}")
    public Questao atualizar(@PathVariable Long id, @RequestBody Questao questao) {
        return service.atualizar(id, questao);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}