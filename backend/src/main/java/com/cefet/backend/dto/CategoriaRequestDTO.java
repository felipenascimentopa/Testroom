package com.cefet.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CategoriaRequestDTO {

     @NotBlank(message = "O campo login é obrigatório")
     private String nome;

     private String descricao;

}
