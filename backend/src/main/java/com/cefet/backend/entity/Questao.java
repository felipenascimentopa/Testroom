package com.cefet.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "questao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Questao {

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     @Enumerated(EnumType.STRING)
     @Column(nullable = false)
     private TipoQuestao tipoQuestao;

     @Column(nullable = false, length = 2000, unique = false)
     private String enunciado;

     @Column(nullable = false, length = 255, unique = false)
     private String criadoPor;
}
