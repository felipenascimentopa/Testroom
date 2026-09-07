DROP DATABASE IF EXISTS testroom;
CREATE DATABASE testroom;
USE testroom;

CREATE TABLE usuario (
    id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cargo ENUM('PROFESSOR', 'ESTUDANTE') NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_usuario_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE professor (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    especialidade VARCHAR(255),
    descricao VARCHAR(255),
    foto VARCHAR(500),
    usuario_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_professor_usuario (usuario_id),
    CONSTRAINT fk_professor_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE questao (
    id BIGINT NOT NULL AUTO_INCREMENT,
    tipo_questao ENUM('UNICA_ESCOLHA', 'MULTIPLA_ESCOLHA', 'VERDADEIROFALSO') NOT NULL,
    enunciado VARCHAR(2000) NOT NULL,
    criado_por VARCHAR(255),
    valor_pontos DECIMAL(3,2) NOT NULL,
    professor_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_questao_professor FOREIGN KEY (professor_id) REFERENCES professor(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE alternativa (
    id BIGINT NOT NULL AUTO_INCREMENT,
    texto VARCHAR(255) NOT NULL,
    verdadeira TINYINT(1) NOT NULL,
    questao_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_alternativa_questao FOREIGN KEY (questao_id) REFERENCES questao(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE atividade (
    id BIGINT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    instrucoes VARCHAR(2000),
    valor_pontos DECIMAL(5,2) NOT NULL,
    data_geracao DATETIME DEFAULT CURRENT_TIMESTAMP,
    professor_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_atividade_professor FOREIGN KEY (professor_id) REFERENCES professor(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE categoria (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    descricao VARCHAR(2000),
    criador_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_categoria_criador FOREIGN KEY (criador_id) REFERENCES professor(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE categoria_questao (
    questao_id BIGINT NOT NULL,
    categoria_id BIGINT NOT NULL,
    PRIMARY KEY (questao_id, categoria_id),
    CONSTRAINT fk_categoria_questao_questao FOREIGN KEY (questao_id) REFERENCES questao(id),
    CONSTRAINT fk_categoria_questao_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE categoria_compartilhada (
    categoria_id BIGINT NOT NULL,
    professor_id BIGINT NOT NULL,
    PRIMARY KEY (categoria_id, professor_id),
    CONSTRAINT fk_categoria_compartilhada_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id),
    CONSTRAINT fk_categoria_compartilhada_professor FOREIGN KEY (professor_id) REFERENCES professor(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE questao_atividade (
    id BIGINT NOT NULL AUTO_INCREMENT,
    posicao_questao INT NOT NULL,
    valor_pontos DECIMAL(5,2) NOT NULL,
    questao_id BIGINT NOT NULL,
    atividade_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_questao_atividade_questao FOREIGN KEY (questao_id) REFERENCES questao(id) ON DELETE CASCADE,
    CONSTRAINT fk_questao_atividade_atividade FOREIGN KEY (atividade_id) REFERENCES atividade(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_questao_atividade_atividade ON questao_atividade(atividade_id);
CREATE INDEX idx_questao_atividade_questao ON questao_atividade(questao_id);