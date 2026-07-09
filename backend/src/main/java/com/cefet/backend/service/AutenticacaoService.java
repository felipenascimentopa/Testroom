package com.cefet.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.backend.dto.AutenticacaoRequestDTO;
import com.cefet.backend.dto.AutenticacaoResponseDTO;
import com.cefet.backend.entity.Usuario;
import com.cefet.backend.exception.BusinessException;
import com.cefet.backend.repository.UsuarioRepository;

@Service
public class AutenticacaoService {

     @Autowired
     private UsuarioRepository usuarioRepository;

     @Transactional
     public AutenticacaoResponseDTO autenticar(AutenticacaoRequestDTO dto) {

          Usuario usuario = usuarioRepository.findByEmailAndSenha(dto.getEmail(), dto.getSenha());

          if (usuario == null) {
               throw new BusinessException("Login e/ou senha inválidos.");
          }

          return new AutenticacaoResponseDTO(usuario);

     }
}
