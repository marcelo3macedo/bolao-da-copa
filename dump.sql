-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: localhost    Database: bolao_copa
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bets`
--

DROP TABLE IF EXISTS `bets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `participant_id` int NOT NULL,
  `game_id` int NOT NULL,
  `home_score` int NOT NULL,
  `away_score` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_bet` (`participant_id`,`game_id`),
  KEY `game_id` (`game_id`),
  CONSTRAINT `bets_ibfk_1` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bets_ibfk_2` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bets`
--

LOCK TABLES `bets` WRITE;
/*!40000 ALTER TABLE `bets` DISABLE KEYS */;
/*!40000 ALTER TABLE `bets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `id` int NOT NULL AUTO_INCREMENT,
  `home_team` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `away_team` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `home_flag` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `away_flag` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `game_date` datetime NOT NULL COMMENT 'stored in UTC',
  `stage` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Fase de Grupos',
  `group_name` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `home_score` int DEFAULT NULL,
  `away_score` int DEFAULT NULL,
  `is_finished` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,'México','África do Sul','🇲🇽','🇿🇦','2026-06-11 19:00:00','Fase de Grupos','A',NULL,NULL,0,'2026-06-05 17:00:49'),(2,'Coreia do Sul','República Tcheca','🇰🇷','🇨🇿','2026-06-12 02:00:00','Fase de Grupos','A',NULL,NULL,0,'2026-06-05 17:00:49'),(3,'República Tcheca','África do Sul','🇨🇿','🇿🇦','2026-06-18 16:00:00','Fase de Grupos','A',NULL,NULL,0,'2026-06-05 17:00:49'),(4,'México','Coreia do Sul','🇲🇽','🇰🇷','2026-06-19 03:00:00','Fase de Grupos','A',NULL,NULL,0,'2026-06-05 17:00:49'),(5,'República Tcheca','México','🇨🇿','🇲🇽','2026-06-25 01:00:00','Fase de Grupos','A',NULL,NULL,0,'2026-06-05 17:00:49'),(6,'África do Sul','Coreia do Sul','🇿🇦','🇰🇷','2026-06-25 01:00:00','Fase de Grupos','A',NULL,NULL,0,'2026-06-05 17:00:49'),(7,'Canadá','Bósnia e Herzegovina','🇨🇦','🇧🇦','2026-06-12 19:00:00','Fase de Grupos','B',NULL,NULL,0,'2026-06-05 17:00:49'),(8,'Catar','Suíça','🇶🇦','🇨🇭','2026-06-13 19:00:00','Fase de Grupos','B',NULL,NULL,0,'2026-06-05 17:00:49'),(9,'Suíça','Bósnia e Herzegovina','🇨🇭','🇧🇦','2026-06-18 19:00:00','Fase de Grupos','B',NULL,NULL,0,'2026-06-05 17:00:49'),(10,'Canadá','Catar','🇨🇦','🇶🇦','2026-06-18 22:00:00','Fase de Grupos','B',NULL,NULL,0,'2026-06-05 17:00:49'),(11,'Suíça','Canadá','🇨🇭','🇨🇦','2026-06-24 19:00:00','Fase de Grupos','B',NULL,NULL,0,'2026-06-05 17:00:49'),(12,'Bósnia e Herzegovina','Catar','🇧🇦','🇶🇦','2026-06-24 19:00:00','Fase de Grupos','B',NULL,NULL,0,'2026-06-05 17:00:49'),(13,'Brasil','Marrocos','🇧🇷','🇲🇦','2026-06-13 22:00:00','Fase de Grupos','C',NULL,NULL,0,'2026-06-05 17:00:49'),(14,'Haiti','Escócia','🇭🇹','🏴󠁧󠁢󠁳󠁣󠁴󠁿','2026-06-14 01:00:00','Fase de Grupos','C',NULL,NULL,0,'2026-06-05 17:00:49'),(15,'Escócia','Marrocos','🏴󠁧󠁢󠁳󠁣󠁴󠁿','🇲🇦','2026-06-19 22:00:00','Fase de Grupos','C',NULL,NULL,0,'2026-06-05 17:00:49'),(16,'Brasil','Haiti','🇧🇷','🇭🇹','2026-06-20 01:00:00','Fase de Grupos','C',NULL,NULL,0,'2026-06-05 17:00:49'),(17,'Escócia','Brasil','🏴󠁧󠁢󠁳󠁣󠁴󠁿','🇧🇷','2026-06-24 22:00:00','Fase de Grupos','C',NULL,NULL,0,'2026-06-05 17:00:49'),(18,'Marrocos','Haiti','🇲🇦','🇭🇹','2026-06-24 22:00:00','Fase de Grupos','C',NULL,NULL,0,'2026-06-05 17:00:49'),(19,'Estados Unidos','Paraguai','🇺🇸','🇵🇾','2026-06-13 01:00:00','Fase de Grupos','D',NULL,NULL,0,'2026-06-05 17:00:49'),(20,'Austrália','Turquia','🇦🇺','🇹🇷','2026-06-14 04:00:00','Fase de Grupos','D',NULL,NULL,0,'2026-06-05 17:00:49'),(21,'Estados Unidos','Austrália','🇺🇸','🇦🇺','2026-06-19 19:00:00','Fase de Grupos','D',NULL,NULL,0,'2026-06-05 17:00:49'),(22,'Turquia','Paraguai','🇹🇷','🇵🇾','2026-06-20 04:00:00','Fase de Grupos','D',NULL,NULL,0,'2026-06-05 17:00:49'),(23,'Turquia','Estados Unidos','🇹🇷','🇺🇸','2026-06-26 02:00:00','Fase de Grupos','D',NULL,NULL,0,'2026-06-05 17:00:49'),(24,'Paraguai','Austrália','🇵🇾','🇦🇺','2026-06-26 02:00:00','Fase de Grupos','D',NULL,NULL,0,'2026-06-05 17:00:49'),(25,'Alemanha','Curaçao','🇩🇪','🇨🇼','2026-06-14 17:00:00','Fase de Grupos','E',NULL,NULL,0,'2026-06-05 17:00:49'),(26,'Costa do Marfim','Equador','🇨🇮','🇪🇨','2026-06-14 23:00:00','Fase de Grupos','E',NULL,NULL,0,'2026-06-05 17:00:49'),(27,'Alemanha','Costa do Marfim','🇩🇪','🇨🇮','2026-06-20 20:00:00','Fase de Grupos','E',NULL,NULL,0,'2026-06-05 17:00:49'),(28,'Equador','Curaçao','🇪🇨','🇨🇼','2026-06-21 00:00:00','Fase de Grupos','E',NULL,NULL,0,'2026-06-05 17:00:49'),(29,'Equador','Alemanha','🇪🇨','🇩🇪','2026-06-25 20:00:00','Fase de Grupos','E',NULL,NULL,0,'2026-06-05 17:00:49'),(30,'Curaçao','Costa do Marfim','🇨🇼','🇨🇮','2026-06-25 20:00:00','Fase de Grupos','E',NULL,NULL,0,'2026-06-05 17:00:49'),(31,'Holanda','Japão','🇳🇱','🇯🇵','2026-06-14 20:00:00','Fase de Grupos','F',NULL,NULL,0,'2026-06-05 17:00:49'),(32,'Suécia','Tunísia','🇸🇪','🇹🇳','2026-06-15 02:00:00','Fase de Grupos','F',NULL,NULL,0,'2026-06-05 17:00:49'),(33,'Holanda','Suécia','🇳🇱','🇸🇪','2026-06-20 17:00:00','Fase de Grupos','F',NULL,NULL,0,'2026-06-05 17:00:49'),(34,'Tunísia','Japão','🇹🇳','🇯🇵','2026-06-21 04:00:00','Fase de Grupos','F',NULL,NULL,0,'2026-06-05 17:00:49'),(35,'Japão','Suécia','🇯🇵','🇸🇪','2026-06-25 23:00:00','Fase de Grupos','F',NULL,NULL,0,'2026-06-05 17:00:49'),(36,'Tunísia','Holanda','🇹🇳','🇳🇱','2026-06-25 23:00:00','Fase de Grupos','F',NULL,NULL,0,'2026-06-05 17:00:49'),(37,'Bélgica','Egito','🇧🇪','🇪🇬','2026-06-15 22:00:00','Fase de Grupos','G',NULL,NULL,0,'2026-06-05 17:00:49'),(38,'Irã','Nova Zelândia','🇮🇷','🇳🇿','2026-06-16 04:00:00','Fase de Grupos','G',NULL,NULL,0,'2026-06-05 17:00:49'),(39,'Bélgica','Irã','🇧🇪','🇮🇷','2026-06-21 19:00:00','Fase de Grupos','G',NULL,NULL,0,'2026-06-05 17:00:49'),(40,'Nova Zelândia','Egito','🇳🇿','🇪🇬','2026-06-22 01:00:00','Fase de Grupos','G',NULL,NULL,0,'2026-06-05 17:00:49'),(41,'Egito','Irã','🇪🇬','🇮🇷','2026-06-27 03:00:00','Fase de Grupos','G',NULL,NULL,0,'2026-06-05 17:00:49'),(42,'Nova Zelândia','Bélgica','🇳🇿','🇧🇪','2026-06-27 03:00:00','Fase de Grupos','G',NULL,NULL,0,'2026-06-05 17:00:49'),(43,'Espanha','Cabo Verde','🇪🇸','🇨🇻','2026-06-15 17:00:00','Fase de Grupos','H',NULL,NULL,0,'2026-06-05 17:00:49'),(44,'Arábia Saudita','Uruguai','🇸🇦','🇺🇾','2026-06-15 22:00:00','Fase de Grupos','H',NULL,NULL,0,'2026-06-05 17:00:49'),(45,'Espanha','Arábia Saudita','🇪🇸','🇸🇦','2026-06-21 16:00:00','Fase de Grupos','H',NULL,NULL,0,'2026-06-05 17:00:49'),(46,'Uruguai','Cabo Verde','🇺🇾','🇨🇻','2026-06-21 22:00:00','Fase de Grupos','H',NULL,NULL,0,'2026-06-05 17:00:49'),(47,'Cabo Verde','Arábia Saudita','🇨🇻','🇸🇦','2026-06-27 00:00:00','Fase de Grupos','H',NULL,NULL,0,'2026-06-05 17:00:49'),(48,'Uruguai','Espanha','🇺🇾','🇪🇸','2026-06-27 00:00:00','Fase de Grupos','H',NULL,NULL,0,'2026-06-05 17:00:49'),(49,'França','Senegal','🇫🇷','🇸🇳','2026-06-16 19:00:00','Fase de Grupos','I',NULL,NULL,0,'2026-06-05 17:00:49'),(50,'Iraque','Noruega','🇮🇶','🇳🇴','2026-06-16 22:00:00','Fase de Grupos','I',NULL,NULL,0,'2026-06-05 17:00:49'),(51,'França','Iraque','🇫🇷','🇮🇶','2026-06-22 21:00:00','Fase de Grupos','I',NULL,NULL,0,'2026-06-05 17:00:49'),(52,'Noruega','Senegal','🇳🇴','🇸🇳','2026-06-23 00:00:00','Fase de Grupos','I',NULL,NULL,0,'2026-06-05 17:00:49'),(53,'Noruega','França','🇳🇴','🇫🇷','2026-06-26 19:00:00','Fase de Grupos','I',NULL,NULL,0,'2026-06-05 17:00:49'),(54,'Senegal','Iraque','🇸🇳','🇮🇶','2026-06-26 19:00:00','Fase de Grupos','I',NULL,NULL,0,'2026-06-05 17:00:49'),(55,'Argentina','Argélia','🇦🇷','🇩🇿','2026-06-17 01:00:00','Fase de Grupos','J',NULL,NULL,0,'2026-06-05 17:00:49'),(56,'Áustria','Jordânia','🇦🇹','🇯🇴','2026-06-17 04:00:00','Fase de Grupos','J',NULL,NULL,0,'2026-06-05 17:00:49'),(57,'Argentina','Áustria','🇦🇷','🇦🇹','2026-06-22 17:00:00','Fase de Grupos','J',NULL,NULL,0,'2026-06-05 17:00:49'),(58,'Jordânia','Argélia','🇯🇴','🇩🇿','2026-06-23 03:00:00','Fase de Grupos','J',NULL,NULL,0,'2026-06-05 17:00:49'),(59,'Argélia','Áustria','🇩🇿','🇦🇹','2026-06-28 02:00:00','Fase de Grupos','J',NULL,NULL,0,'2026-06-05 17:00:49'),(60,'Jordânia','Argentina','🇯🇴','🇦🇷','2026-06-28 02:00:00','Fase de Grupos','J',NULL,NULL,0,'2026-06-05 17:00:49'),(61,'Portugal','Congo (RD)','🇵🇹','🇨🇩','2026-06-17 17:00:00','Fase de Grupos','K',NULL,NULL,0,'2026-06-05 17:00:49'),(62,'Uzbequistão','Colômbia','🇺🇿','🇨🇴','2026-06-18 02:00:00','Fase de Grupos','K',NULL,NULL,0,'2026-06-05 17:00:49'),(63,'Portugal','Uzbequistão','🇵🇹','🇺🇿','2026-06-23 17:00:00','Fase de Grupos','K',NULL,NULL,0,'2026-06-05 17:00:49'),(64,'Colômbia','Congo (RD)','🇨🇴','🇨🇩','2026-06-24 02:00:00','Fase de Grupos','K',NULL,NULL,0,'2026-06-05 17:00:49'),(65,'Colômbia','Portugal','🇨🇴','🇵🇹','2026-06-27 23:30:00','Fase de Grupos','K',NULL,NULL,0,'2026-06-05 17:00:49'),(66,'Congo (RD)','Uzbequistão','🇨🇩','🇺🇿','2026-06-27 23:30:00','Fase de Grupos','K',NULL,NULL,0,'2026-06-05 17:00:49'),(67,'Inglaterra','Croácia','🏴󠁧󠁢󠁥󠁮󠁧󠁿','🇭🇷','2026-06-17 20:00:00','Fase de Grupos','L',NULL,NULL,0,'2026-06-05 17:00:49'),(68,'Gana','Panamá','🇬🇭','🇵🇦','2026-06-17 23:00:00','Fase de Grupos','L',NULL,NULL,0,'2026-06-05 17:00:49'),(69,'Inglaterra','Gana','🏴󠁧󠁢󠁥󠁮󠁧󠁿','🇬🇭','2026-06-23 20:00:00','Fase de Grupos','L',NULL,NULL,0,'2026-06-05 17:00:49'),(70,'Panamá','Croácia','🇵🇦','🇭🇷','2026-06-23 23:00:00','Fase de Grupos','L',NULL,NULL,0,'2026-06-05 17:00:49'),(71,'Panamá','Inglaterra','🇵🇦','🏴󠁧󠁢󠁥󠁮󠁧󠁿','2026-06-27 21:00:00','Fase de Grupos','L',NULL,NULL,0,'2026-06-05 17:00:49'),(72,'Croácia','Gana','🇭🇷','🇬🇭','2026-06-27 21:00:00','Fase de Grupos','L',NULL,NULL,0,'2026-06-05 17:00:49');
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participants`
--

DROP TABLE IF EXISTS `participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participants`
--

LOCK TABLES `participants` WRITE;
/*!40000 ALTER TABLE `participants` DISABLE KEYS */;
INSERT INTO `participants` VALUES (3,'Marcelo','muxu2ijr','2026-06-05 17:11:13'),(4,'Rissi','hsgqlqdu','2026-06-05 17:11:16'),(5,'Ricardo','8smok2rx','2026-06-05 17:11:20');
/*!40000 ALTER TABLE `participants` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-05 17:12:42
