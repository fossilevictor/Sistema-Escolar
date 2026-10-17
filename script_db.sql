-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8mb3 ;
-- -----------------------------------------------------
-- Schema escola
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema escola
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `escola` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`aluno`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`aluno` (
  `idaluno` INT NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `alunocol` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idaluno`),
  UNIQUE INDEX `idaluno_UNIQUE` (`idaluno` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`professor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`professor` (
  `idprofessor` INT NOT NULL,
  `nome` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idprofessor`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`disciplina`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`disciplina` (
  `iddisciplina` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL DEFAULT NULL,
  `professor_idprofessor` INT NOT NULL,
  PRIMARY KEY (`iddisciplina`),
  UNIQUE INDEX `iddisciplina_UNIQUE` (`iddisciplina` ASC) VISIBLE,
  INDEX `fk_disciplina_professor1_idx` (`professor_idprofessor` ASC) VISIBLE,
  CONSTRAINT `fk_disciplina_professor1`
    FOREIGN KEY (`professor_idprofessor`)
    REFERENCES `mydb`.`professor` (`idprofessor`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`usuario` (
  `idusuario` INT NOT NULL,
  PRIMARY KEY (`idusuario`))
ENGINE = InnoDB;

USE `escola` ;

-- -----------------------------------------------------
-- Table `escola`.`aluno`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `escola`.`aluno` (
  `aluno_id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `data_nascimento` DATE NULL DEFAULT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `telefone` VARCHAR(11) NULL DEFAULT NULL,
  `matricula` VARCHAR(10) NULL DEFAULT NULL,
  `sobrenome` VARCHAR(255) NULL DEFAULT NULL,
  `sexo` CHAR(1) NULL DEFAULT NULL,
  `cpf` CHAR(11) NULL DEFAULT NULL,
  `situacao` VARCHAR(255) NULL DEFAULT NULL,
  `numero` INT NULL DEFAULT NULL,
  `rua` VARCHAR(255) NULL DEFAULT NULL,
  `bairro` VARCHAR(255) NULL DEFAULT NULL,
  `complemento` VARCHAR(255) NULL DEFAULT NULL,
  `cidade` VARCHAR(255) NULL DEFAULT NULL,
  `estado` VARCHAR(255) NULL DEFAULT NULL,
  `data_ingresso` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`aluno_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `escola`.`curso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `escola`.`curso` (
  `curso_id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NULL DEFAULT NULL,
  `descricao` VARCHAR(255) NULL DEFAULT NULL,
  `duracao` VARCHAR(255) NULL DEFAULT NULL,
  `status` VARCHAR(255) NULL DEFAULT NULL,
  `data_criacao` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`curso_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `escola`.`professor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `escola`.`professor` (
  `professor_id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(200) NOT NULL,
  `sexo` CHAR(1) NULL DEFAULT NULL,
  `cpf` CHAR(11) NULL DEFAULT NULL,
  `nascimento` DATE NULL DEFAULT NULL,
  `status` VARCHAR(20) NULL DEFAULT NULL,
  `formacao` ENUM('G', 'M', 'L', 'P', 'D') NULL DEFAULT NULL,
  `emissao` DATE NULL DEFAULT NULL,
  `observacao` TEXT NULL DEFAULT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `telefone` VARCHAR(20) NULL DEFAULT NULL,
  `cep` CHAR(9) NULL DEFAULT NULL,
  `rua` VARCHAR(255) NULL DEFAULT NULL,
  `numero` CHAR(4) NULL DEFAULT NULL,
  `complemento` TEXT NULL DEFAULT NULL,
  `bairro` VARCHAR(255) NULL DEFAULT NULL,
  `cidade` VARCHAR(255) NULL DEFAULT NULL,
  `estado` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`professor_id`),
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 15
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `escola`.`disciplina`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `escola`.`disciplina` (
  `disciplina_id` INT NOT NULL AUTO_INCREMENT,
  `nome_disciplina` VARCHAR(100) NOT NULL,
  `carga_horaria` INT NOT NULL,
  `ementa` TEXT NULL DEFAULT NULL,
  `modulo` INT NULL DEFAULT NULL,
  `professor_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`disciplina_id`),
  INDEX `fk_professor_id` (`professor_id` ASC) VISIBLE,
  CONSTRAINT `fk_professor_id`
    FOREIGN KEY (`professor_id`)
    REFERENCES `escola`.`professor` (`professor_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `escola`.`turma`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `escola`.`turma` (
  `turma_id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(50) NULL DEFAULT NULL,
  `modulo` INT NOT NULL,
  `ano_semetre` INT NULL DEFAULT NULL,
  `turno` VARCHAR(50) NULL DEFAULT NULL,
  `sala` VARCHAR(100) NULL DEFAULT NULL,
  `curso_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`turma_id`),
  INDEX `fk_curso_id` (`curso_id` ASC) VISIBLE,
  CONSTRAINT `fk_curso_id`
    FOREIGN KEY (`curso_id`)
    REFERENCES `escola`.`curso` (`curso_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `escola`.`matricula`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `escola`.`matricula` (
  `matricula_id` INT NOT NULL AUTO_INCREMENT,
  `aluno_id` INT NULL DEFAULT NULL,
  `turma_id` INT NULL DEFAULT NULL,
  `data_matricula` DATE NOT NULL,
  `status_matricula` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`matricula_id`),
  INDEX `aluno_id` (`aluno_id` ASC) VISIBLE,
  INDEX `turma_id` (`turma_id` ASC) VISIBLE,
  CONSTRAINT `matricula_ibfk_1`
    FOREIGN KEY (`aluno_id`)
    REFERENCES `escola`.`aluno` (`aluno_id`),
  CONSTRAINT `matricula_ibfk_2`
    FOREIGN KEY (`turma_id`)
    REFERENCES `escola`.`turma` (`turma_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `escola`.`notas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `escola`.`notas` (
  `notas_id` INT NOT NULL AUTO_INCREMENT,
  `matricula_id` INT NULL DEFAULT NULL,
  `tipo_avaliacao` VARCHAR(255) NOT NULL,
  `data_avaliacao` DATE NOT NULL,
  `valor_nota` DECIMAL(5,2) NOT NULL,
  PRIMARY KEY (`notas_id`),
  INDEX `matricula_id` (`matricula_id` ASC) VISIBLE,
  CONSTRAINT `notas_ibfk_1`
    FOREIGN KEY (`matricula_id`)
    REFERENCES `escola`.`matricula` (`matricula_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `escola`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `escola`.`usuario` (
  `usuario_id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `senha_hash` VARCHAR(150) NOT NULL,
  `data_nascimento` DATE NULL DEFAULT NULL,
  `sexo` ENUM('F', 'M') NULL DEFAULT NULL,
  `perfil` ENUM('ADMIN', 'USER') NULL DEFAULT 'USER',
  `status` ENUM('0', '1') NULL DEFAULT '0',
  `criado_em` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`usuario_id`),
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
