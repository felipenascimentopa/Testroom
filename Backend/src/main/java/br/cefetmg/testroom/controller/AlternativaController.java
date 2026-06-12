package br.cefetmg.testroom.controller;

import br.cefetmg.testroom.model.Alternativa;
import br.cefetmg.testroom.service.AlternativaService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/alternativas")
public class AlternativaController {
    private final AlternativaService service;

    public AlternativaController(AlternativaService service) {
        this.service = service;
    }

    @GetMapping("/questao/{questaoId}")
    public List<Alternativa> listarPorQuestao(@PathVariable Long questaoId) {
        return service.listarPorQuestao(questaoId);
    }

    @PostMapping
    public Alternativa criar(@RequestBody Alternativa alternativa) {
        return service.salvar(alternativa);
    }

    @PutMapping("/{id}")
    public Alternativa atualizar(@PathVariable Long id, @RequestBody Alternativa alternativa) {
        return service.atualizar(id, alternativa);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}