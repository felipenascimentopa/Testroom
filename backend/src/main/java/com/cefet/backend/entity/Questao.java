package com.cefet.backend.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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

     @ManyToOne
     @JoinColumn(name = "professor_Id")
     private Professor professor;

     @Enumerated(EnumType.STRING)
     @Column(nullable = false)
     private TipoQuestao tipoQuestao;

     @Column(nullable = false, length = 2000, unique = false)
     private String enunciado;

     @Column(nullable = false, length = 255, unique = false)
     private String criadoPor;

     @OneToOne(mappedBy = "questao")
     private QuestaoAberta questaoAberta;

     @OneToOne(mappedBy = "questao")
     private QuestaoFechada questaoFechada;
     
     @ManyToMany(mappedBy = "questoes")
     @JsonIgnore
     private Set<Categoria> categorias = new HashSet<>();


}
