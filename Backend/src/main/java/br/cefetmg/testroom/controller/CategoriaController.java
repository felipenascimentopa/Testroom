package br.cefetmg.testroom.controller;

import br.cefetmg.testroom.model.Categoria;
import br.cefetmg.testroom.service.CategoriaService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/categorias")
public class CategoriaController {
    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    @GetMapping("/professor/{professorId}")
    public List<Categoria> listarPorProfessor(@PathVariable Long professorId) {
        return service.listarPorProfessor(professorId);
    }

    @PostMapping
    public Categoria criar(@RequestBody Categoria categoria) {
        return service.salvar(categoria);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}