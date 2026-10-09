DROP DATABASE IF EXISTS testroom;
CREATE DATABASE testroom CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE testroom;

-- ============================================================
-- usuario
-- ============================================================
CREATE TABLE usuario (
    id     BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cargo  VARCHAR(255) NOT NULL,
    email  VARCHAR(255) NOT NULL,
    senha  VARCHAR(255) NOT NULL,
    CONSTRAINT usuario_cargo_check
        CHECK (cargo IN ('PROFESSOR')),
    CONSTRAINT uk_usuario_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- professor
-- ============================================================
CREATE TABLE professor (
    id             BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    descricao      VARCHAR(255),
    especialidade  VARCHAR(255),
    foto           TEXT,
    nome           MEDIUMTEXT,
    usuario_id     BIGINT NOT NULL,
    CONSTRAINT uk_professor_usuario UNIQUE (usuario_id),
    CONSTRAINT fk_professor_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- questao
-- ============================================================
CREATE TABLE questao (
    id             BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    criado_por     VARCHAR(255),
    enunciado      VARCHAR(2000) NOT NULL,
    tipo_questao   VARCHAR(255) NOT NULL,
    professor_id   BIGINT NOT NULL,
    foto           MEDIUMTEXT,
    CONSTRAINT questao_tipo_questao_check
        CHECK (tipo_questao IN ('UNICA_ESCOLHA','MULTIPLA_ESCOLHA','VERDADEIROFALSO')),
    CONSTRAINT fk_questao_professor
        FOREIGN KEY (professor_id) REFERENCES professor(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- alternativa
-- ============================================================
CREATE TABLE alternativa (
    id          BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    texto       VARCHAR(255) NOT NULL,
    verdadeira  BOOLEAN NOT NULL,
    questao_id  BIGINT NOT NULL,
    CONSTRAINT fk_alternativa_questao
        FOREIGN KEY (questao_id) REFERENCES questao(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- categoria
-- ============================================================
CREATE TABLE categoria (
    id          BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    descricao   VARCHAR(2000),
    nome        VARCHAR(255) NOT NULL,
    criador_id  BIGINT NOT NULL,
    CONSTRAINT fk_categoria_criador
        FOREIGN KEY (criador_id) REFERENCES professor(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- categoria_compartilhada
-- ============================================================
CREATE TABLE categoria_compartilhada (
    categoria_id  BIGINT NOT NULL,
    professor_id  BIGINT NOT NULL,
    PRIMARY KEY (categoria_id, professor_id),
    CONSTRAINT fk_cat_compartilhada_categoria
        FOREIGN KEY (categoria_id) REFERENCES categoria(id),
    CONSTRAINT fk_cat_compartilhada_professor
        FOREIGN KEY (professor_id) REFERENCES professor(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- categoria_questao
-- ============================================================
CREATE TABLE categoria_questao (
    questao_id    BIGINT NOT NULL,
    categoria_id  BIGINT NOT NULL,
    PRIMARY KEY (questao_id, categoria_id),
    CONSTRAINT fk_categoria_questao_questao
        FOREIGN KEY (questao_id)   REFERENCES questao(id),
    CONSTRAINT fk_categoria_questao_categoria
        FOREIGN KEY (categoria_id) REFERENCES categoria(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- compartilhamento_categoria
-- ============================================================
CREATE TABLE compartilhamento_categoria (
    id                     BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    data_compartilhamento  DATETIME NOT NULL,
    status                 VARCHAR(20) NOT NULL,
    categoria_id           BIGINT NOT NULL,
    destino_id             BIGINT NOT NULL,
    origem_id              BIGINT NOT NULL,
    CONSTRAINT compartilhamento_categoria_status_check
        CHECK (status IN ('PENDENTE','ACEITO','RECUSADO')),
    CONSTRAINT uk_compartilhamento_cat_destino UNIQUE (categoria_id, destino_id),
    CONSTRAINT fk_compartilhamento_categoria
        FOREIGN KEY (categoria_id) REFERENCES categoria(id),
    CONSTRAINT fk_compartilhamento_destino
        FOREIGN KEY (destino_id) REFERENCES professor(id),
    CONSTRAINT fk_compartilhamento_origem
        FOREIGN KEY (origem_id) REFERENCES professor(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_compartilhamento_destino_status
    ON compartilhamento_categoria(destino_id, status);

-- ============================================================
-- atividade
-- ============================================================
CREATE TABLE atividade (
    id                  BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    titulo              VARCHAR(255) NOT NULL,
    instrucoes          VARCHAR(2000),
    valor_pontos        DECIMAL(7,2) NOT NULL,
    data_geracao        DATETIME DEFAULT CURRENT_TIMESTAMP,
    professor_id        BIGINT NOT NULL,
    descricao           VARCHAR(2000),
    quantidade_versoes  INT NOT NULL DEFAULT 1,
    grupo_id            VARCHAR(36),
    conteudo_html       LONGTEXT,
    CONSTRAINT fk_atividade_professor
        FOREIGN KEY (professor_id) REFERENCES professor(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_atividade_grupo     ON atividade(grupo_id);
CREATE INDEX idx_atividade_professor ON atividade(professor_id);

-- ============================================================
-- questao_atividade
-- ============================================================
CREATE TABLE questao_atividade (
    id                          BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    posicao_questao             INT NOT NULL,
    valor_pontos                DECIMAL(5,2) NOT NULL,
    questao_id                  BIGINT NOT NULL,
    atividade_id                BIGINT NOT NULL,
    ordem_alternativas          VARCHAR(500),
    enunciado_html              TEXT,
    alternativas_editadas_json  TEXT,
    CONSTRAINT fk_questao_atividade_questao
        FOREIGN KEY (questao_id)   REFERENCES questao(id)   ON DELETE CASCADE,
    CONSTRAINT fk_questao_atividade_atividade
        FOREIGN KEY (atividade_id) REFERENCES atividade(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_questao_atividade_atividade ON questao_atividade(atividade_id);
CREATE INDEX idx_questao_atividade_questao   ON questao_atividade(questao_id);