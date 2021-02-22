SET NAMES utf8;
SET time_zone = 'Europe/Paris';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS `pyrite`;
CREATE DATABASE `pyrite` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `pyrite`;

DROP TABLE IF EXISTS `games`;
CREATE TABLE `games` (
  `gm_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `gm_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gm_updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `gm_score` smallint(4) DEFAULT NULL,
  `gm_time` smallint(4) DEFAULT NULL COMMENT 'en seconde',
  `gm_board` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gm_board_width` smallint(4) DEFAULT NULL,
  `gm_board_height` smallint(4) DEFAULT NULL,
  `gm_usr_id` int(11) unsigned NOT NULL,
  `gm_gs_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

  PRIMARY KEY (`gm_id`),
  KEY `gm_usr_id` (`gm_usr_id`),
  KEY `gm_gs_code` (`gm_gs_code`),
  CONSTRAINT `games_ibfk_1` FOREIGN KEY (`gm_usr_id`) REFERENCES `users` (`usr_id`),
  CONSTRAINT `games_ibfk_2` FOREIGN KEY (`gm_gs_code`) REFERENCES `game_states` (`gs_code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `usr_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `usr_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

  PRIMARY KEY (`usr_id`),
  UNIQUE KEY `usr_name` (`usr_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `game_states`;
CREATE TABLE `game_states` (
  `gs_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `gs_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

  PRIMARY KEY (`gs_id`),
  UNIQUE KEY `gs_code` (`gs_code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `game_states` (`gs_id`, `gs_code`) VALUES
(1,	'IN_PROGRESS'),
(2,	'FAIL'),
(3,	'WIN');



CREATE USER IF NOT EXISTS 'api'@'%' IDENTIFIED WITH mysql_native_password BY 'apipassword';
GRANT SELECT, INSERT, UPDATE, DELETE ON pyrite.games TO 'api'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON pyrite.users TO 'api'@'%';
GRANT SELECT ON pyrite.game_states TO 'api'@'%';
