package com.cefet.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.backend.entity.Categoria;
import com.cefet.backend.entity.Professor;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

     public boolean existsByNomeAndCriador(String nome, Professor criador);
     
}
