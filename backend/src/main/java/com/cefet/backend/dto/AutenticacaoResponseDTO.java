package com.cefet.backend.dto;

import com.cefet.backend.entity.Usuario;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AutenticacaoResponseDTO {

     private Long id;
     private String email;
     private String senha;

     public AutenticacaoResponseDTO(Usuario usuario) {
          this.id = usuario.getId();
          this.email = usuario.getEmail();
          this.senha = usuario.getSenha();
     }
}
