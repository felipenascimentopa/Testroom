-- -----------------------------------------------------
-- Schema Testroom
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `Testroom` ;

-- -----------------------------------------------------
-- Schema Testroom
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Testroom` ;
USE `Testroom` ;

-- -----------------------------------------------------
-- Table `Testroom`.`usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`usuario` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`usuario` (
  `id` BIGINT NOT NULL,
  `nome` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `cargo` ENUM('PROFESSOR', 'ESTUDANTE') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`categoria`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`categoria` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`categoria` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `descricao` VARCHAR(255) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`questao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`questao` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`questao` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `tipoQuestao` ENUM('UNICA_ESCOLHA', 'MULTIPLA_ESCOLHA', 'DISCURSIVA', 'VERDADEIRO_FALSO') NOT NULL,
  `enunciado` VARCHAR(2000) NOT NULL,
  `criadoPor` VARCHAR(255) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`atividade`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`atividade` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`atividade` (
  `id` BIGINT NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `valorPontos` DECIMAL(3,2) NOT NULL,
  `usuario_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Atividade_Usuario1_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_Atividade_Usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `Testroom`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`atividade_exportada`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`atividade_exportada` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`atividade_exportada` (
  `id` BIGINT NOT NULL,
  `atividade_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`, `atividade_id`),
  INDEX `fk_AtividadeExportada_Atividade1_idx` (`atividade_id` ASC) VISIBLE,
  CONSTRAINT `fk_AtividadeExportada_Atividade1`
    FOREIGN KEY (`atividade_id`)
    REFERENCES `Testroom`.`atividade` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`questao_exportada`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`questao_exportada` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`questao_exportada` (
  `id` BIGINT NOT NULL,
  `atividade_exportada_id` BIGINT NOT NULL,
  `posicao` INT NOT NULL,
  `notaMaxima` DECIMAL(5,2) NOT NULL,
  `questao_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`, `atividade_exportada_id`),
  INDEX `fk_QuestaoAtividadeExportada_AtividadeExportada1_idx` (`atividade_exportada_id` ASC) VISIBLE,
  INDEX `fk_QuestaoAtividadeExportada_Questao1_idx` (`questao_id` ASC) VISIBLE,
  CONSTRAINT `fk_QuestaoAtividadeExportada_AtividadeExportada1`
    FOREIGN KEY (`atividade_exportada_id`)
    REFERENCES `Testroom`.`atividade_exportada` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_QuestaoAtividadeExportada_Questao1`
    FOREIGN KEY (`questao_id`)
    REFERENCES `Testroom`.`questao` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`professor_categoria`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`professor_categoria` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`professor_categoria` (
  `usuario_id` BIGINT NOT NULL,
  `categoria_id` BIGINT NOT NULL,
  PRIMARY KEY (`usuario_id`, `categoria_id`),
  INDEX `fk_Usuario_has_Categoria_Categoria1_idx` (`categoria_id` ASC) VISIBLE,
  INDEX `fk_Usuario_has_Categoria_Usuario_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_Usuario_has_Categoria_Usuario`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `Testroom`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Usuario_has_Categoria_Categoria1`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `Testroom`.`categoria` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`categoria_questao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`categoria_questao` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`categoria_questao` (
  `categoria_id` BIGINT NOT NULL,
  `questao_id` BIGINT NOT NULL,
  PRIMARY KEY (`categoria_id`, `questao_id`),
  INDEX `fk_Categoria_has_Questao_Questao1_idx` (`questao_id` ASC) VISIBLE,
  INDEX `fk_Categoria_has_Questao_Categoria1_idx` (`categoria_id` ASC) VISIBLE,
  CONSTRAINT `fk_Categoria_has_Questao_Categoria1`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `Testroom`.`categoria` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Categoria_has_Questao_Questao1`
    FOREIGN KEY (`questao_id`)
    REFERENCES `Testroom`.`questao` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`questao_atividade`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`questao_atividade` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`questao_atividade` (
  `atividade_id` BIGINT NOT NULL,
  `questao_id` BIGINT NOT NULL,
  `posicaoQuestao` INT NOT NULL,
  `ValorPontos` DECIMAL(3,2) NOT NULL,
  PRIMARY KEY (`atividade_id`, `questao_id`),
  INDEX `fk_Atividade_has_Questao_Questao1_idx` (`questao_id` ASC) VISIBLE,
  INDEX `fk_Atividade_has_Questao_Atividade1_idx` (`atividade_id` ASC) VISIBLE,
  CONSTRAINT `fk_Atividade_has_Questao_Atividade1`
    FOREIGN KEY (`atividade_id`)
    REFERENCES `Testroom`.`atividade` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Atividade_has_Questao_Questao1`
    FOREIGN KEY (`questao_id`)
    REFERENCES `Testroom`.`questao` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`escolha_multipla`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`escolha_multipla` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`escolha_multipla` (
  `id` BIGINT NOT NULL,
  `opcaoA_texto` TEXT NOT NULL,
  `opcaoB_texto` TEXT NOT NULL,
  `opcaoC_texto` TEXT NOT NULL,
  `opcaoD_texto` TEXT NOT NULL,
  `opcoes_corretas` JSON NOT NULL,
  `questao_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`, `questao_id`),
  INDEX `fk_escolha_multipla_questao1_idx` (`questao_id` ASC) VISIBLE,
  CONSTRAINT `fk_escolha_multipla_questao1`
    FOREIGN KEY (`questao_id`)
    REFERENCES `Testroom`.`questao` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`escolha_unica`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`escolha_unica` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`escolha_unica` (
  `id` BIGINT NOT NULL,
  `opcaoA_texto` TEXT NOT NULL,
  `opcaoB_texto` TEXT NOT NULL,
  `opcaoC_texto` TEXT NOT NULL,
  `opcaoD_texto` TEXT NOT NULL,
  `opcao_correta` VARCHAR(1) NOT NULL,
  `questao_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`, `questao_id`),
  INDEX `fk_escolha_unica_questao1_idx` (`questao_id` ASC) VISIBLE,
  CONSTRAINT `fk_escolha_unica_questao1`
    FOREIGN KEY (`questao_id`)
    REFERENCES `Testroom`.`questao` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`verdadeiro_falso`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`verdadeiro_falso` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`verdadeiro_falso` (
  `id` BIGINT NOT NULL,
  `opcao_correta` TINYINT NOT NULL,
  `questao_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`, `questao_id`),
  INDEX `fk_verdadeiro_falso_questao1_idx` (`questao_id` ASC) VISIBLE,
  CONSTRAINT `fk_verdadeiro_falso_questao1`
    FOREIGN KEY (`questao_id`)
    REFERENCES `Testroom`.`questao` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`discursiva`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`discursiva` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`discursiva` (
  `id` BIGINT NOT NULL,
  `tamanhoMax` INT NULL,
  `questao_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`, `questao_id`),
  INDEX `fk_discursiva_questao1_idx` (`questao_id` ASC) VISIBLE,
  CONSTRAINT `fk_discursiva_questao1`
    FOREIGN KEY (`questao_id`)
    REFERENCES `Testroom`.`questao` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;