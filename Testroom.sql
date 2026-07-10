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
  `cargo` ENUM('PROFESSOR', 'ESTUDANTE') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`professor`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`professor` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`professor` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `especialidade` VARCHAR(255) NULL DEFAULT NULL,
  `descricao` VARCHAR(255) NULL DEFAULT NULL,
  `usuario_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_professor_usuario1_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_professor_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `Testroom`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`categoria`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`categoria` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`categoria` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `descricao` VARCHAR(2000) NULL DEFAULT NULL,
  `criado_por` VARCHAR(255) NULL,
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
  `criado_por` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`questao_aberta`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`questao_aberta` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`questao_aberta` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `resposta_exemplo` VARCHAR(2000) NULL DEFAULT NULL,
  `tamanho_min` INT(11) NULL DEFAULT NULL,
  `tamanho_max` INT(11) NULL DEFAULT NULL,
  `questao_id` BIGINT(20) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_discursiva_questao1_idx` (`questao_id` ASC) VISIBLE,
  CONSTRAINT `fk_discursiva_questao1`
    FOREIGN KEY (`questao_id`)
    REFERENCES `Testroom`.`questao` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`questao_fechada`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`questao_fechada` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`questao_fechada` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `questao_id` BIGINT NOT NULL,
  `tipo_questao_fechada` ENUM('UNICA_ESCOLHA', 'MULTIPLA_ESCOLHA', 'DISCURSIVA', 'VERDADEIROFALSO') NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_questao_fechada_questao1_idx` (`questao_id` ASC) VISIBLE,
  CONSTRAINT `fk_questao_fechada_questao1`
    FOREIGN KEY (`questao_id`)
    REFERENCES `Testroom`.`questao` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`alternativa`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`alternativa` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`alternativa` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `questao_fechada_id` BIGINT NOT NULL,
  `texto` VARCHAR(255) NOT NULL,
  `verdadeira` TINYINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_alternativa_questao_fechada1_idx` (`questao_fechada_id` ASC) VISIBLE,
  CONSTRAINT `fk_alternativa_questao_fechada1`
    FOREIGN KEY (`questao_fechada_id`)
    REFERENCES `Testroom`.`questao_fechada` (`id`)
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
  PRIMARY KEY (`id`),
  INDEX `fk_atividade_professor1_idx` (`professor_id` ASC) VISIBLE,
  CONSTRAINT `fk_atividade_professor1`
    FOREIGN KEY (`professor_id`)
    REFERENCES `Testroom`.`professor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Testroom`.`questao_atividade`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`questao_atividade` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`questao_atividade` (
  `id` BIGINT NOT NULL,
  `posicao_questao` INT NOT NULL,
  `valor_pontos` DECIMAL(3,2) NOT NULL,
  `questao_id` BIGINT NOT NULL,
  `atividade_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
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
-- Table `Testroom`.`categoria_questao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`categoria_questao` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`categoria_questao` (
  `categoria_id` BIGINT NOT NULL,
  `questao_id` BIGINT NOT NULL,
  PRIMARY KEY (`categoria_id`, `questao_id`),
  INDEX `fk_categoria_has_questao_questao1_idx` (`questao_id` ASC) VISIBLE,
  INDEX `fk_categoria_has_questao_categoria1_idx` (`categoria_id` ASC) VISIBLE,
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
-- Table `Testroom`.`professor_categoria`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Testroom`.`professor_categoria` ;

CREATE TABLE IF NOT EXISTS `Testroom`.`professor_categoria` (
  `professor_id` BIGINT NOT NULL,
  `categoria_id` BIGINT NOT NULL,
  PRIMARY KEY (`professor_id`, `categoria_id`),
  INDEX `fk_professor_has_categoria_categoria1_idx` (`categoria_id` ASC) VISIBLE,
  INDEX `fk_professor_has_categoria_professor1_idx` (`professor_id` ASC) VISIBLE,
  CONSTRAINT `fk_professor_has_categoria_professor1`
    FOREIGN KEY (`professor_id`)
    REFERENCES `Testroom`.`professor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_professor_has_categoria_categoria1`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `Testroom`.`categoria` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;