-- Temporarily set them off while creating tables
-- Set back in the end of this file
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Schema popcorn
CREATE SCHEMA IF NOT EXISTS `popcorn` ;
USE `popcorn` ;



-- Table `popcorn`.`Comment`
CREATE TABLE IF NOT EXISTS `popcorn`.`Comment` (
  `cid` INT NOT NULL AUTO_INCREMENT,
  `uid` INT NOT NULL,
  `mid` INT NOT NULL,
  `content` VARCHAR(200) CHARACTER SET 'utf8mb4' NOT NULL,
  `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastUpdated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`cid`, `uid`, `mid`),
  INDEX `fk_Comment_User1_idx` (`uid` ASC),
  INDEX `fk_Comment_Movie1_idx` (`mid` ASC),
  UNIQUE INDEX `cid_UNIQUE` (`cid` ASC),
  CONSTRAINT `fk_Comment_User1`
    FOREIGN KEY (`uid`)
    REFERENCES `popcorn`.`User` (`uid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Comment_Movie1`
    FOREIGN KEY (`mid`)
    REFERENCES `popcorn`.`Movie` (`mid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- Table `popcorn`.`Genre`
CREATE TABLE IF NOT EXISTS `popcorn`.`Genre` (
  `gid` INT NOT NULL AUTO_INCREMENT,
  `genre` VARCHAR(45) CHARACTER SET 'utf8mb4' NOT NULL,
  PRIMARY KEY (`gid`),
  INDEX `genre` (`genre` ASC),
  UNIQUE INDEX `genre_UNIQUE` (`genre` ASC))
ENGINE = InnoDB;


-- Table `popcorn`.`Movie`
CREATE TABLE IF NOT EXISTS `popcorn`.`Movie` (
  `mid` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) CHARACTER SET 'utf8mb4' NOT NULL,
  `description` VARCHAR(500) CHARACTER SET 'utf8mb4' NOT NULL,
  PRIMARY KEY (`mid`),
  INDEX `name` (`name` ASC),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
ENGINE = InnoDB;


-- Table `popcorn`.`MovieGenre`
CREATE TABLE IF NOT EXISTS `popcorn`.`MovieGenre` (
  `mid` INT NOT NULL,
  `gid` INT NOT NULL,
  PRIMARY KEY (`mid`, `gid`),
  INDEX `fk_Movie_has_Genre_Genre1_idx` (`gid` ASC),
  INDEX `fk_Movie_has_Genre_Movie_idx` (`mid` ASC),
  CONSTRAINT `fk_Movie_has_Genre_Movie`
    FOREIGN KEY (`mid`)
    REFERENCES `popcorn`.`Movie` (`mid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Movie_has_Genre_Genre1`
    FOREIGN KEY (`gid`)
    REFERENCES `popcorn`.`Genre` (`gid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- Table `popcorn`.`MovieRating`
CREATE TABLE IF NOT EXISTS `popcorn`.`MovieRating` (
  `rid` INT NOT NULL AUTO_INCREMENT,
  `stars` INT NOT NULL,
  `uid` INT NOT NULL,
  `mid` INT NOT NULL,
  `isDeleted` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`rid`, `uid`, `mid`),
  INDEX `stars` (`stars` ASC),
  INDEX `fk_MovieRating_User1_idx` (`uid` ASC),
  INDEX `fk_MovieRating_Movie1_idx` (`mid` ASC),
  UNIQUE INDEX `rid_UNIQUE` (`rid` ASC),
  CONSTRAINT `fk_MovieRating_User1`
    FOREIGN KEY (`uid`)
    REFERENCES `popcorn`.`User` (`uid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_MovieRating_Movie1`
    FOREIGN KEY (`mid`)
    REFERENCES `popcorn`.`Movie` (`mid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- Table `popcorn`.`NewMovieRequest`
CREATE TABLE IF NOT EXISTS `popcorn`.`NewMovieRequest` (
  `nid` INT NOT NULL AUTO_INCREMENT,
  `uid` INT NOT NULL,
  `movieName` VARCHAR(150) CHARACTER SET 'utf8mb4' NOT NULL,
  `description` VARCHAR(500) CHARACTER SET 'utf8mb4' NULL,
  `reason` VARCHAR(200) NULL,
  `status` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`nid`, `uid`),
  INDEX `fk_NewMovieRequest_User1_idx` (`uid` ASC),
  UNIQUE INDEX `movieName_UNIQUE` (`movieName` ASC),
  UNIQUE INDEX `nid_UNIQUE` (`nid` ASC),
  CONSTRAINT `fk_NewMovieRequest_User1`
    FOREIGN KEY (`uid`)
    REFERENCES `popcorn`.`User` (`uid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- Table `popcorn`.`User`
CREATE TABLE IF NOT EXISTS `popcorn`.`User` (
  `uid` INT NOT NULL AUTO_INCREMENT,
  `password` BLOB NOT NULL,
  `username` VARCHAR(45) CHARACTER SET 'utf8mb4' NOT NULL,
  `lastLogin` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isBlocked` TINYINT NOT NULL DEFAULT 0,
  `isDeleted` TINYINT NOT NULL DEFAULT 0,
  `accessLevel` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`uid`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  UNIQUE INDEX `uid_UNIQUE` (`uid` ASC))
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;