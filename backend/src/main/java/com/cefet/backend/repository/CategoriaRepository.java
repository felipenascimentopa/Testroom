package com.cefet.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.backend.entity.Categoria;
import com.cefet.backend.entity.Professor;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

     boolean existsByNomeAndCriador(String nome, Professor criador);

     boolean existsByCriador(Professor criador);

     List<Categoria> findByCriador(Professor criador);

}
