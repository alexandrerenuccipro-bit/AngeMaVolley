-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 03, 2026 at 11:39 PM
-- Server version: 8.3.0
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `angemavolley`
--

-- --------------------------------------------------------

--
-- Table structure for table `club`
--

DROP TABLE IF EXISTS `club`;
CREATE TABLE IF NOT EXISTS `club` (
  `num_club` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `departement` varchar(100) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `code_postal` varchar(10) DEFAULT NULL,
  `date_creation` date DEFAULT NULL,
  PRIMARY KEY (`num_club`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `club`
--

-- --------------------------------------------------------

--
-- Table structure for table `coach`
--

DROP TABLE IF EXISTS `coach`;
CREATE TABLE IF NOT EXISTS `coach` (
  `num_user` int NOT NULL,
  `diplome` varchar(100) DEFAULT NULL,
  `specialite` varchar(100) DEFAULT NULL,
  `annees_experience` int DEFAULT NULL,
  `num_club` int DEFAULT NULL,
  PRIMARY KEY (`num_user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coach`
--

-- --------------------------------------------------------

--
-- Table structure for table `demande_licence_coach`
--

DROP TABLE IF EXISTS `demande_licence_coach`;
CREATE TABLE IF NOT EXISTS `demande_licence_coach` (
  `num_demande` int NOT NULL AUTO_INCREMENT,
  `num_user` int NOT NULL,
  `statut` enum('en_attente','validee','refusee') NOT NULL DEFAULT 'en_attente',
  `date_demande` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_traitement` datetime DEFAULT NULL,
  `diplome` varchar(100) NOT NULL,
  PRIMARY KEY (`num_demande`),
  KEY `num_user` (`num_user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `demande_licence_joueur`
--

DROP TABLE IF EXISTS `demande_licence_joueur`;
CREATE TABLE IF NOT EXISTS `demande_licence_joueur` (
  `num_demande` int NOT NULL AUTO_INCREMENT,
  `num_user` int NOT NULL,
  `statut` enum('en_attente','validee','refusee') NOT NULL DEFAULT 'en_attente',
  `date_demande` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_traitement` datetime DEFAULT NULL,
  `poids` decimal(5,2) DEFAULT NULL,
  `taille` int DEFAULT NULL,
  PRIMARY KEY (`num_demande`),
  KEY `num_user` (`num_user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `equipe`
--

DROP TABLE IF EXISTS `equipe`;
CREATE TABLE IF NOT EXISTS `equipe` (
  `num_equipe` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `categorie` enum('senior') NOT NULL,
  `num_club` int NOT NULL,
  `num_coach` int DEFAULT NULL,
  `date_creation` date DEFAULT NULL,
  `couleur_maillot` varchar(50) DEFAULT NULL,
  `nb_joueurs_max` int DEFAULT '25',
  PRIMARY KEY (`num_equipe`),
  KEY `num_club` (`num_club`),
  KEY `num_coach` (`num_coach`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `equipe`
--

-- --------------------------------------------------------

--
-- Table structure for table `equipe_licencie`
--

DROP TABLE IF EXISTS `equipe_licencie`;
CREATE TABLE IF NOT EXISTS `equipe_licencie` (
  `num_equipe` int NOT NULL,
  `num_user` int NOT NULL,
  `date_integration` date DEFAULT NULL,
  `numero_maillot` int DEFAULT NULL,
  PRIMARY KEY (`num_equipe`,`num_user`),
  KEY `num_user` (`num_user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `equipe_licencie`
--

-- --------------------------------------------------------

--
-- Table structure for table `evenement`
--

DROP TABLE IF EXISTS `evenement`;
CREATE TABLE IF NOT EXISTS `evenement` (
  `num_evenement` int NOT NULL AUTO_INCREMENT,
  `type` enum('match','tournoi','entrainement','autre') NOT NULL,
  `date_debut` datetime NOT NULL,
  `date_fin` datetime DEFAULT NULL,
  `lieu` varchar(200) DEFAULT NULL,
  `adresse_lieu` varchar(255) DEFAULT NULL,
  `description` text,
  `nb_places_max` int DEFAULT NULL,
  `statut` enum('planifie','en_cours','termine','annule') DEFAULT 'planifie',
  `createur` int DEFAULT NULL,
  PRIMARY KEY (`num_evenement`),
  KEY `createur` (`createur`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `evenement`
--

-- --------------------------------------------------------

--
-- Table structure for table `licence_coach`
--

DROP TABLE IF EXISTS `licence_coach`;
CREATE TABLE IF NOT EXISTS `licence_coach` (
  `num_licence` int NOT NULL AUTO_INCREMENT,
  `num_user` int NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `validee` tinyint(1) DEFAULT '0',
  `num_validateur` int DEFAULT NULL,
  `date_validation` datetime DEFAULT NULL,
  PRIMARY KEY (`num_licence`),
  KEY `num_user` (`num_user`),
  KEY `num_validateur` (`num_validateur`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `licence_coach`
--

-- --------------------------------------------------------

--
-- Table structure for table `licence_joueur`
--

DROP TABLE IF EXISTS `licence_joueur`;
CREATE TABLE IF NOT EXISTS `licence_joueur` (
  `num_licence` int NOT NULL AUTO_INCREMENT,
  `num_user` int NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `validee` tinyint(1) DEFAULT '0',
  `num_validateur` int DEFAULT NULL,
  `date_validation` datetime DEFAULT NULL,
  PRIMARY KEY (`num_licence`),
  KEY `num_user` (`num_user`),
  KEY `num_validateur` (`num_validateur`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `licence_joueur`
--

-- --------------------------------------------------------

--
-- Table structure for table `licencie`
--

DROP TABLE IF EXISTS `licencie`;
CREATE TABLE IF NOT EXISTS `licencie` (
  `num_user` int NOT NULL,
  `statut` enum('actif','inactif','suspendu') NOT NULL DEFAULT 'actif',
  `num_club` int NOT NULL,
  `poids_kg` decimal(5,2) DEFAULT NULL,
  `taille_cm` int DEFAULT NULL,
  PRIMARY KEY (`num_user`),
  KEY `num_club` (`num_club`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `licencie`
--

-- --------------------------------------------------------

--
-- Table structure for table `participation`
--

DROP TABLE IF EXISTS `participation`;
CREATE TABLE IF NOT EXISTS `participation` (
  `num_equipe` int NOT NULL,
  `num_evenement` int NOT NULL,
  `score` varchar(20) DEFAULT NULL,
  `resultat` enum('victoire','defaite','nul','forfait') DEFAULT NULL,
  `date_inscription` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`num_equipe`,`num_evenement`),
  KEY `num_evenement` (`num_evenement`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `participation`
--

-- --------------------------------------------------------

-- --------------------------------------------------------

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `num_user` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `date_inscription` datetime DEFAULT CURRENT_TIMESTAMP,
  `role` enum('admin','coach','licencie','utilisateur') NOT NULL,
  `est_admin` tinyint(1) DEFAULT '0',
  `actif` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`num_user`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `utilisateur`
--

-- --------------------------------------------------------
-- Jeu de donnees coherent
-- --------------------------------------------------------

INSERT INTO `club` (`num_club`, `nom`, `departement`, `telephone`, `email`, `adresse`, `ville`, `code_postal`, `date_creation`) VALUES
(1, 'AS Marseille Nord', 'Bouches-du-Rhone', '0491010101', 'contact@asmn.fr', '12 Rue des Sports', 'Marseille', '13001', '1995-09-01'),
(2, 'FC Lyon Est', 'Rhone', '0472020202', 'contact@fcle.fr', '5 Avenue du Stade', 'Lyon', '69001', '2002-03-15'),
(3, 'Lille Metropole Volley', 'Nord', '0320606060', 'contact@lmv.fr', '9 Boulevard Faidherbe', 'Lille', '59000', '2005-06-18'),
(4, 'Nantes Atlantique Volley', 'Loire-Atlantique', '0240404040', 'contact@nav.fr', '18 Quai des Sports', 'Nantes', '44000', '2008-04-21'),
(5, 'Bordeaux Sud Volley', 'Gironde', '0556565656', 'contact@bsv.fr', '77 Rue des Tribunes', 'Bordeaux', '33000', '2011-08-10');

INSERT INTO `utilisateur` (`num_user`, `nom`, `prenom`, `email`, `mot_de_passe`, `telephone`, `date_naissance`, `date_inscription`, `role`, `est_admin`, `actif`) VALUES
(1, 'Renucci', 'Alexandre', 'alexandre.renucci.pro@gmail.com', 'Alexandre', '0674103121', '2005-11-29', '2026-03-04 00:38:24', 'admin', 1, 1),
(2, 'Vidal', 'Claire', 'claire.vidal@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0611111111', '1984-11-18', '2026-03-04 10:10:00', 'admin', 1, 1),
(3, 'Bernard', 'Lucas', 'lucas.bernard@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0603040506', '1990-11-05', '2026-03-04 10:12:00', 'coach', 0, 1),
(4, 'Laurent', 'Julie', 'julie.laurent@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0608091011', '1995-12-25', '2026-03-04 10:13:00', 'coach', 0, 1),
(5, 'Perrin', 'David', 'david.perrin@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0618181818', '1991-12-03', '2026-03-04 10:14:00', 'coach', 0, 1),
(11, 'Leroy', 'Emma', 'emma.leroy@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0604050607', '1999-01-18', '2026-03-04 10:20:00', 'licencie', 0, 1),
(12, 'Moreau', 'Hugo', 'hugo.moreau@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0605060708', '2001-06-30', '2026-03-04 10:21:00', 'licencie', 0, 1),
(13, 'Petit', 'Chloe', 'chloe.petit@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0606070809', '2000-09-14', '2026-03-04 10:22:00', 'licencie', 0, 1),
(14, 'Simon', 'Theo', 'theo.simon@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0607080910', '1998-04-02', '2026-03-04 10:23:00', 'licencie', 0, 1),
(15, 'Garcia', 'Nina', 'nina.garcia@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0610111213', '2003-02-28', '2026-03-04 10:24:00', 'licencie', 0, 1),
(16, 'Martin', 'Lea', 'lea.martin@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0620000001', '2002-03-10', '2026-03-04 10:25:00', 'licencie', 0, 1),
(17, 'Roux', 'Nolan', 'nolan.roux@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0620000002', '2001-10-30', '2026-03-04 10:26:00', 'licencie', 0, 1),
(18, 'Marchal', 'Sarah', 'sarah.marchal@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0620000003', '2005-02-16', '2026-03-04 10:27:00', 'licencie', 0, 1),
(19, 'Collet', 'Evan', 'evan.collet@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0620000004', '2006-11-02', '2026-03-04 10:28:00', 'licencie', 0, 1),
(20, 'Lopez', 'Jade', 'jade.lopez@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0620000005', '2007-08-21', '2026-03-04 10:29:00', 'licencie', 0, 1),
(21, 'Gilbert', 'Mael', 'mael.gilbert@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0620000006', '2008-09-17', '2026-03-04 10:30:00', 'licencie', 0, 1),
(22, 'Bonnet', 'Lou', 'lou.bonnet@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0620000007', '2009-12-09', '2026-03-04 10:31:00', 'licencie', 0, 1),
(23, 'Masson', 'Theo', 'theo.masson@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0620000008', '2008-03-26', '2026-03-04 10:32:00', 'licencie', 0, 1),
(24, 'Lemoine', 'Anais', 'anais.lemoine@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0620000009', '2010-05-05', '2026-03-04 10:33:00', 'licencie', 0, 1),
(25, 'Roche', 'Baptiste', 'baptiste.roche@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0620000010', '2011-01-29', '2026-03-04 10:34:00', 'licencie', 0, 1),
(26, 'Clement', 'Nora', 'nora.clement@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0620000011', '1998-07-01', '2026-03-04 10:35:00', 'utilisateur', 0, 1),
(27, 'Barbier', 'Axel', 'axel.barbier@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0620000012', '1997-12-13', '2026-03-04 10:36:00', 'utilisateur', 0, 1),
(28, 'Renard', 'Mila', 'mila.renard@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0620000013', '1999-09-09', '2026-03-04 10:37:00', 'utilisateur', 0, 1),
(29, 'Garnier', 'Yohan', 'yohan.garnier@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0620000014', '2007-06-04', '2026-03-04 10:38:00', 'utilisateur', 0, 1),
(30, 'Nguyen', 'Lola', 'lola.nguyen@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0620000015', '2008-02-25', '2026-03-04 10:39:00', 'utilisateur', 0, 1),
(31, 'Faure', 'Matthieu', 'matthieu.faure@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0630000001', '1988-09-12', '2026-03-04 10:40:00', 'coach', 0, 1),
(32, 'Chevalier', 'Sonia', 'sonia.chevalier@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0630000002', '1992-01-19', '2026-03-04 10:41:00', 'coach', 0, 1),
(33, 'Giraud', 'Tom', 'tom.giraud@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0630000003', '2004-11-08', '2026-03-04 10:42:00', 'licencie', 0, 1),
(34, 'Ribeiro', 'Ines', 'ines.ribeiro@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0630000004', '2003-06-14', '2026-03-04 10:43:00', 'licencie', 0, 1),
(35, 'Meyer', 'Quentin', 'quentin.meyer@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0630000005', '2005-03-22', '2026-03-04 10:44:00', 'licencie', 0, 1),
(36, 'Leduc', 'Salome', 'salome.leduc@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0630000006', '2006-10-03', '2026-03-04 10:45:00', 'licencie', 0, 1),
(37, 'Poulain', 'Rayan', 'rayan.poulain@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0630000007', '2000-02-27', '2026-03-04 10:46:00', 'utilisateur', 0, 1),
(38, 'Hubert', 'Elisa', 'elisa.hubert@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0630000008', '1998-04-15', '2026-03-04 10:47:00', 'utilisateur', 0, 1),
(39, 'Fernandez', 'Noe', 'noe.fernandez@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0630000009', '2007-01-11', '2026-03-04 10:48:00', 'licencie', 0, 1),
(40, 'Bourgeois', 'Lina', 'lina.bourgeois@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0630000010', '2008-07-07', '2026-03-04 10:49:00', 'licencie', 0, 1),
(41, 'Roussel', 'Karim', 'karim.roussel@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0630000011', '1991-05-17', '2026-03-04 10:50:00', 'coach', 0, 1),
(42, 'Valette', 'Camille', 'camille.valette@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0630000012', '2009-09-23', '2026-03-04 10:51:00', 'licencie', 0, 1);

INSERT INTO `coach` (`num_user`, `diplome`, `specialite`, `annees_experience`, `num_club`) VALUES
(3, 'UEFA B', 'Preparation physique', 8, 1),
(4, 'UEFA A', 'Tactique defensive', 11, 2),
(5, 'DEJEPS Volley', 'Formation jeunes', 9, 3),
(29, 'BPJEPS APT', 'Conditionnement', 4, 4),
(30, 'CQP ALS', 'Animation sportive', 3, 5),
(31, 'DEJEPS Volley', 'Strategie match', 12, 4),
(32, 'Brevet Federal Niveau 3', 'Technique reception', 7, 5),
(41, 'UEFA B', 'Coordination collective', 10, 2);

INSERT INTO `equipe` (`num_equipe`, `nom`, `categorie`, `num_club`, `num_coach`, `date_creation`, `couleur_maillot`, `nb_joueurs_max`) VALUES
(1, 'AS Marseille Nord Seniors', 'senior', 1, 3, '2010-06-01', 'Bleu/Blanc', 25),
(2, 'FC Lyon Est Seniors', 'senior', 2, 4, '2012-09-01', 'Rouge/Noir', 25),
(3, 'Lille Metropole Seniors', 'senior', 3, 5, '2014-09-01', 'Jaune/Bleu', 25),
(4, 'Nantes Atlantique Elite', 'senior', 4, 31, '2016-09-01', 'Vert/Blanc', 25),
(5, 'Bordeaux Sud Performance', 'senior', 5, 32, '2018-09-01', 'Marine/Or', 25),
(6, 'Lyon Est Reserve', 'senior', 2, 41, '2019-09-01', 'Noir/Gris', 25);

INSERT INTO `licencie` (`num_user`, `statut`, `num_club`, `poids_kg`, `taille_cm`) VALUES
(11, 'actif', 1, 72.50, 178),
(12, 'actif', 1, 68.00, 175),
(13, 'actif', 1, 75.00, 182),
(14, 'actif', 1, 80.00, 185),
(15, 'actif', 1, 65.50, 170),
(16, 'actif', 2, 73.00, 181),
(17, 'actif', 2, 82.00, 192),
(18, 'actif', 2, 69.00, 176),
(19, 'actif', 2, 64.00, 171),
(20, 'actif', 2, 66.00, 174),
(21, 'actif', 3, 71.00, 179),
(22, 'actif', 3, 74.00, 183),
(23, 'inactif', 3, 61.00, 169),
(24, 'actif', 3, 68.00, 175),
(25, 'actif', 3, 70.00, 178),
(33, 'actif', 4, 77.00, 184),
(34, 'actif', 4, 63.00, 168),
(35, 'actif', 5, 79.00, 187),
(36, 'actif', 5, 67.00, 173),
(39, 'actif', 2, 76.00, 180),
(40, 'actif', 5, 62.00, 167),
(42, 'inactif', 4, 69.00, 176);

INSERT INTO `equipe_licencie` (`num_equipe`, `num_user`, `date_integration`, `numero_maillot`) VALUES
(1, 11, '2025-09-01', 1),
(1, 12, '2025-09-01', 4),
(1, 13, '2025-09-01', 7),
(1, 14, '2025-09-01', 9),
(1, 15, '2025-09-01', 11),
(2, 16, '2025-09-01', 2),
(2, 17, '2025-09-01', 5),
(2, 18, '2025-09-01', 8),
(2, 19, '2025-09-01', 10),
(2, 20, '2025-09-01', 12),
(3, 21, '2025-09-01', 3),
(3, 22, '2025-09-01', 6),
(3, 23, '2025-09-01', 13),
(3, 24, '2025-09-01', 14),
(3, 25, '2025-09-01', 15),
(4, 33, '2025-09-01', 16),
(4, 34, '2025-09-01', 18),
(4, 42, '2026-01-15', 22),
(5, 35, '2025-09-01', 17),
(5, 36, '2025-09-01', 19),
(5, 40, '2026-02-10', 20),
(6, 39, '2025-11-03', 21);

INSERT INTO `demande_licence_joueur` (`num_demande`, `num_user`, `statut`, `date_demande`, `date_traitement`, `poids`, `taille`) VALUES
(1, 26, 'en_attente', '2026-03-27 09:15:00', NULL, 67.00, 174),
(2, 27, 'validee', '2026-03-27 10:20:00', '2026-03-30 18:40:00', 79.00, 186),
(3, 28, 'refusee', '2026-03-28 14:05:00', '2026-03-30 19:10:00', 58.00, 165),
(4, 37, 'en_attente', '2026-03-29 11:12:00', NULL, 83.00, 188),
(5, 38, 'en_attente', '2026-03-30 16:40:00', NULL, 60.00, 166),
(6, 42, 'validee', '2026-03-15 09:30:00', '2026-03-21 14:10:00', 69.00, 176),
(7, 40, 'validee', '2026-02-10 10:15:00', '2026-02-12 18:20:00', 62.00, 167),
(8, 39, 'validee', '2026-01-10 08:45:00', '2026-01-12 10:00:00', 76.00, 180);

INSERT INTO `demande_licence_coach` (`num_demande`, `num_user`, `statut`, `date_demande`, `date_traitement`, `diplome`) VALUES
(1, 29, 'en_attente', '2026-03-29 08:00:00', NULL, 'BPJEPS APT'),
(2, 30, 'validee', '2026-03-29 10:30:00', '2026-03-30 20:05:00', 'CQP ALS'),
(3, 31, 'validee', '2025-08-25 09:00:00', '2025-08-28 11:15:00', 'DEJEPS Volley'),
(4, 32, 'validee', '2025-09-02 13:20:00', '2025-09-05 17:00:00', 'Brevet Federal Niveau 3'),
(5, 41, 'validee', '2025-10-01 09:10:00', '2025-10-03 15:45:00', 'UEFA B');

INSERT INTO `licence_joueur` (`num_licence`, `num_user`, `date_debut`, `date_fin`, `validee`, `num_validateur`, `date_validation`) VALUES
(1, 11, '2024-09-01', '2025-08-31', 1, 1, '2024-09-04 09:15:00'),
(2, 11, '2025-09-01', '2026-08-31', 1, 1, '2025-09-05 10:00:00'),
(3, 12, '2025-09-01', '2026-08-31', 1, 1, '2025-09-05 10:10:00'),
(4, 13, '2025-09-01', '2026-08-31', 1, 1, '2025-09-05 10:20:00'),
(5, 14, '2025-09-01', '2026-08-31', 1, 1, '2025-09-05 10:30:00'),
(6, 15, '2025-09-01', '2026-08-31', 1, 1, '2025-09-05 10:40:00'),
(7, 16, '2025-09-01', '2026-08-31', 1, 2, '2025-09-06 11:00:00'),
(8, 17, '2025-09-01', '2026-08-31', 1, 2, '2025-09-06 11:10:00'),
(9, 18, '2025-09-01', '2026-08-31', 1, 2, '2025-09-06 11:20:00'),
(10, 19, '2025-09-01', '2026-08-31', 1, 2, '2025-09-06 11:30:00'),
(11, 20, '2025-09-01', '2026-08-31', 1, 2, '2025-09-06 11:40:00'),
(12, 21, '2025-09-01', '2026-08-31', 1, 1, '2025-09-07 09:00:00'),
(13, 22, '2025-09-01', '2026-08-31', 1, 1, '2025-09-07 09:10:00'),
(14, 23, '2025-09-01', '2026-08-31', 0, NULL, NULL),
(15, 24, '2025-09-01', '2026-08-31', 1, 1, '2025-09-07 09:20:00'),
(16, 25, '2025-09-01', '2026-08-31', 1, 1, '2025-09-07 09:30:00'),
(17, 33, '2025-09-01', '2026-08-31', 1, 2, '2025-09-08 10:05:00'),
(18, 34, '2025-09-01', '2026-08-31', 1, 2, '2025-09-08 10:15:00'),
(19, 35, '2025-09-01', '2026-08-31', 1, 1, '2025-09-09 09:45:00'),
(20, 36, '2025-09-01', '2026-08-31', 1, 1, '2025-09-09 09:55:00'),
(21, 39, '2025-11-01', '2026-10-31', 1, 2, '2025-11-02 14:05:00'),
(22, 40, '2026-02-12', '2027-02-11', 1, 1, '2026-02-12 18:20:00'),
(23, 42, '2026-03-21', '2027-03-20', 1, 1, '2026-03-21 14:10:00');

INSERT INTO `licence_coach` (`num_licence`, `num_user`, `date_debut`, `date_fin`, `validee`, `num_validateur`, `date_validation`) VALUES
(1, 3, '2025-09-01', '2026-08-31', 1, 1, '2025-09-03 11:00:00'),
(2, 4, '2025-09-01', '2026-08-31', 1, 1, '2025-09-03 11:10:00'),
(3, 5, '2025-09-01', '2026-08-31', 1, 2, '2025-09-03 11:20:00'),
(4, 30, '2026-03-30', '2027-03-29', 1, 1, '2026-03-30 20:05:00'),
(5, 31, '2025-08-28', '2026-08-27', 1, 2, '2025-08-28 11:15:00'),
(6, 31, '2026-08-28', '2027-08-27', 0, NULL, NULL),
(7, 32, '2025-09-05', '2026-09-04', 1, 1, '2025-09-05 17:00:00'),
(8, 41, '2025-10-03', '2026-10-02', 1, 2, '2025-10-03 15:45:00');

INSERT INTO `evenement` (`num_evenement`, `type`, `date_debut`, `date_fin`, `lieu`, `adresse_lieu`, `description`, `nb_places_max`, `statut`, `createur`) VALUES
(1, 'entrainement', '2026-04-02 19:00:00', '2026-04-02 21:00:00', 'Gymnase Principal', '12 Rue des Sports, Marseille', 'Seance collective seniors', 60, 'planifie', 3),
(2, 'match', '2026-04-12 15:00:00', '2026-04-12 17:00:00', 'Stade Municipal', '5 Avenue du Stade, Lyon', 'Match amical inter-clubs', 300, 'planifie', 4),
(3, 'tournoi', '2026-05-01 09:00:00', '2026-05-01 18:00:00', 'Complexe Metropole', '25 Avenue Centrale, Lille', 'Tournoi de printemps', 900, 'planifie', 1),
(4, 'match', '2026-03-20 14:00:00', '2026-03-20 16:00:00', 'Gymnase Nord', '30 Rue des Arenes, Marseille', 'Match de preparation', 250, 'termine', 5),
(5, 'entrainement', '2026-04-05 18:30:00', '2026-04-05 20:30:00', 'Salle Atlantique', '18 Quai des Sports, Nantes', 'Travail service-reception', 80, 'planifie', 31),
(6, 'entrainement', '2026-04-06 19:00:00', '2026-04-06 21:00:00', 'Halle Sud', '77 Rue des Tribunes, Bordeaux', 'Circuit cardio-technique', 90, 'planifie', 32),
(7, 'match', '2026-04-19 16:00:00', '2026-04-19 18:00:00', 'Arena Est', '8 Avenue du Stade, Lyon', 'Championnat regional J4', 450, 'planifie', 41),
(8, 'tournoi', '2026-06-14 08:00:00', '2026-06-14 19:00:00', 'Palais des Sports', '100 Rue de la Republique, Marseille', 'Tournoi national open', 1200, 'planifie', 2),
(9, 'autre', '2026-04-15 20:00:00', '2026-04-15 22:00:00', 'Salle Video Club', '12 Rue des Sports, Marseille', 'Analyse video collective', 40, 'planifie', 3),
(10, 'match', '2026-02-22 15:00:00', '2026-02-22 17:00:00', 'Complexe Loire', '22 Route de l Ile, Nantes', 'Match preparation hiver', 320, 'termine', 31),
(11, 'entrainement', '2026-03-25 19:00:00', '2026-03-25 21:00:00', 'Gymnase Metropole', '25 Avenue Centrale, Lille', 'Seance de reprise', 75, 'annule', 5),
(12, 'match', '2026-04-28 20:00:00', '2026-04-28 22:00:00', 'Palais Girondin', '77 Rue des Tribunes, Bordeaux', 'Derby de conference', 600, 'planifie', 32);

INSERT INTO `participation` (`num_equipe`, `num_evenement`, `score`, `resultat`, `date_inscription`) VALUES
(1, 1, NULL, NULL, '2026-03-31 09:00:00'),
(2, 1, NULL, NULL, '2026-03-31 09:02:00'),
(1, 2, NULL, NULL, '2026-03-31 09:05:00'),
(2, 2, NULL, NULL, '2026-03-31 09:06:00'),
(1, 3, NULL, NULL, '2026-03-31 09:10:00'),
(2, 3, NULL, NULL, '2026-03-31 09:11:00'),
(3, 3, NULL, NULL, '2026-03-31 09:12:00'),
(1, 4, '3-1', 'victoire', '2026-03-31 09:15:00'),
(3, 4, '1-3', 'defaite', '2026-03-31 09:16:00'),
(4, 5, NULL, NULL, '2026-04-01 08:00:00'),
(5, 6, NULL, NULL, '2026-04-01 08:05:00'),
(2, 7, NULL, NULL, '2026-04-01 08:10:00'),
(6, 7, NULL, NULL, '2026-04-01 08:12:00'),
(1, 8, NULL, NULL, '2026-04-01 08:15:00'),
(2, 8, NULL, NULL, '2026-04-01 08:16:00'),
(3, 8, NULL, NULL, '2026-04-01 08:17:00'),
(4, 8, NULL, NULL, '2026-04-01 08:18:00'),
(5, 8, NULL, NULL, '2026-04-01 08:19:00'),
(6, 8, NULL, NULL, '2026-04-01 08:20:00'),
(1, 9, NULL, NULL, '2026-04-01 08:25:00'),
(4, 10, '2-3', 'defaite', '2026-02-18 18:00:00'),
(5, 10, '3-2', 'victoire', '2026-02-18 18:02:00'),
(3, 11, NULL, NULL, '2026-03-20 12:00:00'),
(5, 12, NULL, NULL, '2026-04-01 08:40:00'),
(6, 12, NULL, NULL, '2026-04-01 08:42:00');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
