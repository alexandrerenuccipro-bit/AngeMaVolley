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

INSERT INTO `club` (`num_club`, `nom`, `departement`, `telephone`, `email`, `adresse`, `ville`, `code_postal`, `date_creation`) VALUES
(1, 'AS Marseille Nord', 'Bouches-du-Rhône', '0491010101', 'contact@asmn.fr', '12 Rue des Sports', 'Marseille', '13001', '1995-09-01'),
(2, 'FC Lyon Est', 'Rhône', '0472020202', 'contact@fcle.fr', '5 Avenue du Stade', 'Lyon', '69001', '2002-03-15'),
(3, 'Sporting Paris Sud', 'Paris', '0143030303', 'contact@sps.fr', '88 Boulevard du Foot', 'Paris', '75013', '1988-06-20');

-- --------------------------------------------------------

--
-- Table structure for table `coach`
--

DROP TABLE IF EXISTS `coach`;
CREATE TABLE IF NOT EXISTS `coach` (
  `num_user` int NOT NULL,
  `diplome` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`num_user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coach`
--

INSERT INTO `coach` (`num_user`, `diplome`) VALUES
(3, 'UEFA B'),
(8, 'UEFA A');

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

INSERT INTO `equipe` (`num_equipe`, `nom`, `categorie`, `num_club`, `num_coach`, `date_creation`, `couleur_maillot`, `nb_joueurs_max`) VALUES
(1, 'AS Marseille Nord Seniors', 'senior', 1, 3, '2010-06-01', 'Bleu/Blanc', 25);

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

INSERT INTO `equipe_licencie` (`num_equipe`, `num_user`, `date_integration`, `numero_maillot`) VALUES
(1, 4, '2022-09-01', 9),
(1, 5, '2023-01-15', 10);

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

INSERT INTO `evenement` (`num_evenement`, `type`, `date_debut`, `date_fin`, `lieu`, `adresse_lieu`, `description`, `nb_places_max`, `statut`, `createur`) VALUES
(1, 'match', '2025-03-15 15:00:00', '2025-03-15 17:00:00', 'Stade Vélodrome', '3 Bd Michelet, Marseille', 'Match de championnat régional', 500, 'termine', 2),
(2, 'entrainement', '2025-03-20 18:00:00', '2025-03-20 20:00:00', 'Terrain annexe', '5 Rue du Parc, Lyon', 'Entrainement hebdomadaire', 30, 'planifie', 8),
(3, 'tournoi', '2025-04-10 09:00:00', '2025-04-10 18:00:00', 'Complexe Sportif', '88 Bd du Foot, Paris', 'Tournoi inter-clubs printemps', 1000, 'planifie', 1),
(4, 'match', '2025-05-01 14:00:00', '2025-05-01 16:00:00', 'Stade de Gerland', '353 Av. Tony Garnier, Lyon', 'Derby Lyon-Marseille', 800, 'planifie', 9);

-- --------------------------------------------------------

--
-- Table structure for table `licence`
--

DROP TABLE IF EXISTS `licence`;
CREATE TABLE IF NOT EXISTS `licence` (
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
-- Dumping data for table `licence`
--

INSERT INTO `licence` (`num_licence`, `num_user`, `date_debut`, `date_fin`, `validee`, `num_validateur`, `date_validation`) VALUES
(1, 4, '2024-09-01', '2025-08-31', 1, 1, '2024-09-03 10:00:00'),
(2, 5, '2024-09-01', '2025-08-31', 1, 1, '2024-09-03 10:30:00'),
(3, 6, '2024-09-01', '2025-08-31', 1, 1, '2024-09-04 09:00:00'),
(4, 7, '2024-09-01', '2025-08-31', 0, NULL, NULL),
(5, 10, '2024-09-01', '2025-08-31', 1, 1, '2024-09-05 11:00:00'),
(6, 4, '2023-09-01', '2024-08-31', 1, 1, '2023-09-02 14:00:00');

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

INSERT INTO `licencie` (`num_user`, `statut`, `num_club`, `poids_kg`, `taille_cm`) VALUES
(4, 'actif', 1, 72.50, 178),
(5, 'actif', 1, 68.00, 175),
(6, 'actif', 2, 75.00, 182),
(7, 'suspendu', 2, 80.00, 185),
(10, 'actif', 3, 65.50, 170);

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

INSERT INTO `participation` (`num_equipe`, `num_evenement`, `score`, `resultat`, `date_inscription`) VALUES
(1, 1, '2-1', 'victoire', '2026-03-04 00:38:25'),
(1, 3, NULL, NULL, '2026-03-04 00:38:25'),
(1, 4, NULL, NULL, '2026-03-04 00:38:25');

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

INSERT INTO `utilisateur` (`num_user`, `nom`, `prenom`, `email`, `mot_de_passe`, `telephone`, `date_naissance`, `date_inscription`, `role`, `est_admin`, `actif`) VALUES
(1, 'Renucci', 'Alexandre', 'alexandre.renucci.pro@gmail.com', 'Alexandre', '0674103121', '2005-11-29', '2026-03-04 00:38:24', 'admin', 1, 1),
(2, 'Dupont', 'Pierre', 'pierre.dupont@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0602030405', '1978-07-22', '2026-03-04 00:38:24', 'admin', 0, 1),
(3, 'Bernard', 'Lucas', 'lucas.bernard@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0603040506', '1990-11-05', '2026-03-04 00:38:24', 'coach', 0, 1),
(4, 'Leroy', 'Emma', 'emma.leroy@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0604050607', '1999-01-18', '2026-03-04 00:38:24', 'licencie', 0, 1),
(5, 'Moreau', 'Hugo', 'hugo.moreau@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0605060708', '2001-06-30', '2026-03-04 00:38:24', 'licencie', 0, 1),
(6, 'Petit', 'Chloé', 'chloe.petit@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0606070809', '2000-09-14', '2026-03-04 00:38:24', 'licencie', 0, 1),
(7, 'Simon', 'Théo', 'theo.simon@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0607080910', '1998-04-02', '2026-03-04 00:38:24', 'licencie', 0, 1),
(8, 'Laurent', 'Julie', 'julie.laurent@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0608091011', '1995-12-25', '2026-03-04 00:38:24', 'coach', 0, 1),
(9, 'Michel', 'Antoine', 'antoine.michel@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0609101112', '1980-08-17', '2026-03-04 00:38:24', 'admin', 0, 1),
(10, 'Garcia', 'Nina', 'nina.garcia@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0610111213', '2003-02-28', '2026-03-04 00:38:24', 'licencie', 0, 1);

-- --------------------------------------------------------
-- Jeu de donnees etendu (coherent et volumineux)
-- --------------------------------------------------------

INSERT INTO `club` (`num_club`, `nom`, `departement`, `telephone`, `email`, `adresse`, `ville`, `code_postal`, `date_creation`) VALUES
(4, 'Volley Nantes Atlantique', 'Loire-Atlantique', '0240404040', 'contact@vna.fr', '22 Rue des Sports', 'Nantes', '44000', '2008-09-01'),
(5, 'Toulouse Volley Union', 'Haute-Garonne', '0560505050', 'contact@tvu.fr', '14 Avenue des Arenes', 'Toulouse', '31000', '2011-02-12'),
(6, 'Lille Metropole Volley', 'Nord', '0320606060', 'contact@lmv.fr', '9 Boulevard Faidherbe', 'Lille', '59000', '2005-06-18'),
(7, 'Nice Cote Volley', 'Alpes-Maritimes', '0490707070', 'contact@ncv.fr', '30 Promenade des Sports', 'Nice', '06000', '2013-04-20'),
(8, 'Bordeaux Gironde Volley', 'Gironde', '0550808080', 'contact@bgv.fr', '6 Rue des Arenes', 'Bordeaux', '33000', '2009-01-09');

INSERT INTO `utilisateur` (`num_user`, `nom`, `prenom`, `email`, `mot_de_passe`, `telephone`, `date_naissance`, `date_inscription`, `role`, `est_admin`, `actif`) VALUES
(11, 'Vidal', 'Claire', 'claire.vidal@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0611111111', '1984-11-18', '2026-03-04 10:10:00', 'admin', 1, 1),
(12, 'Durand', 'Camille', 'camille.durand@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0612121212', '1982-05-10', '2026-03-04 10:11:00', 'admin', 0, 1),
(13, 'Renaud', 'Julien', 'julien.renaud@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0613131313', '1986-09-22', '2026-03-04 10:12:00', 'admin', 0, 1),
(14, 'Morel', 'Amandine', 'amandine.morel@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0614141414', '1981-12-01', '2026-03-04 10:13:00', 'admin', 0, 1),
(15, 'Lacroix', 'Thomas', 'thomas.lacroix@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0615151515', '1979-07-07', '2026-03-04 10:14:00', 'admin', 0, 1),
(16, 'Perrot', 'Nadine', 'nadine.perrot@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0616161616', '1983-02-23', '2026-03-04 10:15:00', 'admin', 0, 1),
(17, 'Noel', 'Aline', 'aline.noel@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0617171717', '1989-03-14', '2026-03-04 10:16:00', 'coach', 0, 1),
(18, 'Perrin', 'David', 'david.perrin@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0618181818', '1991-12-03', '2026-03-04 10:17:00', 'coach', 0, 1),
(19, 'Meyer', 'Laura', 'laura.meyer@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0619191919', '1993-07-28', '2026-03-04 10:18:00', 'coach', 0, 1),
(20, 'Adam', 'Karim', 'karim.adam@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0620202020', '1988-01-12', '2026-03-04 10:19:00', 'coach', 0, 1),
(21, 'Chevalier', 'Lina', 'lina.chevalier@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0621212121', '1990-05-04', '2026-03-04 10:20:00', 'coach', 0, 1),
(22, 'Legrand', 'Yanis', 'yanis.legrand@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0622222222', '1987-09-19', '2026-03-04 10:21:00', 'coach', 0, 1),
(23, 'Aubert', 'Sonia', 'sonia.aubert@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0623232323', '1992-10-11', '2026-03-04 10:22:00', 'coach', 0, 1),
(24, 'Briand', 'Leo', 'leo.briand@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0624242424', '1994-06-15', '2026-03-04 10:23:00', 'coach', 0, 1),
(25, 'Guerin', 'Maxime', 'maxime.guerin@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0625252525', '2000-01-11', '2026-03-04 10:24:00', 'licencie', 0, 1),
(26, 'Andre', 'Nora', 'nora.andre@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0626262626', '1999-06-19', '2026-03-04 10:25:00', 'licencie', 0, 1),
(27, 'Boyer', 'Ines', 'ines.boyer@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0627272727', '2002-04-08', '2026-03-04 10:26:00', 'licencie', 0, 1),
(28, 'Roux', 'Nolan', 'nolan.roux@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0628282828', '2001-10-30', '2026-03-04 10:27:00', 'licencie', 0, 1),
(29, 'Marchal', 'Sarah', 'sarah.marchal@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0629292929', '2005-02-16', '2026-03-04 10:28:00', 'licencie', 0, 1),
(30, 'Collet', 'Evan', 'evan.collet@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0630303030', '2006-11-02', '2026-03-04 10:29:00', 'licencie', 0, 1),
(31, 'Lopez', 'Jade', 'jade.lopez@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0631313131', '2007-08-21', '2026-03-04 10:30:00', 'licencie', 0, 1),
(32, 'Gilbert', 'Mael', 'mael.gilbert@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0632323232', '2008-09-17', '2026-03-04 10:31:00', 'licencie', 0, 1),
(33, 'Bonnet', 'Lou', 'lou.bonnet@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0633333333', '2009-12-09', '2026-03-04 10:32:00', 'licencie', 0, 1),
(34, 'Masson', 'Theo', 'theo.masson@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0634343434', '2008-03-26', '2026-03-04 10:33:00', 'licencie', 0, 1),
(35, 'Lemoine', 'Anais', 'anais.lemoine@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0635353535', '2010-05-05', '2026-03-04 10:34:00', 'licencie', 0, 1),
(36, 'Roche', 'Baptiste', 'baptiste.roche@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0636363636', '2011-01-29', '2026-03-04 10:35:00', 'licencie', 0, 1),
(37, 'Clement', 'Nora', 'nora.clement@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0637373737', '1998-07-01', '2026-03-04 10:36:00', 'licencie', 0, 1),
(38, 'Barbier', 'Axel', 'axel.barbier@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0638383838', '1997-12-13', '2026-03-04 10:37:00', 'licencie', 0, 1),
(39, 'Renard', 'Mila', 'mila.renard@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0639393939', '1999-09-09', '2026-03-04 10:38:00', 'licencie', 0, 1),
(40, 'Garnier', 'Yohan', 'yohan.garnier@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0640404040', '2007-06-04', '2026-03-04 10:39:00', 'licencie', 0, 1),
(41, 'Nguyen', 'Lola', 'lola.nguyen@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0641414141', '2008-02-25', '2026-03-04 10:40:00', 'licencie', 0, 1),
(42, 'Pascal', 'Eliot', 'eliot.pascal@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0642424242', '2001-11-17', '2026-03-04 10:41:00', 'licencie', 0, 1),
(43, 'Lefevre', 'Morgane', 'morgane.lefevre@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0643434343', '2002-08-03', '2026-03-04 10:42:00', 'licencie', 0, 1),
(44, 'Morin', 'Sacha', 'sacha.morin@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0644444444', '2004-03-09', '2026-03-04 10:43:00', 'licencie', 0, 1),
(45, 'Julien', 'Agathe', 'agathe.julien@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0645454545', '2005-01-05', '2026-03-04 10:44:00', 'licencie', 0, 1);

INSERT INTO `coach` (`num_user`, `diplome`) VALUES
(17, 'DEJEPS Volley'),
(18, 'BPJEPS APT'),
(19, 'DEJEPS Volley'),
(20, 'Licence STAPS'),
(21, 'DEJEPS Volley'),
(22, 'Master Preparation Mentale'),
(23, 'BPJEPS APT'),
(24, 'CQP ALS');

INSERT INTO `equipe` (`num_equipe`, `nom`, `categorie`, `num_club`, `num_coach`, `date_creation`, `couleur_maillot`, `nb_joueurs_max`) VALUES
(4, 'Volley Nantes A Seniors', 'senior', 4, 17, '2022-09-01', '#1e40af', 20),
(6, 'Toulouse Elite Seniors', 'senior', 5, 19, '2021-09-01', '#059669', 20),
(8, 'Lille Nord Seniors', 'senior', 6, 21, '2019-09-01', '#0ea5e9', 20),
(10, 'Nice Azur Seniors', 'senior', 7, 23, '2020-09-01', '#ef4444', 20),
(12, 'Bordeaux Gironde A', 'senior', 8, 18, '2021-09-01', '#b45309', 20);

INSERT INTO `licencie` (`num_user`, `statut`, `num_club`, `poids_kg`, `taille_cm`) VALUES
(25, 'actif', 4, 73.00, 181),
(26, 'actif', 4, 82.00, 192),
(27, 'actif', 4, 69.00, 176),
(28, 'actif', 4, 64.00, 171),
(29, 'actif', 4, 66.00, 174),
(30, 'actif', 5, 71.00, 179),
(31, 'actif', 5, 74.00, 183),
(32, 'inactif', 5, 61.00, 169),
(33, 'actif', 5, 68.00, 175),
(34, 'actif', 5, 70.00, 178),
(35, 'actif', 6, 84.00, 194),
(36, 'actif', 6, 72.00, 180),
(37, 'suspendu', 6, 70.00, 177),
(38, 'actif', 6, 63.00, 168),
(39, 'actif', 7, 67.00, 174),
(40, 'actif', 7, 76.00, 186),
(41, 'actif', 7, 59.00, 165),
(42, 'actif', 8, 71.00, 179),
(43, 'actif', 8, 74.00, 184),
(44, 'actif', 8, 78.00, 188),
(45, 'actif', 8, 62.00, 167);

INSERT INTO `equipe_licencie` (`num_equipe`, `num_user`, `date_integration`, `numero_maillot`) VALUES
(4, 25, '2025-09-01', 2),
(4, 26, '2025-09-01', 5),
(4, 27, '2025-09-01', 9),
(6, 30, '2025-09-01', 8),
(6, 31, '2025-09-01', 6),
(6, 32, '2025-09-01', 12),
(8, 35, '2025-09-01', 14),
(8, 36, '2025-09-01', 15),
(10, 39, '2025-09-01', 16),
(10, 40, '2025-09-01', 18),
(12, 42, '2025-09-01', 17),
(12, 43, '2025-09-01', 19);

INSERT INTO `licence` (`num_licence`, `num_user`, `date_debut`, `date_fin`, `validee`, `num_validateur`, `date_validation`) VALUES
(7, 25, '2025-09-01', '2026-08-31', 1, 1, '2025-09-05 10:00:00'),
(8, 26, '2025-09-01', '2026-08-31', 1, 1, '2025-09-05 10:10:00'),
(9, 27, '2025-09-01', '2026-08-31', 1, 1, '2025-09-05 10:20:00'),
(10, 28, '2025-09-01', '2026-08-31', 1, 1, '2025-09-05 10:30:00'),
(11, 29, '2025-09-01', '2026-08-31', 1, 11, '2025-09-05 11:00:00'),
(12, 30, '2025-09-01', '2026-08-31', 1, 11, '2025-09-05 11:10:00'),
(13, 31, '2025-09-01', '2026-08-31', 1, 11, '2025-09-05 11:20:00'),
(14, 32, '2025-09-01', '2026-08-31', 0, NULL, NULL),
(15, 33, '2025-09-01', '2026-08-31', 1, 11, '2025-09-05 11:30:00'),
(16, 34, '2025-09-01', '2026-08-31', 1, 11, '2025-09-05 11:40:00'),
(17, 35, '2025-09-01', '2026-08-31', 1, 1, '2025-09-06 14:00:00'),
(18, 36, '2025-09-01', '2026-08-31', 1, 1, '2025-09-06 14:10:00'),
(19, 37, '2025-09-01', '2026-08-31', 0, NULL, NULL),
(20, 38, '2025-09-01', '2026-08-31', 1, 11, '2025-09-06 14:20:00'),
(21, 39, '2025-09-01', '2026-08-31', 1, 11, '2025-09-06 14:30:00'),
(22, 40, '2025-09-01', '2026-08-31', 1, 11, '2025-09-06 14:40:00'),
(23, 41, '2025-09-01', '2026-08-31', 1, 11, '2025-09-06 14:50:00'),
(24, 42, '2025-09-01', '2026-08-31', 1, 11, '2025-09-06 15:00:00'),
(25, 43, '2025-09-01', '2026-08-31', 1, 11, '2025-09-06 15:10:00'),
(26, 44, '2025-09-01', '2026-08-31', 1, 11, '2025-09-06 15:20:00'),
(27, 45, '2025-09-01', '2026-08-31', 1, 11, '2025-09-06 15:30:00');

INSERT INTO `evenement` (`num_evenement`, `type`, `date_debut`, `date_fin`, `lieu`, `adresse_lieu`, `description`, `nb_places_max`, `statut`, `createur`) VALUES
(5, 'entrainement', '2026-04-02 19:00:00', '2026-04-02 21:00:00', 'Gymnase Beaulieu', '10 Rue Beaulieu, Nantes', 'Seance technique service et reception', 60, 'planifie', 17),
(6, 'match', '2026-04-06 16:00:00', '2026-04-06 18:00:00', 'Palais des Sports', '1 Place du Sport, Toulouse', 'Championnat regional journee 14', 800, 'planifie', 12),
(7, 'tournoi', '2026-04-20 09:00:00', '2026-04-20 19:00:00', 'Complexe Metropole', '25 Avenue Centrale, Lyon', 'Tournoi inter-clubs printemps 2026', 1200, 'planifie', 11),
(8, 'match', '2026-03-10 14:00:00', '2026-03-10 16:00:00', 'Gymnase Atlantique', '22 Rue des Sports, Nantes', 'Match amical de preparation', 350, 'termine', 19),
(9, 'entrainement', '2026-03-12 18:30:00', '2026-03-12 20:00:00', 'Salle du Lac', '7 Quai Nord, Marseille', 'Travail bloc defense', 40, 'en_cours', 21),
(10, 'autre', '2026-05-05 18:00:00', '2026-05-05 20:30:00', 'Maison des Sports', '40 Rue du Stade, Toulouse', 'Reunion parents et presentation saison', 150, 'planifie', 13),
(11, 'match', '2026-05-12 15:00:00', '2026-05-12 17:00:00', 'Gymnase Mermoz', '12 Rue Mermoz, Bordeaux', 'Match de classement', 600, 'planifie', 14),
(12, 'tournoi', '2026-06-01 09:00:00', '2026-06-01 20:00:00', 'Arena Nice', '4 Avenue Mediterranee, Nice', 'Finales regionales jeunes', 1500, 'planifie', 16),
(13, 'match', '2026-06-10 14:00:00', '2026-06-10 16:00:00', 'Stade Municipal', '3 Rue de la Paix, Lille', 'Rencontre amicale annulee', 500, 'annule', 18),
(14, 'entrainement', '2026-04-15 18:00:00', '2026-04-15 20:00:00', 'Gymnase du Port', '2 Quai des Sportifs, Nice', 'Mise en place tactique avant tournoi', 70, 'planifie', 23);

INSERT INTO `participation` (`num_equipe`, `num_evenement`, `score`, `resultat`, `date_inscription`) VALUES
(4, 5, NULL, NULL, '2026-03-08 10:00:00'),
(4, 6, NULL, NULL, '2026-03-08 10:10:00'),
(6, 6, NULL, NULL, '2026-03-08 10:15:00'),
(4, 7, NULL, NULL, '2026-03-08 10:20:00'),
(6, 7, NULL, NULL, '2026-03-08 10:25:00'),
(8, 7, NULL, NULL, '2026-03-08 10:30:00'),
(10, 7, NULL, NULL, '2026-03-08 10:35:00'),
(12, 7, NULL, NULL, '2026-03-08 10:40:00'),
(8, 8, '3-1', 'victoire', '2026-03-08 10:45:00'),
(10, 8, '1-3', 'defaite', '2026-03-08 10:50:00'),
(6, 10, NULL, NULL, '2026-03-08 11:05:00'),
(12, 11, NULL, NULL, '2026-03-08 11:15:00'),
(6, 13, NULL, NULL, '2026-03-08 11:50:00'),
(10, 13, NULL, NULL, '2026-03-08 11:55:00');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
