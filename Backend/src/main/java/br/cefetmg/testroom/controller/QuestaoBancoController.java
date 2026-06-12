package br.cefetmg.testroom.controller;

import br.cefetmg.testroom.model.QuestaoBanco;
import br.cefetmg.testroom.service.QuestaoBancoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/questoes-banco")
public class QuestaoBancoController {
    private final QuestaoBancoService service;

    public QuestaoBancoController(QuestaoBancoService service) {
        this.service = service;
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<QuestaoBanco> listarPorCategoria(@PathVariable Long categoriaId) {
        return service.listarPorCategoria(categoriaId);
    }

    @GetMapping("/professor/{professorId}")
    public List<QuestaoBanco> listarPorProfessor(@PathVariable Long professorId) {
        return service.listarPorProfessor(professorId);
    }

    @PostMapping
    public QuestaoBanco criar(@RequestBody QuestaoBanco questao) {
        return service.salvar(questao);
    }

    @PutMapping("/{id}")
    public QuestaoBanco atualizar(@PathVariable Long id, @RequestBody QuestaoBanco questao) {
        questao.setId(id);
        return service.salvar(questao);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }

    @PostMapping("/copiar-para-atividade/{atividadeId}")
    public void copiarParaAtividade(@PathVariable Long atividadeId,
                                    @RequestBody List<Long> idsQuestoes,
                                    @RequestParam boolean randomizar) {
        service.copiarParaAtividade(atividadeId, idsQuestoes, randomizar);
    }
}