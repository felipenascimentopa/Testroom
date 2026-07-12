package com.cefet.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.backend.dto.CategoriaRequestDTO;
import com.cefet.backend.dto.CategoriaResponseDTO;
import com.cefet.backend.entity.Categoria;
import com.cefet.backend.entity.Professor;
import com.cefet.backend.exception.BusinessException;
import com.cefet.backend.exception.ResourceNotFoundException;
import com.cefet.backend.repository.CategoriaRepository;
import com.cefet.backend.repository.ProfessorRepository;

@Service
public class CategoriaService {

     @Autowired
     private CategoriaRepository categoriaRepository;

     @Autowired
     private ProfessorRepository professorRepository;

     @Transactional
     public CategoriaResponseDTO inserir(CategoriaRequestDTO dto, Long professorId) {

          Professor professor = professorRepository.findById(professorId)
               .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado. Id: " + professorId));

          if (categoriaRepository.existsByNomeAndCriador(dto.getNome(), professor)) {
               throw new BusinessException("Já existe uma categoria com ete nome cadastrada pelo professor encontrado!");
          }

          Categoria categoria = new Categoria();
          categoria.setNome(dto.getNome());
          categoria.setDescricao(dto.getDescricao());
          categoria.setCriador(professor);

          return new CategoriaResponseDTO(categoriaRepository.save(categoria));
     }

     @Transactional
     public List<CategoriaResponseDTO> listarPorCriador(Long professorId) {

          Professor professor = professorRepository.findById(professorId)
               .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado. Id: " + professorId));

          List<Categoria> categorias = categoriaRepository.findByCriador(professor);
          return categorias.stream().map(CategoriaResponseDTO::new).toList();
     }

     @Transactional
     public void excluir(Long id, Long professorId) {

          Professor professor = professorRepository.findById(professorId)
               .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado. Id: " + professorId));

          Categoria categoria = categoriaRepository.findById(id)
               .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada. Id: " + id));

          if (!categoria.getCriador().equals(professor)) {
               throw new BusinessException("Apenas o criador de categoria pode excluí-la");
          }

          categoriaRepository.deleteById(id);
     }
     
}
