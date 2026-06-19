package br.cefetmg.testroom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "categoria_compartilhada")
public class CategoriaCompartilhada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_categoria", nullable = false)
    private Long idCategoria;

    @Column(name = "id_professor_compartilhado", nullable = false)
    private Long idProfessorCompartilhado;
}