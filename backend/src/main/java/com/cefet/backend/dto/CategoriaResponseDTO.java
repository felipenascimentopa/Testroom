package com.cefet.backend.dto;

import com.cefet.backend.entity.Categoria;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CategoriaResponseDTO {

     private Long id;
     private String nome;
     private String descricao;
     private Long criadorId;


     public CategoriaResponseDTO(Categoria categoria) {
          this.id = categoria.getId();
          this.nome = categoria.getNome();
          this.descricao = categoria.getDescricao();
          this.criadorId = categoria.getCriador().getId();
     }
     
}
