package com.cefet.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.backend.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>{

}
