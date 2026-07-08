package com.cefet.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "questao_aberta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuestaoAberta {

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     @OneToOne
     @JoinColumn(name = "questao_id")
     private Questao questao;

     @Column(nullable = true, length = 2000, unique = false)
     private String respostaExemplo;

     @Column
     private Integer tamanhoMin;

     @Column
     private Integer tamanhoMax;
     
}
