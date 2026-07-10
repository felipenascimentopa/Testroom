package com.cefet.backend.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "categoria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Categoria {

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     @Column(nullable = false, length = 255, unique = false)
     private String nome;

     @Column(nullable = true, length = 2000, unique = false)
     private String descricao;

     @Column(nullable = false, length = 255, unique = false)
     private String criado_por;

     @ManyToMany(mappedBy = "categorias")
     @JsonIgnore
     private Set<Professor> professores = new HashSet<>();

     @ManyToMany
     @JoinTable(
          name = "categoria_questao",
          joinColumns = @JoinColumn(name = "categoria_id"),
          inverseJoinColumns = @JoinColumn(name = "questao_id")
     )
     private Set<Questao> questoes = new HashSet<>();
}
