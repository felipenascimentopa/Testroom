package com.cefet.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.backend.entity.Professor;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {

}
