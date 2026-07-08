package com.cefet.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.backend.entity.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

}
