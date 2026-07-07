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
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
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
  `descricao` VARCHAR(2000) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`questao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`questao` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`questao` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `tipo_questao` ENUM('UNICA_ESCOLHA', 'MULTIPLA_ESCOLHA', 'DISCURSIVA', 'VERDADEIROFALSO') NOT NULL,
  `enunciado` VARCHAR(2000) NOT NULL,
  `criado_por` VARCHAR(255) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`professor`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`professor` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`professor` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `usuario_id` BIGINT NOT NULL,
  `nome` VARCHAR(255) NOT NULL,
  `especialidade` VARCHAR(255) NULL,
  `descricao` VARCHAR(255) NULL,
  PRIMARY KEY (`id`, `usuario_id`),
  INDEX `fk_professor_usuario1_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_professor_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `Testroom`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`atividade`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`atividade` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`atividade` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255) NOT NULL,
  `valor_pontos` DECIMAL(3,2) NOT NULL,
  `professor_id` BIGINT NOT NULL,
  `professor_usuario_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_atividade_professor1_idx` (`professor_id` ASC, `professor_usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_atividade_professor1`
    FOREIGN KEY (`professor_id` , `professor_usuario_id`)
    REFERENCES `Testroom`.`professor` (`id` , `usuario_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`atividade_exportada`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`atividade_exportada` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`atividade_exportada` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `numero_export` INT NOT NULL,
  `atividade_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_numero_atividade_exportada` (`atividade_id` ASC, `numero_export` ASC),
  INDEX `fk_atividade_exportada_atividade1_idx` (`atividade_id` ASC),
  CONSTRAINT `fk_atividade_exportada_atividade1`
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
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `posicao` INT NOT NULL,
  `atividade_exportada_id` BIGINT NOT NULL,
  `questao_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_questao_exportada_atividade_exportada1_idx` (`atividade_exportada_id` ASC) VISIBLE,
  INDEX `fk_questao_exportada_questao1_idx` (`questao_id` ASC) VISIBLE,
  CONSTRAINT `fk_questao_exportada_atividade_exportada1`
    FOREIGN KEY (`atividade_exportada_id`)
    REFERENCES `Testroom`.`atividade_exportada` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_questao_exportada_questao1`
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
  `questao_id` BIGINT NOT NULL,
  `atividade_id` BIGINT NOT NULL,
  `posicao_questao` INT NOT NULL,
  `valor_pontos` DECIMAL(3,2) NOT NULL,
  PRIMARY KEY (`questao_id`, `atividade_id`),
  INDEX `fk_questao_atividade_questao1_idx` (`questao_id` ASC) VISIBLE,
  INDEX `fk_questao_atividade_atividade1_idx` (`atividade_id` ASC) VISIBLE,
  CONSTRAINT `fk_questao_atividade_questao1`
    FOREIGN KEY (`questao_id`)
    REFERENCES `Testroom`.`questao` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_questao_atividade_atividade1`
    FOREIGN KEY (`atividade_id`)
    REFERENCES `Testroom`.`atividade` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`escolha_multipla`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`escolha_multipla` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`escolha_multipla` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `questao_id` BIGINT NOT NULL,
  `opcaoA_texto` TEXT NOT NULL,
  `opcaoB_texto` TEXT NOT NULL,
  `opcaoC_texto` TEXT NOT NULL,
  `opcaoD_texto` TEXT NOT NULL,
  `opcoes_corretas` JSON NOT NULL,
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
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `questao_id` BIGINT NOT NULL,
  `opcaoA_texto` TEXT NOT NULL,
  `opcaoB_texto` TEXT NOT NULL,
  `opcaoC_texto` TEXT NOT NULL,
  `opcaoD_texto` TEXT NOT NULL,
  `opcao_correta` VARCHAR(1) NOT NULL,
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
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `questao_id` BIGINT NOT NULL,
  `opcao_correta` TINYINT NOT NULL,
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
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `questao_id` BIGINT NOT NULL,
  `tamanho_max` INT NULL,
  `resposta_exemplo` VARCHAR(200) NULL,
  PRIMARY KEY (`id`, `questao_id`),
  INDEX `fk_discursiva_questao1_idx` (`questao_id` ASC) VISIBLE,
  CONSTRAINT `fk_discursiva_questao1`
    FOREIGN KEY (`questao_id`)
    REFERENCES `Testroom`.`questao` (`id`)
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
  INDEX `fk_categoria_questao_questao1_idx` (`questao_id` ASC) VISIBLE,
  INDEX `fk_categoria_questao_categoria1_idx` (`categoria_id` ASC) VISIBLE,
  CONSTRAINT `fk_categoria_has_questao_categoria1`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `Testroom`.`categoria` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_categoria_has_questao_questao1`
    FOREIGN KEY (`questao_id`)
    REFERENCES `Testroom`.`questao` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`categoria_professor`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`categoria_professor` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`categoria_professor` (
  `categoria_id` BIGINT NOT NULL,
  `professor_id` BIGINT NOT NULL,
  `professor_usuario_id` BIGINT NOT NULL,
  PRIMARY KEY (`categoria_id`, `professor_id`, `professor_usuario_id`),
  INDEX `fk_categoria_usuario_categoria1_idx` (`categoria_id` ASC) VISIBLE,
  INDEX `fk_categoria_professor_professor1_idx` (`professor_id` ASC, `professor_usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_categoria_has_usuario_categoria1`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `Testroom`.`categoria` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_categoria_professor_professor1`
    FOREIGN KEY (`professor_id` , `professor_usuario_id`)
    REFERENCES `Testroom`.`professor` (`id` , `usuario_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;