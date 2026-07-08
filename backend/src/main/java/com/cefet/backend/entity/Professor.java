package com.cefet.backend.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "professor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Professor {

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     @OneToOne
     @JoinColumn(name = "usuario_id", unique = true, nullable = false)
     private Usuario usuario;

     @Column(nullable = false, length = 255, unique = false)
     private String nome;

     @Column(nullable = true, length = 255, unique = false)
     private String especialidade;

     @Column(nullable = true, length = 255, unique = false)
     private String descricao;

     @ManyToMany
     @JoinTable(
          name = "professor_categoria",
          joinColumns = @JoinColumn(name = "professor_id"),
          inverseJoinColumns = @JoinColumn(name = "categoria_id")
     )
     private Set<Categoria> categorias = new HashSet<>();


}
