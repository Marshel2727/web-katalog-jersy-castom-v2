-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: web-katalog-jersy
-- ------------------------------------------------------
-- Server version	8.4.3

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
-- Current Database: `web-katalog-jersy`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `web-katalog-jersy` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `web-katalog-jersy`;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`),
  KEY `categories_is_active_sort_order_index` (`is_active`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Sepak bola','sepak-bola',1,0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(2,'Futsal','futsal',1,1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(3,'Basket','basket',1,2,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(4,'Badminton','badminton',1,3,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(5,'Jersey','jersey',1,4,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(6,'Kaos','kaos',1,5,'2026-09-30 07:53:16','2026-09-30 07:53:16');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collars`
--

DROP TABLE IF EXISTS `collars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collars` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `number` int unsigned NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_path` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price_label` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_image_path` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `collars_slug_unique` (`slug`),
  UNIQUE KEY `collars_number_unique` (`number`),
  KEY `collars_is_active_sort_order_index` (`is_active`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collars`
--

LOCK TABLES `collars` WRITE;
/*!40000 ALTER TABLE `collars` DISABLE KEYS */;
INSERT INTO `collars` VALUES (1,'kerah-01',1,'Kerah Model 01','seed/images/bahan-kerah/kerah/kerah-01.webp','Bentuk kerah model 01','FREE','seed/images/bahan-kerah/originals/kerah-2.png',1,0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(2,'kerah-02',2,'Kerah Model 02','seed/images/bahan-kerah/kerah/kerah-02.webp','Bentuk kerah model 02','FREE','seed/images/bahan-kerah/originals/kerah-2.png',1,1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(3,'kerah-03',3,'Kerah Model 03','seed/images/bahan-kerah/kerah/kerah-03.webp','Bentuk kerah model 03','FREE','seed/images/bahan-kerah/originals/kerah-2.png',1,2,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(4,'kerah-04',4,'Kerah Model 04','seed/images/bahan-kerah/kerah/kerah-04.webp','Bentuk kerah model 04','FREE','seed/images/bahan-kerah/originals/kerah-2.png',1,3,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(5,'kerah-05',5,'Kerah Model 05','seed/images/bahan-kerah/kerah/kerah-05.webp','Bentuk kerah model 05','FREE','seed/images/bahan-kerah/originals/kerah-2.png',1,4,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(6,'kerah-06',6,'Kerah Model 06','seed/images/bahan-kerah/kerah/kerah-06.webp','Bentuk kerah model 06','FREE','seed/images/bahan-kerah/originals/kerah-2.png',1,5,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(7,'kerah-07',7,'Kerah Model 07','seed/images/bahan-kerah/kerah/kerah-07.webp','Bentuk kerah model 07','+5K','seed/images/bahan-kerah/originals/kerah-3.png',1,6,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(8,'kerah-08',8,'Kerah Model 08','seed/images/bahan-kerah/kerah/kerah-08.webp','Bentuk kerah model 08','+5K','seed/images/bahan-kerah/originals/kerah-3.png',1,7,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(9,'kerah-09',9,'Kerah Model 09','seed/images/bahan-kerah/kerah/kerah-09.webp','Bentuk kerah model 09','+5K','seed/images/bahan-kerah/originals/kerah-3.png',1,8,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(10,'kerah-10',10,'Kerah Model 10','seed/images/bahan-kerah/kerah/kerah-10.webp','Bentuk kerah model 10','+5K','seed/images/bahan-kerah/originals/kerah-3.png',1,9,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(11,'kerah-11',11,'Kerah Model 11','seed/images/bahan-kerah/kerah/kerah-11.webp','Bentuk kerah model 11','+5K','seed/images/bahan-kerah/originals/kerah-3.png',1,10,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(12,'kerah-12',12,'Kerah Model 12','seed/images/bahan-kerah/kerah/kerah-12.webp','Bentuk kerah model 12','+10K','seed/images/bahan-kerah/originals/kerah-1.png',1,11,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(13,'kerah-13',13,'Kerah Model 13','seed/images/bahan-kerah/kerah/kerah-13.webp','Bentuk kerah model 13','+10K','seed/images/bahan-kerah/originals/kerah-1.png',1,12,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(14,'kerah-14',14,'Kerah Model 14','seed/images/bahan-kerah/kerah/kerah-14.webp','Bentuk kerah model 14','+15K','seed/images/bahan-kerah/originals/kerah-1.png',1,13,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(15,'kerah-15',15,'Kerah Model 15','seed/images/bahan-kerah/kerah/kerah-15.webp','Bentuk kerah model 15','+15K','seed/images/bahan-kerah/originals/kerah-1.png',1,14,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(16,'kerah-16',16,'Kerah Model 16','seed/images/bahan-kerah/kerah/kerah-16.webp','Bentuk kerah model 16','+20K','seed/images/bahan-kerah/originals/kerah-4.png',1,15,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(17,'kerah-17',17,'Kerah Model 17','seed/images/bahan-kerah/kerah/kerah-17.webp','Bentuk kerah model 17','+20K','seed/images/bahan-kerah/originals/kerah-4.png',1,16,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(18,'kerah-18',18,'Kerah Model 18','seed/images/bahan-kerah/kerah/kerah-18.webp','Bentuk kerah model 18','+25K','seed/images/bahan-kerah/originals/kerah-4.png',1,17,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(19,'kerah-19',19,'Kerah Model 19','seed/images/bahan-kerah/kerah/kerah-19.webp','Bentuk kerah model 19','+25K','seed/images/bahan-kerah/originals/kerah-4.png',1,18,'2026-09-30 07:53:16','2026-09-30 07:53:16');
/*!40000 ALTER TABLE `collars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `design_images`
--

DROP TABLE IF EXISTS `design_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `design_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `design_id` bigint unsigned NOT NULL,
  `image_path` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `design_images_design_id_sort_order_index` (`design_id`,`sort_order`),
  CONSTRAINT `design_images_design_id_foreign` FOREIGN KEY (`design_id`) REFERENCES `designs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `design_images`
--

LOCK TABLES `design_images` WRITE;
/*!40000 ALTER TABLE `design_images` DISABLE KEYS */;
INSERT INTO `design_images` VALUES (1,1,'seed/images/katalog/garis-merah-putih/sampul.jpg','Jersey Garis Merah Putih foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(2,1,'seed/images/katalog/garis-merah-putih/detail-1.jpg','Jersey Garis Merah Putih foto 2',1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(3,1,'seed/images/katalog/garis-merah-putih/detail-2.jpg','Jersey Garis Merah Putih foto 3',2,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(4,1,'seed/images/katalog/garis-merah-putih/detail-3.jpg','Jersey Garis Merah Putih foto 4',3,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(5,2,'seed/images/katalog/garis-biru-putih/sampul.jpg','Jersey Garis Biru Putih foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(6,2,'seed/images/katalog/garis-biru-putih/detail-1.jpg','Jersey Garis Biru Putih foto 2',1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(7,2,'seed/images/katalog/garis-biru-putih/detail-2.jpg','Jersey Garis Biru Putih foto 3',2,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(8,2,'seed/images/katalog/garis-biru-putih/detail-3.jpg','Jersey Garis Biru Putih foto 4',3,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(9,3,'seed/images/katalog/ditbinmas-biru/sampul.jpg','Jersey Ditbinmas Biru foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(10,3,'seed/images/katalog/ditbinmas-biru/detail-1.jpg','Jersey Ditbinmas Biru foto 2',1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(11,3,'seed/images/katalog/ditbinmas-biru/detail-2.jpg','Jersey Ditbinmas Biru foto 3',2,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(12,4,'seed/images/katalog/dpd-wi-hijau/sampul.jpg','Jersey DPD WI Hijau foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(13,5,'seed/images/katalog/aldenaire-berkerah/sampul.jpg','Aldenaire Berkerah foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(14,5,'seed/images/katalog/aldenaire-berkerah/detail-1.jpg','Aldenaire Berkerah foto 2',1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(15,5,'seed/images/katalog/aldenaire-berkerah/detail-2.jpg','Aldenaire Berkerah foto 3',2,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(16,6,'seed/images/katalog/aldenaire-tanpa-lengan/sampul.jpg','Aldenaire Tanpa Lengan foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(17,6,'seed/images/katalog/aldenaire-tanpa-lengan/detail-1.jpg','Aldenaire Tanpa Lengan foto 2',1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(18,6,'seed/images/katalog/aldenaire-tanpa-lengan/detail-2.jpg','Aldenaire Tanpa Lengan foto 3',2,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(19,7,'seed/images/katalog/mium-room-marun/sampul.jpg','Mium Room Marun foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(20,7,'seed/images/katalog/mium-room-marun/detail-1.jpg','Mium Room Marun foto 2',1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(21,7,'seed/images/katalog/mium-room-marun/detail-2.jpg','Mium Room Marun foto 3',2,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(22,8,'seed/images/katalog/h-kadang-berkerah/sampul.jpg','H Kadang Berkerah foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(23,8,'seed/images/katalog/h-kadang-berkerah/detail-1.jpg','H Kadang Berkerah foto 2',1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(24,8,'seed/images/katalog/h-kadang-berkerah/detail-2.jpg','H Kadang Berkerah foto 3',2,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(25,8,'seed/images/katalog/h-kadang-berkerah/detail-3.jpg','H Kadang Berkerah foto 4',3,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(26,9,'seed/images/katalog/h-kadang-tanpa-lengan/sampul.jpg','H Kadang Tanpa Lengan foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(27,10,'seed/images/katalog/rpai-biru-putih/sampul.jpg','RPAI Biru Putih foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(28,10,'seed/images/katalog/rpai-biru-putih/detail-1.jpg','RPAI Biru Putih foto 2',1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(29,11,'seed/images/katalog/milkman-motor/sampul.jpg','Milkman Motor foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(30,11,'seed/images/katalog/milkman-motor/detail-1.jpg','Milkman Motor foto 2',1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(31,11,'seed/images/katalog/milkman-motor/detail-2.jpg','Milkman Motor foto 3',2,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(32,12,'seed/images/katalog/nineball-hitam/sampul.jpg','Nineball Hitam foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(33,12,'seed/images/katalog/nineball-hitam/detail-1.jpg','Nineball Hitam foto 2',1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(34,13,'seed/images/katalog/setelan-teal/sampul.jpg','Setelan Teal foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(35,14,'seed/images/katalog/kaos-grafis-hitam/sampul.jpg','Kaos Grafis Hitam foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(36,15,'seed/images/katalog/kaos-atharva/sampul.jpg','Kaos Atharva foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(37,15,'seed/images/katalog/kaos-atharva/detail-1.jpg','Kaos Atharva foto 2',1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(38,16,'seed/images/katalog/kaos-biru-royal/sampul.jpg','Kaos Biru Royal foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(39,16,'seed/images/katalog/kaos-biru-royal/detail-1.jpg','Kaos Biru Royal foto 2',1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(40,17,'seed/images/katalog/kaos-olive/sampul.jpg','Kaos Olive foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(41,17,'seed/images/katalog/kaos-olive/detail-1.jpg','Kaos Olive foto 2',1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(42,18,'seed/images/katalog/grafis-putih-biru/sampul.jpg','Jersey Grafis Putih Biru foto 1',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(43,18,'seed/images/katalog/grafis-putih-biru/detail-1.jpg','Jersey Grafis Putih Biru foto 2',1,'2026-09-30 07:53:16','2026-09-30 07:53:16');
/*!40000 ALTER TABLE `design_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `designs`
--

DROP TABLE IF EXISTS `designs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `designs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL,
  `slug` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `color_label` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `accent_color` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_popular` tinyint(1) NOT NULL DEFAULT '0',
  `is_previous_order` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `designs_slug_unique` (`slug`),
  UNIQUE KEY `designs_code_unique` (`code`),
  KEY `designs_category_id_foreign` (`category_id`),
  KEY `designs_is_active_sort_order_index` (`is_active`,`sort_order`),
  CONSTRAINT `designs_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `designs`
--

LOCK TABLES `designs` WRITE;
/*!40000 ALTER TABLE `designs` DISABLE KEYS */;
INSERT INTO `designs` VALUES (1,5,'garis-merah-putih','BP-001','Jersey Garis Merah Putih','Pola garis vertikal merah dan putih dengan kerah V serta ruang identitas tim.','Merah / Putih','#d34343',1,1,1,0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(2,5,'garis-biru-putih','BP-002','Jersey Garis Biru Putih','Jersey bergaris biru putih dengan nama dan nomor pada bagian belakang.','Biru / Putih','#4068cd',0,1,1,1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(3,5,'ditbinmas-biru','BP-003','Jersey Ditbinmas Biru','Jersey biru dengan aksen emas, motif halus, dan nomor punggung.','Biru / Emas','#474cbe',1,1,1,2,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(4,5,'dpd-wi-hijau','BP-004','Jersey DPD WI Hijau','Jersey hijau gelap dengan panel putih pada bahu dan sisi badan.','Hijau / Putih','#235947',0,1,1,3,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(5,5,'aldenaire-berkerah','BP-005','Aldenaire Berkerah','Model berkerah dengan badan krem, lengan marun, dan motif pada permukaan kain.','Krem / Marun','#75343b',1,1,1,4,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(6,3,'aldenaire-tanpa-lengan','BP-006','Aldenaire Tanpa Lengan','Jersey tanpa lengan dengan tepian marun serta personalisasi nama dan nomor.','Krem / Marun','#75343b',0,1,1,5,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(7,3,'mium-room-marun','BP-007','Mium Room Marun','Jersey tanpa lengan berwarna marun dengan motif geometris pada sisi badan.','Marun / Putih','#713139',0,1,1,6,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(8,5,'h-kadang-berkerah','BP-008','H Kadang Berkerah','Jersey berkerah bermotif hitam dengan tulisan dan aksen pink.','Hitam / Pink','#d83377',0,1,1,7,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(9,3,'h-kadang-tanpa-lengan','BP-009','H Kadang Tanpa Lengan','Model tanpa lengan bermotif hitam dan pink dengan tepian kontras.','Hitam / Pink','#d83377',0,1,1,8,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(10,5,'rpai-biru-putih','BP-010','RPAI Biru Putih','Jersey berkerah dengan motif diagonal biru hitam dan ilustrasi pada bagian belakang.','Putih / Biru / Hitam','#377acb',0,1,1,9,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(11,5,'milkman-motor','BP-011','Milkman Motor','Jersey dengan grafis motor dan perpaduan aksen hijau serta ungu.','Hitam / Hijau / Ungu','#6bba63',1,1,1,10,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(12,5,'nineball-hitam','BP-012','Nineball Hitam','Jersey berkerah berwarna hitam dengan motif abu-abu dan tulisan putih.','Hitam / Abu-abu','#858991',0,1,1,11,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(13,5,'setelan-teal','BP-013','Setelan Teal','Referensi setelan jersey teal berkerah dengan celana putih.','Teal / Putih','#247086',0,1,1,12,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(14,6,'kaos-grafis-hitam','BP-014','Kaos Grafis Hitam','Kaos hitam lengan pendek dengan desain grafis merah dan putih.','Hitam / Merah','#b84745',0,1,1,13,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(15,6,'kaos-atharva','BP-015','Kaos Atharva','Kaos biru muda dengan grafis hitam serta tulisan Atharva pada sisi lainnya.','Biru Muda / Hitam','#9bbde0',0,1,1,14,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(16,6,'kaos-biru-royal','BP-016','Kaos Biru Royal','Kaos biru royal dengan grafis putih pada bagian depan dan belakang.','Biru / Putih','#3263c7',0,1,1,15,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(17,6,'kaos-olive','BP-017','Kaos Olive','Kaos hijau olive dengan tanda kecil di dada dan tulisan pada bagian belakang.','Hijau Olive / Putih','#798454',0,1,1,16,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(18,5,'grafis-putih-biru','BP-018','Jersey Grafis Putih Biru','Contoh produksi jersey putih biru dengan grafis berwarna pada badan.','Putih / Biru','#5d9bcd',0,1,1,17,'2026-09-30 07:53:16','2026-09-30 07:53:16');
/*!40000 ALTER TABLE `designs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_path` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price_label` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_image_path` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `materials_slug_unique` (`slug`),
  KEY `materials_is_active_sort_order_index` (`is_active`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES (1,'milano','Milano','seed/images/bahan-kerah/kain/milano.webp','Tekstur kain Milano','FREE','seed/images/bahan-kerah/originals/kain-1.png',1,0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(2,'rhabit','Rhabit','seed/images/bahan-kerah/kain/rhabit.webp','Tekstur kain Rhabit','FREE','seed/images/bahan-kerah/originals/kain-1.png',1,1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(3,'brazil','Brazil','seed/images/bahan-kerah/kain/brazil.webp','Tekstur kain Brazil','FREE','seed/images/bahan-kerah/originals/kain-1.png',1,2,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(4,'bintik','Bintik','seed/images/bahan-kerah/kain/bintik.webp','Tekstur kain Bintik','FREE','seed/images/bahan-kerah/originals/kain-1.png',1,3,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(5,'benzema','Benzema','seed/images/bahan-kerah/kain/benzema.webp','Tekstur kain Benzema','10K/STEL','seed/images/bahan-kerah/originals/kain-2.png',1,4,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(6,'polymesh','PolyMesh','seed/images/bahan-kerah/kain/polymesh.webp','Tekstur kain PolyMesh','10K/STEL','seed/images/bahan-kerah/originals/kain-2.png',1,5,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(7,'drophiddle','Drophiddle','seed/images/bahan-kerah/kain/drophiddle.webp','Tekstur kain Drophiddle','10K/STEL','seed/images/bahan-kerah/originals/kain-2.png',1,6,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(8,'smash','Smash','seed/images/bahan-kerah/kain/smash.webp','Tekstur kain Smash','10K/STEL','seed/images/bahan-kerah/originals/kain-2.png',1,7,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(9,'airwalk','Airwalk','seed/images/bahan-kerah/kain/airwalk.webp','Tekstur kain Airwalk','10K/STEL','seed/images/bahan-kerah/originals/kain-3.png',1,8,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(10,'embosh-topo','Embosh Topo','seed/images/bahan-kerah/kain/embosh-topo.webp','Tekstur kain Embosh Topo','10K/STEL','seed/images/bahan-kerah/originals/kain-3.png',1,9,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(11,'embosh-mixed','Embosh Mixed','seed/images/bahan-kerah/kain/embosh-mixed.webp','Tekstur kain Embosh Mixed','10K/STEL','seed/images/bahan-kerah/originals/kain-3.png',1,10,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(12,'lotto','Lotto','seed/images/bahan-kerah/kain/lotto.webp','Tekstur kain Lotto','10K/STEL','seed/images/bahan-kerah/originals/kain-3.png',1,11,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(13,'superior','Superior','seed/images/bahan-kerah/kain/superior.webp','Tekstur kain Superior','15K/STEL','seed/images/bahan-kerah/originals/kain-4.png',1,12,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(14,'embosh-sukul-drako','Embosh Sukul Drako','seed/images/bahan-kerah/kain/embosh-sukul-drako.webp','Tekstur kain Embosh Sukul Drako','20K/STEL','seed/images/bahan-kerah/originals/kain-5.png',1,13,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(15,'embosh-sukul-nano','Embosh Sukul Nano','seed/images/bahan-kerah/kain/embosh-sukul-nano.webp','Tekstur kain Embosh Sukul Nano','20K/STEL','seed/images/bahan-kerah/originals/kain-5.png',1,14,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(16,'jacquard-camo','Jacquard Camo','seed/images/bahan-kerah/kain/jacquard-camo.webp','Tekstur kain Jacquard Camo','25K/STEL','seed/images/bahan-kerah/originals/kain-6.png',1,15,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(17,'jacquard-metro','Jacquard Metro','seed/images/bahan-kerah/kain/jacquard-metro.webp','Tekstur kain Jacquard Metro','25K/STEL','seed/images/bahan-kerah/originals/kain-6.png',1,16,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(18,'jacquard-mesh-segitiga','Jacquard Mesh Segitiga','seed/images/bahan-kerah/kain/jacquard-mesh-segitiga.webp','Tekstur kain Jacquard Mesh Segitiga','25K/STEL','seed/images/bahan-kerah/originals/kain-6.png',1,17,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(19,'adidas-ruh','Adidas Ruh','seed/images/bahan-kerah/kain/adidas-ruh.webp','Tekstur kain Adidas Ruh','30K/STEL','seed/images/bahan-kerah/originals/kain-7.png',1,18,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(20,'adidas-leopard','Adidas Leopard','seed/images/bahan-kerah/kain/adidas-leopard.webp','Tekstur kain Adidas Leopard','30K/STEL','seed/images/bahan-kerah/originals/kain-7.png',1,19,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(21,'bp-running','BP Running','seed/images/bahan-kerah/kain/bp-running.webp','Tekstur kain BP Running','30K/STEL','seed/images/bahan-kerah/originals/kain-7.png',1,20,'2026-09-30 07:53:16','2026-09-30 07:53:16');
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_09_30_000000_add_admin_flag_to_users_table',1),(5,'2026_09_30_000001_create_categories_table',1),(6,'2026_09_30_000002_create_designs_table',1),(7,'2026_09_30_000003_create_design_images_table',1),(8,'2026_09_30_000004_create_pricing_packages_table',1),(9,'2026_09_30_000005_create_pricing_options_table',1),(10,'2026_09_30_000006_create_materials_table',1),(11,'2026_09_30_000007_create_collars_table',1),(12,'2026_09_30_000008_create_testimonials_table',1),(13,'2026_09_30_000009_create_site_settings_table',1),(14,'2026_09_30_000010_create_personal_access_tokens_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pricing_options`
--

DROP TABLE IF EXISTS `pricing_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pricing_options` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `pricing_package_id` bigint unsigned NOT NULL,
  `label` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `unit` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pricing_options_pricing_package_id_sort_order_index` (`pricing_package_id`,`sort_order`),
  CONSTRAINT `pricing_options_pricing_package_id_foreign` FOREIGN KEY (`pricing_package_id`) REFERENCES `pricing_packages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pricing_options`
--

LOCK TABLES `pricing_options` WRITE;
/*!40000 ALTER TABLE `pricing_options` DISABLE KEYS */;
INSERT INTO `pricing_options` VALUES (1,1,'Jersey full printing',100000.00,'atasan',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(2,2,'Jersey + celana sablon',125000.00,'setel',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(3,3,'Jersey + celana full printing',140000.00,'setel',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(4,4,'Nama + nomor',75000.00,'setel',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(5,4,'Nama + nomor + sponsor',80000.00,'setel',1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(6,4,'Nama + nomor + sponsor + logo',85000.00,'setel',2,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(7,5,'Nama + nomor',115000.00,'setel',0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(8,5,'Nama + nomor + sponsor',120000.00,'setel',1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(9,5,'Nama + nomor + sponsor + logo',125000.00,'setel',2,'2026-09-30 07:53:16','2026-09-30 07:53:16');
/*!40000 ALTER TABLE `pricing_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pricing_packages`
--

DROP TABLE IF EXISTS `pricing_packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pricing_packages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `condition` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_path` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pricing_packages_slug_unique` (`slug`),
  KEY `pricing_packages_is_active_sort_order_index` (`is_active`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pricing_packages`
--

LOCK TABLES `pricing_packages` WRITE;
/*!40000 ALTER TABLE `pricing_packages` DISABLE KEYS */;
INSERT INTO `pricing_packages` VALUES (1,'atasan-print','printing','Atasan Print','Jersey full printing','Desain bebas · Minimal order 6 pcs','seed/images/paket-harga/atasan-print.webp',1,0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(2,'half-print','printing','Half Print','Jersey full printing + celana sablon DTF/polyflex','Desain bebas · Minimal order 6 pcs','seed/images/paket-harga/half-print.webp',1,1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(3,'full-print','printing','Full Print','Jersey dan celana full printing','Desain bebas · Minimal order 6 pcs','seed/images/paket-harga/full-print.webp',1,2,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(4,'sablon-lokal','screen_print','Setelan Sablon Lokal','Setelan berbahan lokal dengan pilihan kelengkapan sablon.','Harga berlaku untuk pembelian 12 pcs','seed/images/paket-harga/setelan-sablon.webp',1,3,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(5,'sablon-import','screen_print','Setelan Sablon Import','Setelan berbahan import dengan pilihan kelengkapan sablon.','Harga berlaku untuk pembelian 12 pcs','seed/images/paket-harga/setelan-sablon.webp',1,4,'2026-09-30 07:53:16','2026-09-30 07:53:16');
/*!40000 ALTER TABLE `pricing_packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tagline` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `whatsapp` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo_path` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instagram_url` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiktok_url` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES (1,'BP Sport','Spesialis jersey. Kaos custom sesuai desain kamu.','62882020423072','seed/images/bp-sport-logo.png','https://www.instagram.com/bp_sportapparel?stkn=MWgxZHl5aDdkNnB2eA==','https://www.tiktok.com/@bp.sport_?_r=1&_t=ZS-99xgnS2QrPM','2026-09-30 07:53:16','2026-09-30 07:53:16');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonials` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `team` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quote` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `initials` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_example` tinyint(1) NOT NULL DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `testimonials_is_active_sort_order_index` (`is_active`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES (1,'Raka Pratama','Tim futsal komunitas','Dari ide di grup tim sampai jadi jersey yang kita banggakan. Diskusi desainnya gampang dan hasilnya sesuai karakter tim!','RP',1,1,0,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(2,'Nadia Putri','Komunitas badminton','Suka karena bisa eksplor warna dan menambahkan identitas komunitas. Semua anggota jadi punya jersey yang kompak.','NP',1,1,1,'2026-09-30 07:53:16','2026-09-30 07:53:16'),(3,'Dimas Saputra','Klub sepak bola','Referensi di katalog membantu banget. Tinggal pilih gaya yang cocok, lalu diskusikan detail nama dan nomor pemain.','DS',1,1,2,'2026-09-30 07:53:16','2026-09-30 07:53:16');
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'bp sport','bpsport@gmail.com','2026-09-30 07:56:12','$2y$12$1a79dq32Be0mHm7dHqKNruNs6lPlB1Zzer1Yr5/w/VToRr84lq0Ty',NULL,'2026-09-30 07:56:12','2026-09-30 07:56:12',1);
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

-- Dump completed on 2026-10-10  7:05:01
