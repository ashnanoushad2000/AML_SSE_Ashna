CREATE DATABASE  IF NOT EXISTS `inventory_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `inventory_db`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: inventory_db
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `branch_id` char(36) NOT NULL DEFAULT (uuid()),
  `branch_name` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`branch_id`),
  CONSTRAINT `chk_branch_email` CHECK (regexp_like(`email`,_utf8mb4'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$')),
  CONSTRAINT `chk_branch_phone` CHECK (regexp_like(`phone`,_utf8mb4'^+?[0-9-s()]{8,20}$'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES ('4bc4f01c-ad5c-11ef-8422-a0afbd3a6924','Hogwarts Library','Hogwarts School of Witchcraft and Wizardry','555-1001','library@hogwarts.edu'),('4bc4fa94-ad5c-11ef-8422-a0afbd3a6924','Rivendell Archives','The Last Homely House East of the Sea','555-1002','archives@rivendell.me'),('4bc4fd0e-ad5c-11ef-8422-a0afbd3a6924','Jedi Temple Library','Jedi Temple, Coruscant','555-1003','archives@jedi.org');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `inventory_id` char(36) NOT NULL DEFAULT (uuid()),
  `media_id` char(36) NOT NULL,
  `branch_id` char(36) NOT NULL,
  `total_copies` int NOT NULL DEFAULT '0',
  `available_copies` int NOT NULL DEFAULT '0',
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`inventory_id`),
  UNIQUE KEY `unique_media_branch` (`media_id`,`branch_id`),
  KEY `branch_id` (`branch_id`),
  KEY `idx_inventory_availability` (`available_copies`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`),
  CONSTRAINT `chk_copies` CHECK ((`available_copies` <= `total_copies`)),
  CONSTRAINT `chk_total_copies` CHECK ((`total_copies` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES ('4bc74eee-ad5c-11ef-8422-a0afbd3a6924','4bc2775c-ad5c-11ef-8422-a0afbd3a6924','4bc4f01c-ad5c-11ef-8422-a0afbd3a6924',3,2,'2024-11-16 10:40:32'),('4bc757a0-ad5c-11ef-8422-a0afbd3a6924','4bc2a900-ad5c-11ef-8422-a0afbd3a6924','4bc4f01c-ad5c-11ef-8422-a0afbd3a6924',2,1,'2024-11-16 10:40:32'),('4bc75a0d-ad5c-11ef-8422-a0afbd3a6924','4bc2adfe-ad5c-11ef-8422-a0afbd3a6924','4bc4fa94-ad5c-11ef-8422-a0afbd3a6924',2,1,'2024-11-16 10:40:32'),('4bc75bf3-ad5c-11ef-8422-a0afbd3a6924','4bc2b1b0-ad5c-11ef-8422-a0afbd3a6924','4bc4fd0e-ad5c-11ef-8422-a0afbd3a6924',4,3,'2024-11-16 10:40:32'),('4bc75e18-ad5c-11ef-8422-a0afbd3a6924','4bc2b597-ad5c-11ef-8422-a0afbd3a6924','4bc4fd0e-ad5c-11ef-8422-a0afbd3a6924',2,2,'2024-11-16 10:40:32'),('4bc75fbc-ad5c-11ef-8422-a0afbd3a6924','4bc2b91e-ad5c-11ef-8422-a0afbd3a6924','4bc4f01c-ad5c-11ef-8422-a0afbd3a6924',5,4,'2024-11-16 10:40:32');
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_transfers`
--

DROP TABLE IF EXISTS `inventory_transfers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_transfers` (
  `transfer_id` char(36) NOT NULL DEFAULT (uuid()),
  `source_branch_id` char(36) DEFAULT NULL,
  `destination_branch_id` char(36) DEFAULT NULL,
  `media_id` char(36) DEFAULT NULL,
  `quantity` int NOT NULL,
  `reason` text,
  `status` enum('PENDING','IN_TRANSIT','COMPLETED','CANCELLED') DEFAULT NULL,
  `initiated_by` char(36) DEFAULT NULL,
  `initiated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`transfer_id`),
  KEY `source_branch_id` (`source_branch_id`),
  KEY `destination_branch_id` (`destination_branch_id`),
  KEY `idx_transfers_status` (`status`),
  CONSTRAINT `inventory_transfers_ibfk_1` FOREIGN KEY (`source_branch_id`) REFERENCES `branches` (`branch_id`),
  CONSTRAINT `inventory_transfers_ibfk_2` FOREIGN KEY (`destination_branch_id`) REFERENCES `branches` (`branch_id`),
  CONSTRAINT `chk_different_branches` CHECK ((`source_branch_id` <> `destination_branch_id`)),
  CONSTRAINT `chk_quantity` CHECK ((`quantity` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transfers`
--

LOCK TABLES `inventory_transfers` WRITE;
/*!40000 ALTER TABLE `inventory_transfers` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_transfers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-19  2:24:50
CREATE DATABASE  IF NOT EXISTS `loan_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `loan_db`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: loan_db
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alembic_version`
--

DROP TABLE IF EXISTS `alembic_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alembic_version` (
  `version_num` varchar(32) NOT NULL,
  PRIMARY KEY (`version_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alembic_version`
--

LOCK TABLES `alembic_version` WRITE;
/*!40000 ALTER TABLE `alembic_version` DISABLE KEYS */;
INSERT INTO `alembic_version` VALUES ('cc55a3118624');
/*!40000 ALTER TABLE `alembic_version` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holds`
--

DROP TABLE IF EXISTS `holds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holds` (
  `hold_id` char(36) NOT NULL DEFAULT (uuid()),
  `user_id` char(36) NOT NULL,
  `media_id` char(36) NOT NULL,
  `request_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('PENDING','READY','CANCELLED','FULFILLED') NOT NULL DEFAULT 'PENDING',
  `notification_sent` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`hold_id`),
  KEY `idx_holds_user` (`user_id`),
  KEY `idx_holds_media` (`media_id`),
  KEY `idx_holds_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holds`
--

LOCK TABLES `holds` WRITE;
/*!40000 ALTER TABLE `holds` DISABLE KEYS */;
INSERT INTO `holds` VALUES ('2b70f4fd-5d42-4151-af7c-175bf23857b6','4bbc5ad5-ad5c-11ef-8422-a0afbd3a6924','4bc2a900-ad5c-11ef-8422-a0afbd3a6924','2024-12-19 02:20:59','PENDING',0),('3c4f6032-4c51-47bc-a537-2475c3d01416','2aa6c3ca-6a71-462a-acc6-691c9f8f8d9f','4bc2a900-ad5c-11ef-8422-a0afbd3a6924','2024-12-18 14:48:09','PENDING',0),('643a6d3e-bc6b-11ef-ae87-a0afbd3a6924','2aa6c3ca-6a71-462a-acc6-691c9f8f8d9f','4bc2b597-ad5c-11ef-8422-a0afbd3a6924','2024-12-17 11:38:10','PENDING',0),('d4dbafc3-bb24-11ef-ae87-a0afbd3a6924','2aa6c3ca-6a71-462a-acc6-691c9f8f8d9f','4bc2adfe-ad5c-11ef-8422-a0afbd3a6924','2024-12-15 20:40:33','PENDING',0),('d4dbd9ae-bb24-11ef-ae87-a0afbd3a6924','2aa6c3ca-6a71-462a-acc6-691c9f8f8d9f','4bc2b1b0-ad5c-11ef-8422-a0afbd3a6924','2024-12-13 20:40:33','PENDING',0);
/*!40000 ALTER TABLE `holds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loans`
--

DROP TABLE IF EXISTS `loans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loans` (
  `loan_id` char(36) NOT NULL DEFAULT (uuid()),
  `user_id` char(36) NOT NULL,
  `media_id` char(36) NOT NULL,
  `issue_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `due_date` timestamp NOT NULL,
  `return_date` timestamp NULL DEFAULT NULL,
  `status` enum('ACTIVE','RETURNED','OVERDUE') NOT NULL DEFAULT 'ACTIVE',
  `renewals_count` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`loan_id`),
  KEY `idx_loans_user` (`user_id`),
  KEY `idx_loans_media` (`media_id`),
  KEY `idx_loans_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loans`
--

LOCK TABLES `loans` WRITE;
/*!40000 ALTER TABLE `loans` DISABLE KEYS */;
INSERT INTO `loans` VALUES ('6431d4bb-bc6b-11ef-ae87-a0afbd3a6924','2aa6c3ca-6a71-462a-acc6-691c9f8f8d9f','4bc2b597-ad5c-11ef-8422-a0afbd3a6924','2024-12-17 11:38:10','2024-12-31 11:38:10',NULL,'ACTIVE',0),('d4dabc88-bb24-11ef-ae87-a0afbd3a6924','2aa6c3ca-6a71-462a-acc6-691c9f8f8d9f','4bc2775c-ad5c-11ef-8422-a0afbd3a6924','2024-12-15 20:40:33','2024-12-29 20:40:33',NULL,'ACTIVE',0),('d4dacab1-bb24-11ef-ae87-a0afbd3a6924','2aa6c3ca-6a71-462a-acc6-691c9f8f8d9f','4bc2a900-ad5c-11ef-8422-a0afbd3a6924','2024-12-08 20:40:33','2025-01-01 20:40:33',NULL,'ACTIVE',1);
/*!40000 ALTER TABLE `loans` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-19  2:24:50
CREATE DATABASE  IF NOT EXISTS `payment_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `payment_db`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: payment_db
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `deadlines`
--

DROP TABLE IF EXISTS `deadlines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deadlines` (
  `deadline_id` char(36) NOT NULL DEFAULT (uuid()),
  `user_id` char(36) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `due_date` date NOT NULL,
  `category` enum('Fees','Fines','Subscriptions') NOT NULL,
  PRIMARY KEY (`deadline_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `deadlines_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deadlines`
--

LOCK TABLES `deadlines` WRITE;
/*!40000 ALTER TABLE `deadlines` DISABLE KEYS */;
INSERT INTO `deadlines` VALUES ('a83f1c2b-bdab-11ef-8853-00ff12fc65ba','2aa6c3ca-6a71-462a-acc6-691c9f8f8d9f','Library Book 1','2024-12-20','Fines'),('a83f22aa-bdab-11ef-8853-00ff12fc65ba','2aa6c3ca-6a71-462a-acc6-691c9f8f8d9f','Library Book 2','2025-01-10','Fines'),('a83f23f3-bdab-11ef-8853-00ff12fc65ba','2aa6c3ca-6a71-462a-acc6-691c9f8f8d9f','Annual Membership','2025-01-30','Subscriptions');
/*!40000 ALTER TABLE `deadlines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` char(36) NOT NULL DEFAULT (uuid()),
  `user_id` char(36) NOT NULL,
  `category` enum('Fees','Fines','Subscriptions') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('Pending','Completed','Failed') DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES ('7116c2e0-bdab-11ef-8853-00ff12fc65ba','2aa6c3ca-6a71-462a-acc6-691c9f8f8d9f','Fees',50.00,'Completed','2024-12-19 01:49:10','2024-12-19 01:49:10'),('7116ee22-bdab-11ef-8853-00ff12fc65ba','2aa6c3ca-6a71-462a-acc6-691c9f8f8d9f','Fines',10.00,'Pending','2024-12-19 01:49:10','2024-12-19 01:49:10'),('7116efb7-bdab-11ef-8853-00ff12fc65ba','2aa6c3ca-6a71-462a-acc6-691c9f8f8d9f','Subscriptions',25.00,'Completed','2024-12-19 01:49:10','2024-12-19 01:49:10');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transaction_id` char(36) NOT NULL DEFAULT (uuid()),
  `payment_id` char(36) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('Card','Bank Transfer','Cash') NOT NULL,
  `status` enum('Success','Failed') DEFAULT 'Failed',
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
  KEY `payment_id` (`payment_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`payment_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES ('0c832422-bdac-11ef-8853-00ff12fc65ba','7116ee22-bdab-11ef-8853-00ff12fc65ba',50.00,'Card','Success','2024-12-19 01:53:31'),('0c832d49-bdac-11ef-8853-00ff12fc65ba','7116ee22-bdab-11ef-8853-00ff12fc65ba',10.00,'Bank Transfer','Failed','2024-12-19 01:53:31'),('0c832efb-bdac-11ef-8853-00ff12fc65ba','7116efb7-bdab-11ef-8853-00ff12fc65ba',25.00,'Cash','Success','2024-12-19 01:53:31');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-19  2:24:51
CREATE DATABASE  IF NOT EXISTS `media_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `media_db`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: media_db
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `type` varchar(50) NOT NULL,
  `isbn` varchar(13) DEFAULT NULL,
  `author` varchar(200) DEFAULT NULL,
  `publisher` varchar(200) DEFAULT NULL,
  `publication_year` int DEFAULT NULL,
  `description` text,
  `location` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `isbn` (`isbn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_categories`
--

DROP TABLE IF EXISTS `media_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_categories` (
  `category_id` char(36) NOT NULL DEFAULT (uuid()),
  `category_name` varchar(50) NOT NULL,
  `category_description` text,
  PRIMARY KEY (`category_id`),
  CONSTRAINT `chk_category_name` CHECK ((length(trim(`category_name`)) > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_categories`
--

LOCK TABLES `media_categories` WRITE;
/*!40000 ALTER TABLE `media_categories` DISABLE KEYS */;
INSERT INTO `media_categories` VALUES ('4bbfd4e7-ad5c-11ef-8422-a0afbd3a6924','Fantasy','Fantasy literature and magical texts'),('4bbff9e3-ad5c-11ef-8422-a0afbd3a6924','Science Fiction','Scientific and futuristic literature'),('4bbffc54-ad5c-11ef-8422-a0afbd3a6924','Historical','Historical documents and chronicles'),('4bbffd8a-ad5c-11ef-8422-a0afbd3a6924','Reference','Reference materials and guides');
/*!40000 ALTER TABLE `media_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_items`
--

DROP TABLE IF EXISTS `media_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_items` (
  `media_id` char(36) NOT NULL DEFAULT (uuid()),
  `title` varchar(255) NOT NULL,
  `author` varchar(100) DEFAULT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `category_id` char(36) DEFAULT NULL,
  `publication_date` date DEFAULT NULL,
  `publisher` varchar(100) DEFAULT NULL,
  `item_description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`media_id`),
  KEY `category_id` (`category_id`),
  KEY `idx_media_items_isbn` (`isbn`),
  KEY `idx_media_items_title` (`title`),
  KEY `idx_media_items_author` (`author`),
  CONSTRAINT `media_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `media_categories` (`category_id`),
  CONSTRAINT `chk_isbn` CHECK (regexp_like(`isbn`,_utf8mb4'^[0-9-]{10,17}$')),
  CONSTRAINT `chk_title` CHECK ((length(trim(`title`)) > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_items`
--

LOCK TABLES `media_items` WRITE;
/*!40000 ALTER TABLE `media_items` DISABLE KEYS */;
INSERT INTO `media_items` VALUES ('4bc2775c-ad5c-11ef-8422-a0afbd3a6924','Fantastic Beasts and Where to Find Them','Newt Scamander',NULL,'4bbfd4e7-ad5c-11ef-8422-a0afbd3a6924','1927-03-15','Obscurus Books','A guide to magical creatures','2024-11-28 07:42:19','2024-11-28 07:42:19'),('4bc2a900-ad5c-11ef-8422-a0afbd3a6924','The History of Magic','Bathilda Bagshot',NULL,'4bbfd4e7-ad5c-11ef-8422-a0afbd3a6924','1947-06-20','Flourish & Blotts','Comprehensive magical history','2024-11-28 07:42:19','2024-11-28 07:42:19'),('4bc2adfe-ad5c-11ef-8422-a0afbd3a6924','The Red Book of Westmarch','Bilbo Baggins',NULL,'4bbfd4e7-ad5c-11ef-8422-a0afbd3a6924','1350-09-22','Middle Earth Press','Historical account of the War of the Ring','2024-11-28 07:42:19','2024-11-28 07:42:19'),('4bc2b1b0-ad5c-11ef-8422-a0afbd3a6924','The Jedi Path','Various Masters',NULL,'4bbff9e3-ad5c-11ef-8422-a0afbd3a6924','3999-01-01','Jedi Council','Manual for Jedi training','2024-11-28 07:42:19','2024-11-28 07:42:19'),('4bc2b597-ad5c-11ef-8422-a0afbd3a6924','Hyperdrive Mechanics','Han Solo',NULL,'4bbff9e3-ad5c-11ef-8422-a0afbd3a6924','3980-05-15','Coruscant Tech','Guide to spacecraft engineering','2024-11-28 07:42:19','2024-11-28 07:42:19'),('4bc2b91e-ad5c-11ef-8422-a0afbd3a6924','Hogwarts: A History','Unknown',NULL,'4bbffd8a-ad5c-11ef-8422-a0afbd3a6924','1900-01-01','Hogwarts Press','The definitive history of Hogwarts','2024-11-28 07:42:19','2024-11-28 07:42:19');
/*!40000 ALTER TABLE `media_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-19  2:24:51
CREATE DATABASE  IF NOT EXISTS `auth_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `auth_db`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: auth_db
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` char(36) NOT NULL DEFAULT (uuid()),
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `date_of_birth` date NOT NULL,
  `address` text NOT NULL,
  `post_code` varchar(10) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `user_type` enum('MEMBER','LIBRARIAN','ADMIN','MANAGER') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_user_type` (`user_type`),
  CONSTRAINT `chk_email` CHECK (regexp_like(`email`,_utf8mb4'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$')),
  CONSTRAINT `chk_phone` CHECK (regexp_like(`phone`,_utf8mb4'^+?[0-9-s()]{8,20}$'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('163cd46f-1b1c-484a-987b-4925a96fec76','unchained@gmail.com','scrypt:32768:8:1$2d89nvp9CDsYPZSV$45e930ab4ea2c3c92444a26500f74f414ca1e61731e5b6f461ca1ac6b9a98224f26c345347beebc93b2a7d6cf15c1875ee32b4477b43264734a4716649db5eec','django','freeman','1969-07-04','pnra 147, chambady road','682826',NULL,'MEMBER','2024-12-17 23:50:23','2024-12-17 23:50:23'),('2aa6c3ca-6a71-462a-acc6-691c9f8f8d9f','jleo2996@gmail.com','scrypt:32768:8:1$VLTnI8anBv7WejGl$aa94a105ab86beb5fc86ebf3335df8040039b4536220764b8e40f9474ab5320442d15bcd0e533bf8a67f26234b55081cbd808160e31af28585830c4c2626c3cf','Joel','Leo','1996-09-29','Flat 1, 98 London Road','LE2 0QS','07867071942','MEMBER','2024-12-15 14:19:04','2024-12-18 16:49:33'),('4bb78b01-ad5c-11ef-8422-a0afbd3a6924','mcgonagall@hogwarts.edu','hash123','Minerva','McGonagall','1935-10-04','Hogwarts School of Witchcraft and Wizardry',NULL,'555-0001','ADMIN','2024-11-16 10:40:32','2024-11-16 10:40:32'),('4bbc2248-ad5c-11ef-8422-a0afbd3a6924','pince@hogwarts.edu','hash124','Irma','Pince','1944-05-15','Hogwarts Library',NULL,'555-0002','LIBRARIAN','2024-11-16 10:40:32','2024-11-16 10:40:32'),('4bbc4a19-ad5c-11ef-8422-a0afbd3a6924','elrond@rivendell.me','hash125','Elrond','Half-elven','1932-03-21','The Last Homely House, Rivendell',NULL,'555-0003','LIBRARIAN','2024-11-16 10:40:32','2024-11-16 10:40:32'),('4bbc516a-ad5c-11ef-8422-a0afbd3a6924','jocasta@jedi.org','hash126','Jocasta','Nu','1955-08-30','Jedi Temple Archives, Coruscant',NULL,'555-0004','LIBRARIAN','2024-11-16 10:40:32','2024-11-16 10:40:32'),('4bbc558a-ad5c-11ef-8422-a0afbd3a6924','harry@hogwarts.edu','hash127','Harry','Potter','1980-07-31','4 Privet Drive, Surrey',NULL,'555-0005','MEMBER','2024-11-16 10:40:32','2024-11-16 10:40:32'),('4bbc589d-ad5c-11ef-8422-a0afbd3a6924','hermione@hogwarts.edu','scrypt:32768:8:1$NTIn77YCWSudAQ7Z$1938d0e3fc9710e78d4f902c6845b02cdb2b98dc7db01d787122dd7c4c3819df6868b91d26f396f7f5868bf13d83825503c5d3976666ea1b1970bd6edf2b3434','Hermione','Granger','1979-09-19','12 Grimmauld Place, London',NULL,'555-0006','MEMBER','2024-11-16 10:40:32','2024-12-18 18:00:59'),('4bbc5ad5-ad5c-11ef-8422-a0afbd3a6924','frodo@shire.me','hash1','Frodo','Baggins','1968-09-22','Bag End, Bagshot Row, Hobbiton',NULL,'555-0007','MEMBER','2024-11-16 10:40:32','2024-12-19 02:19:47'),('4bbc7d0e-ad5c-11ef-8422-a0afbd3a6924','luke@rebellion.org','hash130','Luke','Skywalker','1955-12-07','Skywalker Ranch, Tatooine',NULL,'555-0008','MEMBER','2024-11-16 10:40:32','2024-11-16 10:40:32'),('6827c13d-2566-459b-8a71-fefb17addadb','ryanleo@gmail.com','scrypt:32768:8:1$GKaHQuQgCa6Wx6Jx$2de195565e714cd19d30fb5c54abc5efc5f727ffa8cd0187c4095d6283260ce336d47e77d19a0ebcc19846f3913125a19d04cc28880bb4b6902250d4c6242f02','ryan','leo','2004-07-04','shanthi nivas perandoor','LE2 0QW',NULL,'MEMBER','2024-12-18 00:24:20','2024-12-18 00:24:20'),('ba271404-8610-4a14-b6b4-abd55008f8d5','evinantony@gmail.com','scrypt:32768:8:1$yvYjxZLw8ZuKbc4T$a6a1be5254b9f46d100b33f0a1acef46b34e8168317f3d34da1227632f550750f3c3c7fb26ee6b78e3c5df940936038fca89e981e3ede5249a03331a6d034da8','evin','antony','1988-02-09','rajagiri hss, kalamassery','LE2 0QS',NULL,'MEMBER','2024-12-18 00:04:53','2024-12-18 00:04:53'),('e7786ba2-d2db-4772-9e08-dfb4e3233f36','neltom@gmail.com','scrypt:32768:8:1$lcZM1m29miN4F1K1$c3dcba86510ee57c7d66f29abdb71e5a600ada6412cb742cd8cdea1d8a03ffc6bb72bfad80f8dd352b9c236594ab1a11048dce019247bac1ac69f4a6b0d3e474','nelson','thomas','1996-02-29','hgluh;ioij','LE2 0QS',NULL,'MEMBER','2024-12-18 21:29:18','2024-12-18 21:29:18');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-19  2:24:51
