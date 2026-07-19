package com.cefet.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "alternativa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Alternativa {

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     @ManyToOne
     @JoinColumn(name = "questao_fechada_id")
     private QuestaoFechada questaoFechada;

     @Column(nullable = false, length = 255)
     private String texto;

     @Column(nullable = false, columnDefinition = "TINYINT(1)", unique = false)
     private Boolean verdadeira;
}
