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
-- Table structure for table `administrateur`
--

DROP TABLE IF EXISTS `administrateur`;
CREATE TABLE IF NOT EXISTS `administrateur` (
  `num_user` int NOT NULL,
  `niveau_acces` enum('super_admin','moderateur') DEFAULT 'moderateur',
  PRIMARY KEY (`num_user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `administrateur`
--

INSERT INTO `administrateur` (`num_user`, `niveau_acces`) VALUES
(1, 'super_admin');

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
  `site_web` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`num_club`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `club`
--

INSERT INTO `club` (`num_club`, `nom`, `departement`, `telephone`, `email`, `adresse`, `ville`, `code_postal`, `date_creation`, `site_web`) VALUES
(1, 'AS Marseille Nord', 'Bouches-du-Rhône', '0491010101', 'contact@asmn.fr', '12 Rue des Sports', 'Marseille', '13001', '1995-09-01', NULL),
(2, 'FC Lyon Est', 'Rhône', '0472020202', 'contact@fcle.fr', '5 Avenue du Stade', 'Lyon', '69001', '2002-03-15', NULL),
(3, 'Sporting Paris Sud', 'Paris', '0143030303', 'contact@sps.fr', '88 Boulevard du Foot', 'Paris', '75013', '1988-06-20', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `coach`
--

DROP TABLE IF EXISTS `coach`;
CREATE TABLE IF NOT EXISTS `coach` (
  `num_user` int NOT NULL,
  `specialite` varchar(100) DEFAULT NULL,
  `diplome` varchar(100) DEFAULT NULL,
  `annees_experience` int DEFAULT '0',
  PRIMARY KEY (`num_user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `coach`
--

INSERT INTO `coach` (`num_user`, `specialite`, `diplome`, `annees_experience`) VALUES
(3, 'Attaque', 'UEFA B', 8),
(8, 'Défense', 'UEFA A', 12);

-- --------------------------------------------------------

--
-- Table structure for table `equipe`
--

DROP TABLE IF EXISTS `equipe`;
CREATE TABLE IF NOT EXISTS `equipe` (
  `num_equipe` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `categorie` enum('senior','junior','cadet','minime') NOT NULL,
  `num_club` int NOT NULL,
  `num_coach` int DEFAULT NULL,
  `date_creation` date DEFAULT NULL,
  `couleur_maillot` varchar(50) DEFAULT NULL,
  `nb_joueurs_max` int DEFAULT '25',
  PRIMARY KEY (`num_equipe`),
  KEY `num_club` (`num_club`),
  KEY `num_coach` (`num_coach`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `equipe`
--

INSERT INTO `equipe` (`num_equipe`, `nom`, `categorie`, `num_club`, `num_coach`, `date_creation`, `couleur_maillot`, `nb_joueurs_max`) VALUES
(1, 'AS Marseille Nord Seniors', 'senior', 1, 3, '2010-06-01', 'Bleu/Blanc', 25),
(2, 'FC Lyon Est Juniors', 'junior', 2, 8, '2015-03-10', 'Rouge/Blanc', 20),
(3, 'Sporting Paris Cadets', 'cadet', 3, NULL, '2018-09-01', 'Vert/Noir', 18);

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
  `capitaine` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`num_equipe`,`num_user`),
  KEY `num_user` (`num_user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `equipe_licencie`
--

INSERT INTO `equipe_licencie` (`num_equipe`, `num_user`, `date_integration`, `numero_maillot`, `capitaine`) VALUES
(1, 4, '2022-09-01', 9, 1),
(1, 5, '2023-01-15', 10, 0),
(2, 6, '2021-09-01', 4, 1),
(2, 7, '2022-06-01', 1, 0),
(3, 10, '2024-09-01', 7, 0);

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
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `type` enum('amateur','professionnel','jeune') NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `validee` tinyint(1) DEFAULT '0',
  `num_validateur` int DEFAULT NULL,
  `date_validation` datetime DEFAULT NULL,
  `montant_cotisation` decimal(8,2) DEFAULT NULL,
  PRIMARY KEY (`num_licence`),
  KEY `num_user` (`num_user`),
  KEY `num_validateur` (`num_validateur`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `licence`
--

INSERT INTO `licence` (`num_licence`, `num_user`, `type`, `date_debut`, `date_fin`, `validee`, `num_validateur`, `date_validation`, `montant_cotisation`) VALUES
(1, 4, 'amateur', '2024-09-01', '2025-08-31', 1, 1, '2024-09-03 10:00:00', 150.00),
(2, 5, 'amateur', '2024-09-01', '2025-08-31', 1, 1, '2024-09-03 10:30:00', 150.00),
(3, 6, 'professionnel', '2024-09-01', '2025-08-31', 1, 1, '2024-09-04 09:00:00', 300.00),
(4, 7, 'amateur', '2024-09-01', '2025-08-31', 0, NULL, NULL, 150.00),
(5, 10, 'jeune', '2024-09-01', '2025-08-31', 1, 1, '2024-09-05 11:00:00', 80.00),
(6, 4, 'amateur', '2023-09-01', '2024-08-31', 1, 1, '2023-09-02 14:00:00', 140.00);

-- --------------------------------------------------------

--
-- Table structure for table `licencie`
--

DROP TABLE IF EXISTS `licencie`;
CREATE TABLE IF NOT EXISTS `licencie` (
  `num_user` int NOT NULL,
  `statut` enum('actif','inactif','suspendu') NOT NULL DEFAULT 'actif',
  `num_club` int NOT NULL,
  `position` varchar(50) DEFAULT NULL,
  `poids_kg` decimal(5,2) DEFAULT NULL,
  `taille_cm` int DEFAULT NULL,
  `numero_securite_sociale` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`num_user`),
  KEY `num_club` (`num_club`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `licencie`
--

INSERT INTO `licencie` (`num_user`, `statut`, `num_club`, `position`, `poids_kg`, `taille_cm`, `numero_securite_sociale`) VALUES
(4, 'actif', 1, 'Attaquant', 72.50, 178, NULL),
(5, 'actif', 1, 'Milieu', 68.00, 175, NULL),
(6, 'actif', 2, 'Défenseur', 75.00, 182, NULL),
(7, 'suspendu', 2, 'Gardien', 80.00, 185, NULL),
(10, 'actif', 3, 'Attaquant', 65.50, 170, NULL);

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
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `participation`
--

INSERT INTO `participation` (`num_equipe`, `num_evenement`, `score`, `resultat`, `date_inscription`) VALUES
(1, 1, '2-1', 'victoire', '2026-03-04 00:38:25'),
(2, 1, '1-2', 'defaite', '2026-03-04 00:38:25'),
(1, 3, NULL, NULL, '2026-03-04 00:38:25'),
(2, 3, NULL, NULL, '2026-03-04 00:38:25'),
(3, 3, NULL, NULL, '2026-03-04 00:38:25'),
(1, 4, NULL, NULL, '2026-03-04 00:38:25'),
(2, 4, NULL, NULL, '2026-03-04 00:38:25');

-- --------------------------------------------------------

--
-- Table structure for table `responsableclub`
--

DROP TABLE IF EXISTS `responsableclub`;
CREATE TABLE IF NOT EXISTS `responsableclub` (
  `num_user` int NOT NULL,
  `num_club` int NOT NULL,
  `date_prise_poste` date DEFAULT NULL,
  PRIMARY KEY (`num_user`),
  KEY `num_club` (`num_club`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `responsableclub`
--

INSERT INTO `responsableclub` (`num_user`, `num_club`, `date_prise_poste`) VALUES
(2, 1, '2020-01-10'),
(9, 2, '2019-05-01');

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
  `role` enum('administrateur','responsable_club','coach','licencie') NOT NULL,
  `actif` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`num_user`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `utilisateur`
--

INSERT INTO `utilisateur` (`num_user`, `nom`, `prenom`, `email`, `mot_de_passe`, `telephone`, `date_naissance`, `date_inscription`, `role`, `actif`) VALUES
(1, 'Martin', 'Sophie', 'sophie.martin@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0601020304', '1985-03-12', '2026-03-04 00:38:24', 'administrateur', 1),
(2, 'Dupont', 'Pierre', 'pierre.dupont@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0602030405', '1978-07-22', '2026-03-04 00:38:24', 'responsable_club', 1),
(3, 'Bernard', 'Lucas', 'lucas.bernard@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0603040506', '1990-11-05', '2026-03-04 00:38:24', 'coach', 1),
(4, 'Leroy', 'Emma', 'emma.leroy@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0604050607', '1999-01-18', '2026-03-04 00:38:24', 'licencie', 1),
(5, 'Moreau', 'Hugo', 'hugo.moreau@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0605060708', '2001-06-30', '2026-03-04 00:38:24', 'licencie', 1),
(6, 'Petit', 'Chloé', 'chloe.petit@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0606070809', '2000-09-14', '2026-03-04 00:38:24', 'licencie', 1),
(7, 'Simon', 'Théo', 'theo.simon@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0607080910', '1998-04-02', '2026-03-04 00:38:24', 'licencie', 1),
(8, 'Laurent', 'Julie', 'julie.laurent@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0608091011', '1995-12-25', '2026-03-04 00:38:24', 'coach', 1),
(9, 'Michel', 'Antoine', 'antoine.michel@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0609101112', '1980-08-17', '2026-03-04 00:38:24', 'responsable_club', 1),
(10, 'Garcia', 'Nina', 'nina.garcia@email.fr', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '0610111213', '2003-02-28', '2026-03-04 00:38:24', 'licencie', 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
