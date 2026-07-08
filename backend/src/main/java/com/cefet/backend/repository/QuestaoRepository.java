package com.cefet.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.backend.entity.Questao;

public interface QuestaoRepository extends JpaRepository<Questao, Long> {
}
