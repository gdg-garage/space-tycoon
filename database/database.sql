-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.6.5-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for space_tycoon
DROP DATABASE IF EXISTS `space_tycoon`;
CREATE DATABASE IF NOT EXISTS `space_tycoon` /*!40100 DEFAULT CHARACTER SET utf8mb3 */;
USE `space_tycoon`;

-- Dumping structure for table space_tycoon.d_class
DROP TABLE IF EXISTS `d_class`;
CREATE TABLE IF NOT EXISTS `d_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` tinytext NOT NULL,
  `shipyard` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT 'allows constructing new ships',
  `speed` double NOT NULL,
  `cargo` int(11) NOT NULL COMMENT 'maximum allowed amount of resources loaded on the ship',
  `life` int(11) NOT NULL COMMENT 'maximum life for the ship',
  `regen` int(11) NOT NULL COMMENT 'amount of life restored passively every tick',
  `repair_life` int(11) NOT NULL COMMENT 'amount of life restored with the repair command every tick',
  `repair_price` int(11) NOT NULL COMMENT 'money required for repairing every tick',
  `damage` int(11) NOT NULL,
  `price` int(11) DEFAULT NULL COMMENT 'price to build new ship (also the value of the ship in score)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Index 2` (`name`(255)),
  CONSTRAINT `positive numbers` CHECK (`speed` >= 0 and `cargo` >= 0 and `life` > 0 and `regen` >= 0 and `repair_life` >= 0 and `repair_price` >= 0 and `damage` >= 0 and (`price` is null or `price` > 0)),
  CONSTRAINT `repair is faster than regen` CHECK (`repair_life` = 0 or `repair_life` >= 10 * `regen`),
  CONSTRAINT `repair is affordable` CHECK (`repair_price` = 0 or `price` is null or `life` * `repair_price` < `price` * `repair_life`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.d_class: ~7 rows (approximately)
/*!40000 ALTER TABLE `d_class` DISABLE KEYS */;
INSERT INTO `d_class` (`id`, `name`, `shipyard`, `speed`, `cargo`, `life`, `regen`, `repair_life`, `repair_price`, `damage`, `price`) VALUES
	(1, 'mothership', 'Y', 10, 0, 1000, 20, 200, 25000, 50, NULL),
	(2, 'hauler', 'N', 13, 200, 200, 3, 50, 25000, 0, 500000),
	(3, 'shipper', 'N', 18, 50, 100, 3, 50, 25000, 0, 300000),
	(4, 'fighter', 'N', 20, 0, 150, 3, 100, 50000, 15, 1500000),
	(5, 'bomber', 'N', 15, 0, 250, 3, 100, 50000, 30, 2000000),
	(6, 'destroyer', 'Y', 10, 0, 3000, 50, 500, 250000, 250, 42000000),
	(7, 'shipyard', 'Y', 10, 200, 1000, 20, 200, 50000, 0, 5000000);
/*!40000 ALTER TABLE `d_class` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.d_names
DROP TABLE IF EXISTS `d_names`;
CREATE TABLE IF NOT EXISTS `d_names` (
  `name` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.d_names: ~1 912 rows (approximately)
/*!40000 ALTER TABLE `d_names` DISABLE KEYS */;
INSERT INTO `d_names` (`name`) VALUES
	('177'),
	('4-X-Alpha-4'),
	('865'),
	('892 IV'),
	('Aaleen'),
	('Abadeen'),
	('Abafar'),
	('Abeir-Toril'),
	('Abregado-rae'),
	('Abydos'),
	('Acamar III'),
	('Adara'),
	('Adara II'),
	('Adarak Prime'),
	('Adelphous IV'),
	('Adigian Prime'),
	('Adipose 3'),
	('Adora'),
	('Aerodyne'),
	('Agalon Prime'),
	('Agamar'),
	('Agaron'),
	('Agora'),
	('Agosoria'),
	('Ahch-To'),
	('Akiva'),
	('Akrayde VII'),
	('Akritiri'),
	('Al Dhanab'),
	('Alaris'),
	('Alastria'),
	('Aldea'),
	('Aldebaran'),
	('Aldebaran III'),
	('Alderaan'),
	('Aldron IV'),
	('Alebran\'s'),
	('Alexandria'),
	('Alfava Metraxis'),
	('Algeron'),
	('Algitark'),
	('Algol'),
	('Alison'),
	('Alistair 3'),
	('Allosimanius Syneca'),
	('Alpha 177'),
	('Alpha Aradoni II'),
	('Alpha Caeli V'),
	('Alpha Canis One'),
	('Alpha Carinae V'),
	('Alpha Centauri'),
	('Alpha Centauri 3'),
	('Alpha Corvus'),
	('Alpha Majoris I'),
	('Alpha Moon'),
	('Alpha Onias III'),
	('Alpha Site'),
	('Alpha V'),
	('Altair'),
	('Altair III'),
	('Altair IV'),
	('Altair VI'),
	('Altec'),
	('Althrace'),
	('Altoor VII'),
	('Alvega'),
	('Alzarius'),
	('Alzoc III'),
	('Amanopia'),
	('Ambria'),
	('Amleth Prime'),
	('Amon Shek'),
	('Amra'),
	('Anagonia'),
	('Anara Prime'),
	('Anathema'),
	('Anaxes'),
	('Ando'),
	('Andor'),
	('Andoria'),
	('Androzani Major'),
	('Aneth'),
	('Angel One'),
	('Angosia III'),
	('Anima Persis'),
	('Anoat'),
	('Anoth'),
	('Antares IV'),
	('Antede III'),
	('Antos'),
	('Antos IV'),
	('Anura'),
	('Apalapucia'),
	('Apokolips'),
	('Apophis\'s training camp'),
	('AR-558'),
	('Aractus'),
	('Arakang VII'),
	('Arbelough'),
	('Arcadia'),
	('Arcateen V'),
	('Archanis IV'),
	('Archer IV'),
	('Archer\'s Planet'),
	('Archetryx'),
	('Arcturia'),
	('Arcturus'),
	('Arden'),
	('Ardena'),
	('Arfeliosogrefft'),
	('Argabuthon'),
	('Argelius II'),
	('Argolis'),
	('Argos'),
	('Argratha'),
	('Argus X'),
	('Arianus'),
	('Aridius'),
	('Arkad\'s'),
	('Arkania'),
	('Arkannis Major'),
	('Arkhan\'s'),
	('Arkheon'),
	('Arkintoofle Minor'),
	('Arlof IX'),
	('Armus IX'),
	('Arrakis'),
	('Arret'),
	('Artaris'),
	('Artisia'),
	('Artoro Galaxy'),
	('Asbleg'),
	('Aschen'),
	('Asgard'),
	('Ashalon V'),
	('Asteroid 1113B'),
	('Astra'),
	('Asuras'),
	('Asuria'),
	('Asylum Planet'),
	('Ataegina'),
	('Atalia VII, Atalia'),
	('Atar'),
	('Atbar Prime'),
	('Athos'),
	('Athos IV'),
	('Atollon'),
	('Atrea IV'),
	('Atrios'),
	('Audet IX'),
	('Augea'),
	('Aurore 510'),
	('Auros'),
	('Avalon'),
	('Avenal VII'),
	('Axanar'),
	('Axista Four'),
	('Azati Prime'),
	('Azure'),
	('B\'Saari II'),
	('B54c'),
	('Baal\'s outpost'),
	('Babel'),
	('Bajor'),
	('Bajor IX'),
	('Bajor VII'),
	('Bajor VIII'),
	('Bakura'),
	('Balhoon'),
	('Balisty'),
	('Balnab'),
	('Balut'),
	('Bandraginus 5'),
	('Bandril'),
	('Bane World'),
	('Banea'),
	('Barandiko'),
	('Barcelona'),
	('Barisa Prime'),
	('Barkon IV'),
	('Barradas III'),
	('Barson II'),
	('Bartledan'),
	('Barzan II'),
	('Battleworld'),
	('Batuu'),
	('Baydafarn'),
	('Beakkal'),
	('Bedrosia'),
	('Bel'),
	('Bela Tegeuse'),
	('Belannia II'),
	('Belannia IV'),
	('Belepheron'),
	('Belkan'),
	('Bellaphores'),
	('Bellatrix II'),
	('Belos'),
	('Belote'),
	('Belsa'),
	('Bentha'),
	('Benzar'),
	('Beranis III'),
	('Berengaria'),
	('Bernice 378'),
	('Bersallis III'),
	('Bespin'),
	('Bessan'),
	('Beta Agni II'),
	('Beta Antares'),
	('Beta III'),
	('Beta Moon'),
	('Beta Thorador'),
	('Beta Two'),
	('Beta XII-A'),
	('Betaline Kel'),
	('Betazed'),
	('Betelgeuse'),
	('Betelgeuse V'),
	('Betelgeuse VII'),
	('Bethselamin'),
	('Betrushia'),
	('BG-386'),
	('Biarek'),
	('Biblios'),
	('Bilana III'),
	('Binus'),
	('Bizarro World'),
	('Blagulon Kappa'),
	('Blenhorm Ogin'),
	('Blestinu'),
	('Blini-Gaar'),
	('Blior'),
	('Bliss'),
	('Blue Horizon'),
	('Bogano'),
	('Bokara VI'),
	('Bolaris'),
	('Bole'),
	('Bolias'),
	('Bonadan'),
	('Bonarcha Anarda'),
	('Bopac III'),
	('Boraal II'),
	('Boray'),
	('Borleias'),
	('Boromeo'),
	('Boroth'),
	('Bortresoye'),
	('Bosel Prime'),
	('Bouken'),
	('BP6-3Q1'),
	('Brabenso'),
	('Bracca'),
	('Bracken\'s World'),
	('Brax'),
	('Bre\'el IV'),
	('Breen'),
	('Brekka'),
	('Brentalya'),
	('Brontitall'),
	('Broop Kidron Thirteen'),
	('Browda IV'),
	('Brus'),
	('Bruydac'),
	('Bunda'),
	('Burala Prime'),
	('Burphon XII'),
	('Burrock\'s'),
	('Buzzell'),
	('Byss'),
	('C-3 L/M'),
	('Cairn'),
	('Cal Mah'),
	('Caladan'),
	('Calder II'),
	('Caldian Cluster, The'),
	('Caldik Prime'),
	('Caldonia'),
	('Caldos IV'),
	('Callinon VII'),
	('Calliopticon'),
	('Calpamos'),
	('Calufrax'),
	('Calufrax Minor'),
	('Camor V'),
	('Campa III'),
	('Camus II'),
	('Canamar'),
	('Cantonica'),
	('Capella IV'),
	('Cardassia'),
	('Cardassia III'),
	('Cardassia IV'),
	('Cardassia Prime'),
	('Cardassia V'),
	('Carida'),
	('Carraya IV'),
	('Carsus'),
	('Cartego'),
	('Casperia Prime'),
	('Cassius'),
	('Castel I'),
	('Castiana'),
	('Castilon'),
	('Castor 36'),
	('Castrovalva'),
	('Catastrophea'),
	('Cato Neimoidia'),
	('Catrigan Nova'),
	('Cedon'),
	('Celais V'),
	('Celek IV'),
	('Celeste'),
	('Celestial Belt Of The Winter Queen'),
	('Celestis'),
	('Celfala Prime'),
	('Celtris III'),
	('Centauri Seven'),
	('Cep Cassalon'),
	('Cerador'),
	('Cestus III'),
	('Ceti Alpha V'),
	('Ceti Alpha VI'),
	('Chalna'),
	('Chandra V'),
	('Chandrila'),
	('Chantil III'),
	('Chapterhouse'),
	('Charon 13'),
	('Chavic Five'),
	('Cheem'),
	('Cheetah Planet'),
	('Chelonia'),
	('Cheron'),
	('Chimera IV'),
	('Chimeria'),
	('Chin\'Toka III'),
	('Chloris'),
	('Choltok IV'),
	('Christophsis'),
	('Chronos'),
	('Chulak'),
	('Chusuk'),
	('Chya VII'),
	('Cilosos III'),
	('Cimmeria'),
	('Cinethon'),
	('City State of Binding Light'),
	('Clauvdia III'),
	('Clom'),
	('Cloverdale'),
	('Co\'rak'),
	('Colano Alpha'),
	('Colendia IV'),
	('Colla III'),
	('Collabria'),
	('Collactin'),
	('Concord Dawn'),
	('Corcoroli V'),
	('Corellia'),
	('Coridan'),
	('Corrin'),
	('Coruscant'),
	('Cosla II'),
	('Costalane'),
	('Cotter Palluni\'s World'),
	('Counterstrike'),
	('Crafe Tec Heydra'),
	('Crait'),
	('Crashdown'),
	('Cravic'),
	('Crespallion'),
	('Crinoth'),
	('Cristóbal'),
	('Crompton'),
	('Csilla'),
	('Cyberyne'),
	('Cygex'),
	('D\'Qar'),
	('Da Soocha V'),
	('Dagan'),
	('Dagmar Cluster'),
	('Dagobah'),
	('Dakara'),
	('Dakito'),
	('Daled IV'),
	('Damogran'),
	('Dangrabad Beta'),
	('Dantooine'),
	('Dar Eshkalon'),
	('Darbodia'),
	('Darillium'),
	('Darkheart'),
	('Darkover'),
	('Darp'),
	('Dathomir'),
	('Davlos III'),
	('Davlos Prime'),
	('Daxam'),
	('Dayas IV'),
	('Dazbog'),
	('Deanius III'),
	('Degos Prime'),
	('Deilos IV'),
	('Deinonychus VII'),
	('Dekendi III'),
	('Delb II'),
	('Delmak'),
	('Delphon'),
	('Delta 3'),
	('Delta IV'),
	('Delta Magna\''),
	('Delta Vega'),
	('Demon\'s Run'),
	('Deneb II'),
	('Deneb IV'),
	('Deneb V'),
	('Deneva'),
	('Deneva Station'),
	('Denoba Prime'),
	('Denobula'),
	('Deravin V'),
	('Desica II'),
	('Desperus'),
	('Deva Loka'),
	('Devaron'),
	('Devidia II'),
	('Devos II'),
	('Dhakan'),
	('Diadem'),
	('Dido'),
	('Dilicium IV'),
	('Dilula II'),
	('Dioscuros'),
	('Diplos'),
	('Discurus'),
	('Discworld'),
	('Ditalix B'),
	('Dorandan'),
	('Dorat I'),
	('Dorvan V'),
	('Dozaria'),
	('Dracana IV'),
	('Draconia'),
	('Drago IV'),
	('Dragon Star'),
	('Drahva'),
	('Draken IV'),
	('Drall'),
	('Dramos'),
	('Dravidia'),
	('Draxx'),
	('Drayan II'),
	('Draycon IV'),
	('Draylax'),
	('Draylon II'),
	('Drema IV'),
	('Dreon VII'),
	('Dromund Kaas'),
	('Dronid'),
	('Duchamp 331'),
	('Dulkis'),
	('Dur'),
	('Durna'),
	('Duronom'),
	('Dxun'),
	('Dæmos'),
	('E\'Ladarea'),
	('E-Space'),
	('Eadu'),
	('Earth'),
	('Ecaz'),
	('Eden'),
	('Edora'),
	('Edowin'),
	('Ego the Living Planet'),
	('Ekos'),
	('Eladril IV'),
	('Elas'),
	('Elba II'),
	('Eldred\'s'),
	('Emila II'),
	('Eminiar VII'),
	('Enan VI'),
	('Endo'),
	('Endor'),
	('Enfiel'),
	('Enkaran'),
	('Enlandia'),
	('Entak'),
	('Ephte Major'),
	('Eplar Prime'),
	('Epsilon Canarus IV'),
	('Epsilon Eridani IV'),
	('Epsilon Eridani VIII'),
	('Epsilon Four Zero Gamma'),
	('Epsilon Hydra VII'),
	('Erebus'),
	('Eroticon VI'),
	('Er´kit'),
	('Esseles'),
	('Esto'),
	('Eudamus'),
	('Euronda'),
	('Exarius'),
	('Excalabia'),
	('Exegol'),
	('Exo III'),
	('Exxilon'),
	('Eye of Orion'),
	('Fagiros'),
	('Fallia'),
	('Fantasia'),
	('Farias'),
	('Faynos'),
	('Felicity'),
	('Felspoon'),
	('Felucia'),
	('Fenea Prime'),
	('Ferenginar'),
	('Feris VI'),
	('Ferro'),
	('Filina III'),
	('Fiorina "Fury" 161'),
	('Fisar'),
	('Flane'),
	('Flargathon'),
	('Florana'),
	('Florrum'),
	('Fondor'),
	('Ford\'s outpost'),
	('Forkis III'),
	('Freehaven'),
	('Freytus'),
	('Frogstar World A'),
	('Frogstar World B'),
	('Frogstar World C'),
	('Frontios'),
	('G\'Natu V'),
	('Gaar'),
	('Gadmeer'),
	('Gagaran IV'),
	('Gagrakacka'),
	('Gaia'),
	('Gailen IV'),
	('Galador II'),
	('Galana'),
	('Galar'),
	('Galas II'),
	('Galaxis Bright'),
	('Galaxy 1489'),
	('Galaxy 4'),
	('Galaxy 7'),
	('Galaxy 9'),
	('Galdonterre'),
	('Galicia'),
	('Gallifrey'),
	('Galor IV'),
	('Galorda Prime'),
	('Galorndon Kor'),
	('Galsec Seven'),
	('Galt'),
	('Galvon Five'),
	('Gamalon V'),
	('Gamaras V'),
	('Game Preserve Planet'),
	('Gameworld Gamma'),
	('Gamma Canaris N'),
	('Gamma Hromi II'),
	('Gamma Hydra II'),
	('Gamma Hydra IV'),
	('Gamma II'),
	('Gamma Leporis B1'),
	('Gamma Leporis C2'),
	('Gamma Tauri IV'),
	('Gamma Trianguli VI'),
	('Gamma VII-A'),
	('Gammu'),
	('Gamont'),
	('Gansireed'),
	('Garadias IV'),
	('Garazone System'),
	('Garon II'),
	('Garon IV'),
	('Garushda'),
	('Gauda Prime'),
	('Gault'),
	('Gearon'),
	('Gedi Prime'),
	('Genalda IV'),
	('Genesis'),
	('Genii'),
	('Geonosis'),
	('Georgia 525'),
	('Germulon V'),
	('Gideon'),
	('Gidu'),
	('Giedi Prime'),
	('Gima IV'),
	('Gimeno'),
	('Ginaz'),
	('Glasson Minor'),
	('Gliese 581d'),
	('Gliese 581g'),
	('Gliese 581g.02'),
	('Gliese 667Cb'),
	('Gliese 667Cc'),
	('Gliese 667Cd'),
	('Gliese 876b'),
	('Gliese 876c'),
	('Gliese 876d'),
	('Golgafrincham'),
	('Golobus'),
	('Golos Prime'),
	('Gon-el IV'),
	('Gond Homeworld'),
	('Gor'),
	('Goralis'),
	('Gorin II'),
	('Goronak'),
	('Gostak'),
	('Grajick Major'),
	('Granados'),
	('Grått'),
	('Graves\' World'),
	('Griffoth'),
	('Griophos'),
	('Grivus'),
	('Grold Homeworld'),
	('Grolon'),
	('Groombridge 273-2A'),
	('Grumman'),
	('Grundle'),
	('Haakon'),
	('Hadante'),
	('Hagal'),
	('Hak\'tyl (I)'),
	('Hak\'tyl (II)'),
	('Hak\'tyl (III)'),
	('Hakol'),
	('Halcya'),
	('Halergan Three'),
	('Halla'),
	('Han Wavel'),
	('Hanka'),
	('Hapes'),
	('Happi-Werld III'),
	('Harmonthep'),
	('Harrakis V'),
	('Harrod IV'),
	('Harrok IV'),
	('Hasanova Data Solutions'),
	('Hastus Minor'),
	('HAT-P-13c'),
	('HAT-P-13cm'),
	('Hathor\'s'),
	('Hattoria'),
	('Haven, Beta Casius'),
	('Hawalius'),
	('HD 10697b'),
	('HD 10697bm'),
	('HD 202206b'),
	('HD 202206bm'),
	('HD 39091b'),
	('HD 39091bm'),
	('HD 85512b'),
	('HD 86264b'),
	('HD 86264bm'),
	('Heaven'),
	('Hebridan'),
	('Hedron'),
	('Heiradi'),
	('Heirata III'),
	('Hekaras II'),
	('Helene 215'),
	('Heliopolis'),
	('Hell'),
	('Hemakek IV'),
	('Hercoze III'),
	('Hercules Cluster'),
	('Hermethica'),
	('Hessra'),
	('Hilo'),
	('Hoff'),
	('Hogas II'),
	('Hokton VII'),
	('Holberg 917-G'),
	('Holna IV'),
	('Honoghr'),
	('Hosnian Prime'),
	('Hoth'),
	('Hottar II'),
	('House'),
	('Hurala'),
	('Hydropellica Hydroxi'),
	('Hyspero'),
	('Icarus'),
	('Icarus Prime'),
	('Iconia'),
	('Iego'),
	('Ilari'),
	('Ilum'),
	('Indigo 3'),
	('Indri VIII'),
	('Inferma Prime'),
	('Inivar Prime'),
	('Inter Minor'),
	('Inthara'),
	('Iotia'),
	('Iphitus'),
	('Iratin V'),
	('Iridonia'),
	('Ishia'),
	('Ishkal'),
	('Isis III'),
	('Islen'),
	('Ithor'),
	('IV Anbus'),
	('Ivadni IV'),
	('Ivor Prime'),
	('Ix'),
	('Izar'),
	('J\'t\'p\'tan'),
	('Jaconda'),
	('Jaforay II'),
	('Jaglan Beta'),
	('Jahoo'),
	('Jajazikstak'),
	('Jakku'),
	('Jalian 17'),
	('Jamala\'s'),
	('Jan Francis IX'),
	('Janus VI'),
	('Jebanna'),
	('Jedha'),
	('Jelucan'),
	('Jenev'),
	('Jericho 3'),
	('Jerido'),
	('Jestefad'),
	('Jikthroom Beta'),
	('Joliet'),
	('Joltrast 3'),
	('JPG-973c'),
	('Juna'),
	('Junction'),
	('Junk'),
	('Jupiter'),
	('Juri IV'),
	('Justicia'),
	('K 37 Gem 5'),
	('K\'Tau'),
	('Kabatris'),
	('Kafka IV'),
	('Kaitain'),
	('Kakrafoon Kappa'),
	('Kala'),
	('Kalakiki'),
	('Kalaya'),
	('Kaldor'),
	('Kaldra IV'),
	('Kaleb IV'),
	('Kallana'),
	('Kalon II'),
	('Kamino'),
	('Kanda IV'),
	('Kantare'),
	('Kantra'),
	('Kanval'),
	('Kapteyn 5'),
	('Kar-Charrat'),
	('Karas don Kazra don Slava'),
	('Karass Don Slava'),
	('Karfel'),
	('Karil Prime'),
	('Karn'),
	('Karris'),
	('Kas'),
	('Kashyyyk'),
	('Kasterborous'),
	('Kastopheria AKA Catastrophea'),
	('Kastria'),
	('Kataa Floko'),
	('Kataan'),
	('Katakiki'),
	('Katana'),
	('Katarrea VII'),
	('Katuria'),
	('Kavaria'),
	('Kavis Alpha IV'),
	('Kawlang'),
	('Keeair'),
	('Kef Bir'),
	('Kegron Pluva'),
	('Kelsid 3'),
	('Kelva'),
	('Kelvas Prime'),
	('Kelvas V'),
	('Kembel'),
	('Kendal II'),
	('Kentanna'),
	('Kepler-22b'),
	('Kerl'),
	('Kesek IV'),
	('Kesprit III'),
	('Kessel'),
	('Keto-Enol'),
	('Keturah\'s'),
	('KG-348'),
	('Kheb'),
	('Khitomer'),
	('Khomm'),
	('Khonsu\'s'),
	('Kijimi'),
	('Kinjana'),
	('Kirana III'),
	('Kirith'),
	('Klaestron IV'),
	('Klardia III'),
	('Klatus Prime'),
	('Klechton'),
	('Kling'),
	('KOI-2124.01'),
	('KOI-227.01'),
	('KOI-252.01'),
	('KOI-255.01'),
	('KOI-268.01'),
	('KOI-314.02'),
	('KOI-323.08'),
	('KOI-438.02'),
	('KOI-448.02'),
	('KOI-463.01'),
	('KOI-494.01'),
	('KOI-571.02'),
	('KOI-610.01'),
	('KOI-663.02'),
	('KOI-701'),
	('KOI-701.03'),
	('KOI-723.06'),
	('KOI-736.01'),
	('KOI-784.01'),
	('KOI-812.02'),
	('KOI-812.03'),
	('KOI-817.01'),
	('KOI-854.01'),
	('Kolandra'),
	('Kolarus III'),
	('Kolkokron'),
	('Koltair IV'),
	('Komider'),
	('Koorharn'),
	('Kora II'),
	('Koralis III'),
	('Korari'),
	('Korbin II'),
	('Korma'),
	('Korra\'s'),
	('Korriban'),
	('Korridon'),
	('Kosnax'),
	('Kotara Barath'),
	('Kothlis'),
	('Kreme'),
	('Kresalia'),
	('Kresh\'ta'),
	('Kria'),
	('Krikkit'),
	('Krillia'),
	('Krios'),
	('Krios Prime'),
	('Kripkin'),
	('Kronin'),
	('Kronos'),
	('Krontep'),
	('Krop Tor'),
	('Krypton'),
	('KS7-535'),
	('Kuat'),
	('Kyana Prime'),
	('Kylos'),
	('Kyrol'),
	('Ladonia III'),
	('Lagobus X'),
	('Lah\'mu'),
	('Lakertya'),
	('Lalya IV'),
	('Lambda Paz'),
	('Lampadas'),
	('Lamuella'),
	('Land of Light'),
	('Landris II'),
	('Langara'),
	('Lankiveil'),
	('Lantea'),
	('Lapa IV'),
	('Largo V'),
	('Larieshe IV'),
	('Latona'),
	('Lavoti V'),
	('Laylora'),
	('Layma II'),
	('Lazgar Beta'),
	('Leda\'s'),
	('Leela\'s World'),
	('Lelex'),
	('Leophantos'),
	('Lernaeus'),
	('Lesik Prime'),
	('Levithia'),
	('Ligon II'),
	('Lime'),
	('Limus 4'),
	('Linna 349'),
	('Livonia'),
	('Lizan\'s'),
	('Loam'),
	('Lobos'),
	('Logopolis'),
	('Lonsis'),
	('Loracus Prime'),
	('Loran III'),
	('Lothal'),
	('Lotho Minor'),
	('Loval'),
	('Lowitelom'),
	('LS VI'),
	('Lucien'),
	('Lucifer'),
	('Lucius\'s'),
	('Lunar V'),
	('Lunar V Base'),
	('Lurma'),
	('LV-1113'),
	('LV-1201'),
	('LV-187'),
	('LV-412'),
	('LV-418'),
	('LV-492'),
	('LV-742'),
	('LV-871'),
	('LV-895'),
	('LV-KR 115'),
	('Lvan'),
	('Lwhekk'),
	('Lyar'),
	('Lygos VII'),
	('Lysepia'),
	('Lysia'),
	('M-113'),
	('M1B-129'),
	('M1K-439'),
	('M1M-316'),
	('M35-117'),
	('M3R-428'),
	('M3X-387'),
	('M4C-862'),
	('M4D-058'),
	('M4H-212'),
	('M4X-337'),
	('M5S-224'),
	('M6H-491'),
	('M6R-867'),
	('M7G-677'),
	('M7R-227'),
	('M85-393'),
	('M8R-169'),
	('Ma\'chello\'s'),
	('Maarek III'),
	('Mab-Bu VI'),
	('Madillon Cluster'),
	('Madrona'),
	('Magellan'),
	('Magla'),
	('Magnus'),
	('Magrathea'),
	('Makus III'),
	('Malachor'),
	('Malastare'),
	('Malcassairo'),
	('Malena II'),
	('Malkor III'),
	('Malkshur'),
	('Malkus IX'),
	('Malon Prime'),
	('Malona IV'),
	('Manaria'),
	('Manussa'),
	('Map of the Water Snake Wormholes'),
	('Maranga IV'),
	('Maridun'),
	('Marinus'),
	('Mariposa'),
	('Markon'),
	('Markus II'),
	('Markus XII'),
	('Marlonia'),
	('Marloon'),
	('Marpesia'),
	('Mars'),
	('Martin\'s'),
	('Masar'),
	('Matalas'),
	('Mechanus'),
	('Medieval Christian'),
	('Medusa Cascade'),
	('Mekemus III'),
	('Melagophon'),
	('Melas II'),
	('Meldrar I'),
	('Melindy VII'),
	('Melissa Majoria'),
	('Melnos IV'),
	('Melvala IV'),
	('Memory Alpha'),
	('Mer'),
	('Merak II'),
	('Meridian'),
	('Meronat'),
	('Mesklin'),
	('Mesmerus'),
	('Messaline'),
	('Messier 13'),
	('Meta Sigmafolio'),
	('Meta Vorka 6'),
	('Metallurgis 5'),
	('Metazula Beta'),
	('Metebelis Three'),
	('Metralubit'),
	('Mettula Orionsis'),
	('Meudo V'),
	('Miasimia Goria'),
	('Mica'),
	('Micor'),
	('Midnight'),
	('Midsummer'),
	('Millica III'),
	('Mimas'),
	('Mimban'),
	('Minara'),
	('Minas V'),
	('Minis Prime'),
	('Minos'),
	('Mintaka III'),
	('Minyos'),
	('Mira'),
	('Mira Ceti 4'),
	('Mirabilis Major'),
	('Miradin'),
	('Miridian VI'),
	('Miros'),
	('Mitallus Prime'),
	('Mizan IV'),
	('Mizarr II'),
	('Moab IV'),
	('Mobox Homeworld'),
	('Mogar'),
	('Mogo'),
	('Mokra'),
	('Monak IV'),
	('Mondaran'),
	('Mondas'),
	('Mongo'),
	('Mordan IV'),
	('Morestra'),
	('Moria IV'),
	('Moricon VII'),
	('Morok'),
	('Mortis'),
	('Motinea'),
	('Muendella'),
	('Muscolane'),
	('Museum of the Last Ones'),
	('Mustafar'),
	('Muunilinst'),
	('Myarr'),
	('Mygeeto'),
	('Myrichri VII'),
	('Myrkr'),
	('Myssa 340'),
	('Mystara'),
	('N\'zoth'),
	('N-Space'),
	('Nabier'),
	('Naboo'),
	('Nal Hutta'),
	('Nanibia Prime'),
	('Nano'),
	('Naraj'),
	('Narendra III'),
	('Nassya'),
	('Nausicaa'),
	('Navaros'),
	('Nawme IV'),
	('Ne\'tu'),
	('Necros'),
	('Nefrin'),
	('Neinmen'),
	('Nell III'),
	('Nelvana III'),
	('Nem\'s'),
	('Nene 246'),
	('Neogorgon'),
	('Nephologia'),
	('Neptune'),
	('Nervala IV'),
	('Nessik'),
	('Neural'),
	('Nevarro'),
	('New Albion'),
	('New Alexandria'),
	('New Bajor'),
	('New Earth'),
	('New Eden'),
	('New Galveston'),
	('New Gaul'),
	('New Genesis'),
	('New Halana'),
	('New Lantea'),
	('New Savannah'),
	('New Sydney'),
	('New Venus'),
	('Neygor'),
	('Nibok'),
	('Nimbus III'),
	('Niushe'),
	('Nivalis-4'),
	('Nkllon'),
	('Nobelia Prime'),
	('Nooma'),
	('Norcadia Prime'),
	('Norellus'),
	('Norpin IV'),
	('Norpin V'),
	('Novebruns'),
	('NowWhat'),
	('Nox'),
	('Numidian Prime'),
	('Nyria III'),
	('Nyrruh 4'),
	('Oa'),
	('Obelisk'),
	('Oberon'),
	('Oblivion'),
	('Oceanis IV'),
	('Ockora'),
	('Oglaroon'),
	('Ogros'),
	('Ohniaka Three'),
	('Olesia'),
	('Olympus'),
	('Omecla III'),
	('Omega IV'),
	('Omega Mysterium'),
	('Omicron Ceti III'),
	('Omicron IV'),
	('Omicron Theta'),
	('Omphalos'),
	('Onara III'),
	('Onderon'),
	('One'),
	('Ophyicus III'),
	('Optrica'),
	('Oran'),
	('Oran\'taku'),
	('Orban'),
	('Ord Mantell'),
	('Orealius IX'),
	('Organia'),
	('Orhyis III'),
	('Origae-6'),
	('Orilla'),
	('Orin\'s'),
	('Orinda V'),
	('Orion'),
	('Orion III'),
	('Oryza'),
	('Oseidon'),
	('Oskerion'),
	('Osric\'s'),
	('Othalla'),
	('Othrys'),
	('Overod'),
	('P26-007'),
	('P2A-018'),
	('P2A-270'),
	('P2A-347'),
	('P2A-463'),
	('P2A-509'),
	('P2C-257'),
	('P2M-903'),
	('P2R-866'),
	('P2X-338'),
	('P2X-374'),
	('P2X-416'),
	('P2X-555'),
	('P2X-787'),
	('P2X-885'),
	('P2X-887'),
	('P3A-194'),
	('P3C-117'),
	('P3C-249'),
	('P3C-599'),
	('P3K-447'),
	('P3L-997'),
	('P3M-736'),
	('P3R-112'),
	('P3R-118'),
	('P3R-233'),
	('P3R-272'),
	('P3R-636'),
	('P3S-114'),
	('P3S-452'),
	('P3W-451'),
	('P3W-924'),
	('P3X-116'),
	('P3X-118'),
	('P3X-233'),
	('P3X-234'),
	('P3X-289'),
	('P3X-298'),
	('P3X-367'),
	('P3X-403'),
	('P3X-421'),
	('P3X-439'),
	('P3X-447'),
	('P3X-474'),
	('P3X-562'),
	('P3X-584'),
	('P3X-595'),
	('P3X-666'),
	('P3X-729'),
	('P3X-744'),
	('P3X-775'),
	('P3X-797'),
	('P3X-8596'),
	('P3X-888'),
	('P3X-984'),
	('P3X-989'),
	('P3Y-229'),
	('P3Y-294'),
	('P4A-771'),
	('P4C-452'),
	('P4C-970'),
	('P4F-221'),
	('P4G-881'),
	('P4M-328'),
	('P4M-399'),
	('P4M-523'),
	('P4S-161'),
	('P4S-237'),
	('P4S-559'),
	('P4X-131'),
	('P4X-233'),
	('P4X-347'),
	('P4X-351'),
	('P4X-636'),
	('P4X-639'),
	('P4X-650'),
	('P4X-884'),
	('P5C-353'),
	('P5C-629'),
	('P5C-768'),
	('P5R-357'),
	('P5S-117'),
	('P5S-381'),
	('P6G-452'),
	('P6J-908'),
	('P6Y-325'),
	('P7J-989'),
	('P7S-441'),
	('P7X-009'),
	('P7X-377'),
	('P89-534'),
	('P8F-809'),
	('P8T-365'),
	('P8T-474'),
	('P8X-362'),
	('P8X-412'),
	('P8X-873'),
	('P8X-987'),
	('P9C-882'),
	('P9G-844'),
	('P9J-333'),
	('P9Q-281'),
	('P9X-391'),
	('Paan Mokar'),
	('Pacifica'),
	('Padrivole Regency 9'),
	('Palomaar'),
	('Pandatorea'),
	('Pangar'),
	('Parada II'),
	('Parada IV'),
	('Paradost'),
	('Parakon'),
	('Parcion III'),
	('Parella'),
	('Parliament'),
	('Parmentier'),
	('PAS-A81'),
	('Pasaana'),
	('Pasiphony V'),
	('PCW9512'),
	('Peladon'),
	('Peliazel'),
	('Pellius V'),
	('Pen Haxico 2'),
	('Pendari'),
	('Penora'),
	('Pentarus II'),
	('Pentarus III'),
	('Pentarus V'),
	('Pentath III'),
	('Penthara IV'),
	('Perada II'),
	('Periboea'),
	('Pernaias Prime'),
	('Perseus Cluster'),
	('PGG-002'),
	('Phaester Osiris'),
	('Phendouse V'),
	('Pheros'),
	('Phobos'),
	('Pholar III'),
	('Phryxus'),
	('Phylox Series'),
	('Pictos'),
	('Pilargo'),
	('Pillio'),
	('Pincknon'),
	('Pirakis IV'),
	('PJ2-445'),
	('Planet 1'),
	('Planet 14'),
	('Planet 4'),
	('Planet X'),
	('Platonius'),
	('Pliny'),
	('Pluto'),
	('Poghril'),
	('POL-3191 Cc'),
	('POL-6362'),
	('Polarfrey'),
	('Polis Massa'),
	('Polloc V'),
	('Pollux IV'),
	('Polongus'),
	('Polymos'),
	('Ponciard'),
	('Ponton'),
	('Poosh'),
	('Poritrin'),
	('Portis V'),
	('Posikar'),
	('Pralor'),
	('Praxis'),
	('Preenos'),
	('Preliumtarn'),
	('Prima II'),
	('Prion System'),
	('Proamon'),
	('Proclarush'),
	('Proctol II'),
	('Proculus'),
	('Procyon V'),
	('Prophet\'s Landing'),
	('Proxima Centauri'),
	('Proxinia'),
	('Psi 2000'),
	('Psi Upsilon 3'),
	('Psi Upsilon 4'),
	('PT1-AA1'),
	('Pulsar'),
	('PWW-98C'),
	('PX1-767'),
	('PX3-595'),
	('PX3-808'),
	('PX3-989'),
	('PX7-377'),
	('PX7-455'),
	('PX7-941'),
	('PX9-757'),
	('PXY-887'),
	('Pylos'),
	('Pyris VII'),
	('Pyro Shika'),
	('Pyrovilia'),
	('Pythra V'),
	('Q'),
	('Quadra'),
	('Quadra Sigma III'),
	('Qualactin'),
	('Qualar II'),
	('Quarra'),
	('Quatal Prime'),
	('Quenor VII'),
	('Quinnis'),
	('Qward'),
	('Raaga'),
	('Rago Rago Five Six Rago'),
	('Rakhar'),
	('Rakkal'),
	('Rakosan'),
	('Ralafea'),
	('Ralltiir'),
	('Ramatis III'),
	('Ramazad'),
	('Rana IV'),
	('Ranx'),
	('Rattatak'),
	('Ravolox'),
	('Raxacoricofallapatorius'),
	('Raynas VI'),
	('Reblais Beta'),
	('Red Rocket Rising'),
	('Red Sky Lost'),
	('Reenol'),
	('Reese\'s'),
	('Refusis II'),
	('Regula'),
	('Regulak IV'),
	('Regulus'),
	('Regulus III'),
	('Regulus V'),
	('Reina VI'),
	('Reja Magnum'),
	('Rekok Saronia'),
	('Relicon'),
	('Relva VII'),
	('Remoura'),
	('Remus'),
	('Renditai'),
	('Renol VI'),
	('Retalia'),
	('Reticulus'),
	('Revanna'),
	('Rex Vox Jax'),
	('Rexel 4'),
	('Rexel Planetary Configuration'),
	('RF/C-16'),
	('Rha\'Duras'),
	('Ribos'),
	('Richese'),
	('Riesling'),
	('Rifta System'),
	('Riftan Five'),
	('Rigel Beta 5'),
	('Rigel Five'),
	('Rigel III'),
	('Rigel IV'),
	('Rigel V'),
	('Rigel VI'),
	('Rigel VII'),
	('Rigel X'),
	('Rigel XII'),
	('Rigley\'s Pleasure Planet'),
	('Rim'),
	('Rinabi'),
	('Rinax'),
	('Risa'),
	('Rishi'),
	('Rit'),
	('Riva Prime'),
	('Riverworld'),
	('RLW 1289'),
	('Roc'),
	('Rochanie III'),
	('Rodia'),
	('Rogue N.I.D.'),
	('Rolan'),
	('Romo'),
	('Romulus'),
	('Ros-Jal'),
	('Rosamond 6'),
	('Rossak'),
	('Roxborne Peninsula'),
	('Rua IV'),
	('Rubicun III'),
	('Rugosa'),
	('Runii'),
	('Rupert'),
	('Ruso V'),
	('Ruta 3'),
	('Ruta Magnum'),
	('Ruteeya IV'),
	('Ruusan'),
	('Ry\'leh'),
	('Ryloth'),
	('Ryushi'),
	('Ryvos V'),
	('S14'),
	('Sacorria'),
	('Sagitta XII'),
	('Sahal'),
	('Saint John'),
	('Salarius'),
	('Salazar VII'),
	('Saleucami'),
	('Salinia Prime'),
	('Salostophus'),
	('Salusa Secundus'),
	('Salva II'),
	('Salvak'),
	('San Helios'),
	('San Kaloon'),
	('Sant\'s World'),
	('Santiny'),
	('Santraginus V'),
	('Saquo-Pilia Hensha'),
	('Sargon IV'),
	('Sargos'),
	('Sarn'),
	('Sarona VIII'),
	('Sarpedion V'),
	('Sarpeidon'),
	('Sartorus'),
	('Sateda'),
	('Saturn'),
	('Saturnyne'),
	('Sava'),
	('Savareen'),
	('Scalos'),
	('Scalpor'),
	('Scarif'),
	('Scotia'),
	('Scrampus System'),
	('Scrantek'),
	('Sd\'maris'),
	('Seary IV'),
	('Seeba II'),
	('Segonax'),
	('Selenis'),
	('Selka'),
	('Selonia'),
	('Seltic III'),
	('Semboule'),
	('Sembu'),
	('Seneca'),
	('Sense-Sphere'),
	('Seprek'),
	('Septal Minor IV'),
	('Septimus III'),
	('Serenno'),
	('Serita'),
	('Serras-Dia'),
	('Sesefras Magna'),
	('Setlik III'),
	('Shada'),
	('Shadmoch'),
	('Shallacatop'),
	('Shallanna'),
	('Shan Shen'),
	('Shantella Prime'),
	('Shavadai'),
	('Sherman\'s Planet'),
	('Shili'),
	('Sicoura Prime'),
	('Sigma'),
	('Sigma Draconis III'),
	('Sigma Draconis IV'),
	('Sigma Draconis VI'),
	('Signa XIV'),
	('Sikarus'),
	('Sikun'),
	('Silfrax Galaxy'),
	('Simperia'),
	('Sinda Callesta'),
	('Siralos'),
	('Sireen'),
	('Sirius IV'),
	('Sirius V'),
	('Sissubo'),
	('Sizzle'),
	('Skaar'),
	('Skako Minor'),
	('Skaro'),
	('Skonnos'),
	('Skythra'),
	('Skythros'),
	('Snorgron'),
	('Sobras'),
	('Sodan'),
	('Sol 3'),
	('Solais V'),
	('Solano'),
	('Solarion IV'),
	('Solomons'),
	('Solos'),
	('Soltok IV'),
	('Sontar'),
	('Sorata IV'),
	('Sorgan'),
	('Sosha III'),
	('Souci'),
	('Soukara'),
	('Sphere 41'),
	('Spiridon'),
	('Splendurosa'),
	('Sqornshellous Zeta'),
	('Starfall'),
	('Starkiller Base'),
	('Starview'),
	('Stella Stora'),
	('Sto'),
	('Stormcage'),
	('Straleb'),
	('Strepto'),
	('Stricium'),
	('Striterax'),
	('Stug'),
	('Styrus IV'),
	('Subterrel'),
	('Sudaria'),
	('Sullust'),
	('Sunday'),
	('Surier 430'),
	('Suven IV'),
	('Svartos'),
	('Sycorax'),
	('Sylvaniar'),
	('Synchrony'),
	('Szabo'),
	('T\'Kar'),
	('T\'Khut'),
	('T\'Lani III'),
	('T\'Lani Prime'),
	('Ta'),
	('Tagra IV'),
	('Tagrea'),
	('Takara'),
	('Takodana'),
	('Talax'),
	('Talos IV'),
	('Talthus'),
	('Tanaka 5'),
	('Tandar Prime'),
	('Tanika IV'),
	('Tantalus Five'),
	('Taoth Vaclarush'),
	('Tara'),
	('Tarahell'),
	('Taranis'),
	('Tarella'),
	('Taresia'),
	('Tarkalea'),
	('Tarsius'),
	('Tarsus IV'),
	('Tartarus'),
	('Tasus III'),
	('Tataris V'),
	('Tatooine'),
	('Tau Alpha-C'),
	('Tau Ceti III'),
	('Tau Cigna V'),
	('Tau Seeki Prime'),
	('Taurean Nomeworld'),
	('Taurus Ceti IV'),
	('Taurus II'),
	('Taurus III'),
	('Tavila Minor'),
	('Taygus III'),
	('Tazna V'),
	('Teerza Prime'),
	('Tegalus'),
	('Tellar'),
	('Tellar Prime'),
	('Tellaridian IV'),
	('Telos'),
	('Tenten 10'),
	('Terileptus'),
	('Terlina III'),
	('Terminus'),
	('Terok'),
	('Terosa Prime'),
	('Terra'),
	('Terra Alpha'),
	('Terra Beta'),
	('Terradon'),
	('TerraForm 3'),
	('Tersurus'),
	('Tesnia'),
	('Tessen III'),
	('Tessik Prime'),
	('Teth'),
	('Tethis III'),
	('Tetrapyriarbus'),
	('Tevaris\'s'),
	('Thala VII'),
	('Thän'),
	('Thanatos VII'),
	('Thasus'),
	('The Carra System'),
	('The Fifth Planet'),
	('The Inokshi System'),
	('The Library'),
	('The Lost Moon of Poosh'),
	('The Slough'),
	('Thedus'),
	('Thegeros'),
	('Thelca IV'),
	('Thera'),
	('Therka'),
	('Therra'),
	('Theta VII'),
	('Theta VIII'),
	('Theydat IV'),
	('Tholia'),
	('Thordon'),
	('Thoros Alpha'),
	('Thrace'),
	('Thuron'),
	('Thyferra'),
	('Ti\'Acor'),
	('Tiarchanon III'),
	('Tiburon'),
	('Tichenor'),
	('Tientsin'),
	('Tiermann\'s World'),
	('Tigella'),
	('Tigus'),
	('Tilonus IV'),
	('Tirgu-Mires'),
	('Tisar'),
	('Titan'),
	('Titan 3'),
	('Titania'),
	('Titus IV'),
	('Tivoli'),
	('Tleilax'),
	('Tobin'),
	('Tobin III'),
	('Tokl'),
	('Tollan'),
	('Tollana'),
	('Toop'),
	('Toprawa'),
	('Torad V'),
	('Torajii'),
	('Torajii Alpha'),
	('Torga IV'),
	('Torin Prime'),
	('Tormin V'),
	('Torna IV'),
	('Toydaria'),
	('Traal'),
	('Tracon II'),
	('Traken'),
	('Trandosha'),
	('Tranquela'),
	('Trebus'),
	('Trelka V'),
	('Trelkis III'),
	('Trenzalore'),
	('Triacus'),
	('Trianius Prime'),
	('Triannon'),
	('Trieste'),
	('Trill'),
	('Trillious Prime'),
	('Trion'),
	('Triskelion'),
	('Triton'),
	('Troyius'),
	('Tupile'),
	('Turakus'),
	('Turkana IV'),
	('Tycho IV'),
	('Tyra VII-A'),
	('Tyree'),
	('Tythonus'),
	('Ubea'),
	('Udala Prime'),
	('Ularda'),
	('Ultima Thul'),
	('Umbara'),
	('Umbeka'),
	('Umith VIII'),
	('Unicepter IV'),
	('Unidentified Moon'),
	('Uranus'),
	('Urbanka'),
	('Ursa Minor Beta'),
	('Urtea II'),
	('Usurius'),
	('Utapau'),
	('Utopia'),
	('Utopian'),
	('UX-4732'),
	('Uxarieus'),
	('Vacca VI'),
	('Vagonbrei'),
	('Vagra II'),
	('Vagris III'),
	('Vahiden Horizon'),
	('Valakis'),
	('Valo I'),
	('Valo II'),
	('Valo III'),
	('Valon'),
	('Valos Cor'),
	('Valt Minor'),
	('Vampire Planet'),
	('Vando VI'),
	('Vandor-1'),
	('Vandos'),
	('Vandros IV'),
	('Var'),
	('Vardon'),
	('Vardos'),
	('Varnicon'),
	('Varos'),
	('Vasilip'),
	('Vectar'),
	('Vega 4'),
	('Vega IX'),
	('Vega Reticuli'),
	('Vel Consadine'),
	('Velara III'),
	('Velona'),
	('Velos Prime'),
	('Velos VII'),
	('Vendikar'),
	('Venessia'),
	('Ventax II'),
	('Venus'),
	('Ver Omesh'),
	('Verd'),
	('Verex III'),
	('Veridian III'),
	('Veridian IV'),
	('Verticulus'),
	('Vertree Colony'),
	('Veturia'),
	('Vij'),
	('Viko V'),
	('Vilmora II'),
	('Viltvodle VI'),
	('Viperon'),
	('Vis Uban'),
	('Vita 15'),
	('Voga'),
	('Vogsphere'),
	('Volag-Noc'),
	('Volchek Prime'),
	('Volia'),
	('Vollotha'),
	('Volon II'),
	('Volon III'),
	('Voracia'),
	('Vorala'),
	('Vorash'),
	('Vortex'),
	('Vortis'),
	('Vulcan'),
	('Vulpana'),
	('Vyus'),
	('Walgis'),
	('Wallach IX'),
	('Wallach VI'),
	('Wallach VII'),
	('Water'),
	('Wayland'),
	('Weytahn'),
	('Wilson 1'),
	('Wobani'),
	('Woldyhool'),
	('Woman Wept'),
	('Wraith'),
	('Wrea'),
	('Xandar'),
	('Xantoras'),
	('Xarem'),
	('Xaxrax Sigma'),
	('Xenomorph Prime'),
	('Xenon'),
	('Xeriphas'),
	('Xeros'),
	('Xuttah'),
	('Yadera Prime'),
	('Yardin'),
	('Yautja Prime'),
	('Yavin'),
	('Yavin 4'),
	('Yegros Alpha'),
	('Yonada'),
	('Yondair system'),
	('Yu\'s'),
	('Zaakros'),
	('Zaddik\'s'),
	('Zagreus'),
	('Zalcon'),
	('Zamper'),
	('Zanak'),
	('Zanbar'),
	('Zanovar'),
	('Zazz'),
	('Zeen 4'),
	('Zeffo'),
	('Zen Corner'),
	('Zeon'),
	('Zeos'),
	('Zephon'),
	('Zeta Alpha II'),
	('Zeta Major'),
	('Zeta Minor'),
	('Zil'),
	('Zolfa Thura'),
	('Zom'),
	('Zonama Sekot'),
	('Zygerria'),
	('Zygor');
/*!40000 ALTER TABLE `d_names` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.d_resource
DROP TABLE IF EXISTS `d_resource`;
CREATE TABLE IF NOT EXISTS `d_resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` tinytext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Index 2` (`name`(255))
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.d_resource: ~23 rows (approximately)
/*!40000 ALTER TABLE `d_resource` DISABLE KEYS */;
INSERT INTO `d_resource` (`id`, `name`) VALUES
	(1, 'Spice Melange'),
	(2, 'Kyber Crystals For Red Sabers'),
	(3, 'Collective Hive Mind Thougts'),
	(4, 'Intellectual Property Rights'),
	(5, 'Pokéballs'),
	(6, 'Human Body Replacement Parts'),
	(7, 'Significant Other\'s Barks'),
	(8, 'Parallel Timelines'),
	(9, 'Sex Toys'),
	(10, 'Puppies & Kittens'),
	(11, 'Internet Memes'),
	(12, 'Memories of Ancient Earth'),
	(13, 'T-virus Samples'),
	(14, 'Super Hero Landings'),
	(15, 'Forbidden Knowledge Scrolls'),
	(16, 'Powerful Psychic Abilities'),
	(17, 'Shadow of Your Future Pasts'),
	(18, 'The Things That Must Not Be Named'),
	(19, 'Galaxies (Size Does Not Matter)'),
	(20, 'Nazi Scalps'),
	(21, 'Toilet Paper Rolls'),
	(22, 'NFT'),
	(23, 'Comic Magazine Critiques');
/*!40000 ALTER TABLE `d_resource` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.d_user
DROP TABLE IF EXISTS `d_user`;
CREATE TABLE IF NOT EXISTS `d_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` tinytext NOT NULL,
  `password` tinytext DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`(255)) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.d_user: ~0 rows (approximately)
/*!40000 ALTER TABLE `d_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `d_user` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.d_user_score
DROP TABLE IF EXISTS `d_user_score`;
CREATE TABLE IF NOT EXISTS `d_user_score` (
  `season` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  PRIMARY KEY (`season`,`user`),
  KEY `FK_d_user_score_d_user` (`user`),
  CONSTRAINT `FK_d_user_score_d_user` FOREIGN KEY (`user`) REFERENCES `d_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.d_user_score: ~0 rows (approximately)
/*!40000 ALTER TABLE `d_user_score` DISABLE KEYS */;
/*!40000 ALTER TABLE `d_user_score` ENABLE KEYS */;

-- Dumping structure for event space_tycoon.e_update_all
DROP EVENT IF EXISTS `e_update_all`;
DELIMITER //
CREATE EVENT `e_update_all` ON SCHEDULE EVERY 1 SECOND STARTS '2022-02-21 17:33:03' ON COMPLETION PRESERVE ENABLE DO BEGIN
CALL p_update_all;
END//
DELIMITER ;

-- Dumping structure for function space_tycoon.f_distance
DROP FUNCTION IF EXISTS `f_distance`;
DELIMITER //
CREATE FUNCTION `f_distance`(`id_a` INT,
	`id_b` INT
) RETURNS int(11)
    READS SQL DATA
    SQL SECURITY INVOKER
BEGIN
DECLARE res INT;
SELECT CEIL(SQRT(f_sqr(a.pos_x - b.pos_x) + f_sqr(a.pos_y - b.pos_y))) INTO res FROM t_object AS a JOIN t_object AS b WHERE a.id = id_a AND b.id = id_b;
RETURN res;
END//
DELIMITER ;

-- Dumping structure for function space_tycoon.f_sqr
DROP FUNCTION IF EXISTS `f_sqr`;
DELIMITER //
CREATE FUNCTION `f_sqr`(`a` INT
) RETURNS int(11)
    NO SQL
    DETERMINISTIC
    SQL SECURITY INVOKER
BEGIN
RETURN a * a;
END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_clear_all
DROP PROCEDURE IF EXISTS `p_clear_all`;
DELIMITER //
CREATE PROCEDURE `p_clear_all`()
    SQL SECURITY INVOKER
    COMMENT 'deletes all data from all runtime tables - used when starting a new season'
BEGIN

DELETE FROM t_report_resource_price;
DELETE FROM t_report_player_score;
DELETE FROM t_report_timing;
DELETE FROM t_report_combat;
DELETE FROM t_report_trade;
DELETE FROM t_commodity;
DELETE FROM t_price;
DELETE FROM t_recipe;
DELETE FROM t_planet;
DELETE FROM t_command;
DELETE FROM t_ship;
DELETE FROM t_object;
DELETE FROM t_player;

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_generate_planets
DROP PROCEDURE IF EXISTS `p_generate_planets`;
DELIMITER //
CREATE PROCEDURE `p_generate_planets`()
    SQL SECURITY INVOKER
BEGIN

DECLARE num_stars INT;
DECLARE star_index INT;
DECLARE num_planets INT;
DECLARE planet_index INT;
DECLARE name_index INT;
DECLARE star_a FLOAT;
DECLARE star_d FLOAT;
DECLARE star_x INT;
DECLARE star_y INT;
DECLARE planet_a FLOAT;
DECLARE planet_d FLOAT;
DECLARE planet_x INT;
DECLARE planet_y INT;
DECLARE planets_rot FLOAT;
DECLARE id INT;

DROP TEMPORARY TABLE IF EXISTS t_planet_names;
CREATE TEMPORARY TABLE t_planet_names
SELECT name FROM d_names
ORDER BY RAND();

SET num_stars = RAND() * 50 + 75; # average at 100
SET star_index = 0;
SET name_index = 0;

WHILE star_index < num_stars DO
	SET star_a = RAND() * 2 * PI();
	SET star_d = (1 - RAND() * RAND()) * 1000 + 250; # average at 1000
	SET star_x = COS(star_a) * star_d;
	SET star_y = SIN(star_a) * star_d;
	SET num_planets = RAND() * RAND() * 8 + 2; # average at 4
	set planets_rot = RAND() * 2 * PI();
	SET planet_index = 0;
	WHILE planet_index < num_planets DO
		SET planet_a = planets_rot + cast(planet_index as float) / num_planets * 2 * PI() + RAND();
		SET planet_d = (1 - RAND() * RAND()) * 20 + 20; # average at 35
		SET planet_x = star_x + COS(planet_a) * planet_d;
		SET planet_y = star_y + SIN(planet_a) * planet_d;
		INSERT INTO t_object (name, pos_x, pos_y) VALUES ((SELECT name FROM t_planet_names LIMIT 1 OFFSET name_index), planet_x, planet_y);
		SET id = LAST_INSERT_ID();
		INSERT INTO t_planet (id) VALUES (id);
		SET planet_index = planet_index + 1;
		SET name_index = name_index + 1;
	END WHILE;
	SET star_index = star_index + 1;
END WHILE;

UPDATE t_object SET pos_x_prev = pos_x, pos_y_prev = pos_y;

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_generate_prices
DROP PROCEDURE IF EXISTS `p_generate_prices`;
DELIMITER //
CREATE PROCEDURE `p_generate_prices`()
    SQL SECURITY INVOKER
BEGIN

DELETE FROM t_price;

DROP TEMPORARY TABLE IF EXISTS t_price_supply_demand;
CREATE TEMPORARY TABLE t_price_supply_demand
(PRIMARY KEY(resource))
SELECT resource, SUM(if(production > 0, production, 0)) AS supply, SUM(if(production < 0, -production, 0)) AS demand, SUM(ABS(production)) * 0.5 AS volume
FROM t_recipe GROUP BY resource;

DROP TEMPORARY TABLE IF EXISTS t_price_supply_demand_avg;
CREATE TEMPORARY TABLE t_price_supply_demand_avg
SELECT AVG(supply) AS supply_avg, AVG(demand) AS demand_avg, AVG(volume) AS volume_avg
FROM t_price_supply_demand;

DROP TEMPORARY TABLE IF EXISTS t_price_planet_resource_weight;
CREATE TEMPORARY TABLE t_price_planet_resource_weight
(INDEX(planet), INDEX(resource), PRIMARY KEY(planet, resource))
SELECT a.planet, a.resource,
ABS(a.production) * SUM(SIGN(a.production) = SIGN(b.production)) / SUM(if(SIGN(a.production) = SIGN(b.production), ABS(b.production), 0)) AS weight
FROM t_recipe AS a
JOIN t_recipe AS b USING(planet)
GROUP BY a.planet, a.resource;

INSERT INTO t_price (planet, resource, buy, sell)
SELECT planet, resource,
if(production > 0, 100 * demand / supply / weight * demand_avg / supply_avg, NULL),
if(production < 0, 100 * demand / supply * weight, NULL)
FROM t_recipe
JOIN t_price_planet_resource_weight USING(planet, resource)
JOIN t_price_supply_demand USING(resource)
JOIN t_price_supply_demand_avg;

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_generate_random_players
DROP PROCEDURE IF EXISTS `p_generate_random_players`;
DELIMITER //
CREATE PROCEDURE `p_generate_random_players`()
    SQL SECURITY INVOKER
BEGIN

DECLARE player_count INT;
DECLARE player_index INT;
DECLARE player_id INT;
DECLARE player_x INT;
DECLARE player_y INT;
DECLARE ship_count INT;
DECLARE ship_index INT;
DECLARE ship_id INT;

DELETE FROM d_user_score;
DELETE FROM d_user;
INSERT INTO d_user (name) VALUES ("tamagochi"), ("hu"), ("spaceman"), ("minecraft"), ("dragonborn");

SET player_count = RAND() * 5 + 5;
SET player_index = 0;
WHILE player_index < player_count DO
	SET player_x = (RAND() - 0.5) * 3000;
	SET player_y = (RAND() - 0.5) * 3000;
	INSERT INTO t_player (name, user, money) VALUES (CONCAT('AI-', player_index), (SELECT id FROM d_user ORDER BY RAND() LIMIT 1), RAND() * 10000000 + 10000);
	SET player_id = LAST_INSERT_ID();
	SET ship_count = RAND() * 20 + 40;
	SET ship_index = 0;
	WHILE ship_index < ship_count DO
		INSERT INTO t_object (owner, name, pos_x, pos_y) VALUES (player_id, CONCAT('AI-', player_index, '-', ship_index), player_x, player_y);
		SET ship_id = LAST_INSERT_ID();
		INSERT INTO t_ship (id, class, life) VALUES (ship_id, (SELECT id FROM d_class ORDER BY RAND() LIMIT 1), 0);
		SET ship_index = ship_index + 1;
	END WHILE;
	SET player_index = player_index + 1;
END WHILE;

UPDATE t_ship JOIN d_class ON d_class.id = t_ship.class SET t_ship.life = d_class.life;

INSERT IGNORE INTO t_command (ship, type, target)
SELECT a.id, 'attack', (SELECT c.id FROM t_ship AS c JOIN t_object AS d ON d.id = c.id WHERE d.owner <> b.owner ORDER BY RAND() LIMIT 1)
FROM t_ship AS a
JOIN t_object AS b ON b.id = a.id
JOIN d_class ON d_class.id = a.class
WHERE d_class.damage > 0;

INSERT INTO t_command (ship, type, target, resource, amount)
SELECT t_ship.id, 'trade', (SELECT id FROM t_planet ORDER BY RAND() LIMIT 1), (SELECT id FROM d_resource ORDER BY RAND() LIMIT 1), RAND() * 10 + 5
FROM t_ship
JOIN d_class ON d_class.id = t_ship.class
WHERE d_class.damage = 0
ORDER BY RAND();

UPDATE t_object SET pos_x_prev = pos_x, pos_y_prev = pos_y;

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_generate_resources
DROP PROCEDURE IF EXISTS `p_generate_resources`;
DELIMITER //
CREATE PROCEDURE `p_generate_resources`()
    SQL SECURITY INVOKER
BEGIN

DROP TEMPORARY TABLE IF EXISTS t_factory;
CREATE TEMPORARY TABLE t_factory
(id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id))
SELECT NULL AS id
FROM d_resource AS a
JOIN d_resource AS b;

DROP TEMPORARY TABLE IF EXISTS t_factory_recipe;
CREATE TEMPORARY TABLE t_factory_recipe
(factory INT NOT NULL, resource INT NOT NULL, production INT NOT NULL, INDEX(factory), INDEX(resource), PRIMARY KEY(factory, resource))
SELECT t_factory.id AS factory, d_resource.id AS resource, (RAND() * RAND() * 100 + 5) * if(RAND() < 0.45, -1, 1) AS production
FROM t_factory
JOIN d_resource
WHERE RAND() < 0.1;

DELETE FROM t_factory
WHERE id IN (
SELECT t_factory.id
FROM t_factory
LEFT JOIN t_factory_recipe ON t_factory_recipe.factory = t_factory.id
GROUP BY t_factory.id
HAVING SUM(if(t_factory_recipe.production < 0, 1, 0)) = 0 OR SUM(if(t_factory_recipe.production > 0, 1, 0)) = 0
);

DROP TEMPORARY TABLE IF EXISTS t_planet_factory;
CREATE TEMPORARY TABLE t_planet_factory
(INDEX(planet), INDEX(factory))
SELECT t_planet.id AS planet, (SELECT id FROM t_factory ORDER BY RAND() LIMIT 1) AS factory
FROM t_planet;

INSERT INTO t_recipe (planet, resource, production)
SELECT t_planet.id, t_factory_recipe.resource, t_factory_recipe.production * (RAND() + 1)
FROM t_planet
JOIN t_planet_factory ON t_planet_factory.planet = t_planet.id
JOIN t_factory_recipe ON t_factory_recipe.factory = t_planet_factory.factory;

INSERT INTO t_commodity (object, resource, amount)
SELECT t_planet.id, t_recipe.resource, t_recipe.production * (RAND() * 10 + 1)
FROM t_planet
JOIN t_recipe ON t_recipe.planet = t_planet.id
WHERE production > 0;

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_move_ships
DROP PROCEDURE IF EXISTS `p_move_ships`;
DELIMITER //
CREATE PROCEDURE `p_move_ships`()
    SQL SECURITY INVOKER
BEGIN

UPDATE t_object SET pos_x_prev = pos_x, pos_y_prev = pos_y;

DROP TEMPORARY TABLE IF EXISTS t_ship_moves;
CREATE TEMPORARY TABLE t_ship_moves
(PRIMARY KEY(id))
SELECT t_ship.id, tgt.pos_x - cur.pos_x AS dx, tgt.pos_y - cur.pos_y AS dy, d_class.speed
FROM t_ship
JOIN d_class ON d_class.id = t_ship.class
JOIN t_object AS cur ON cur.id = t_ship.id
JOIN t_command ON t_command.ship = t_ship.id
JOIN t_object AS tgt ON tgt.id = t_command.target
HAVING dx != 0 OR dy != 0;

UPDATE t_ship_moves SET speed = LEAST(speed / SQRT(f_sqr(dx) + f_sqr(dy)), 1), dx = dx * speed, dy = dy * speed;

UPDATE t_object JOIN t_ship_moves USING(id) SET pos_x = pos_x + dx, pos_y = pos_y + dy;

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_process_attacks
DROP PROCEDURE IF EXISTS `p_process_attacks`;
DELIMITER //
CREATE PROCEDURE `p_process_attacks`()
    SQL SECURITY INVOKER
BEGIN

DROP TEMPORARY TABLE IF EXISTS t_ship_attacks;
CREATE TEMPORARY TABLE t_ship_attacks
(INDEX(attacker), INDEX(defender))
SELECT t_command.ship AS attacker, t_command.target AS defender
FROM t_command
JOIN t_object AS a ON a.id = t_command.ship
JOIN t_object AS b ON b.id = t_command.target
WHERE t_command.type = 'attack' AND ((a.pos_x = b.pos_x AND a.pos_y = b.pos_y) OR (a.pos_x = b.pos_x_prev AND a.pos_y = b.pos_y_prev));

DROP TEMPORARY TABLE IF EXISTS t_ship_damages;
CREATE TEMPORARY TABLE t_ship_damages
(PRIMARY KEY(ship))
SELECT defender AS ship, SUM(damage) AS damage
FROM t_ship_attacks
JOIN t_ship ON t_ship.id = t_ship_attacks.attacker
JOIN d_class ON d_class.id = t_ship.class
GROUP BY defender;

INSERT INTO t_report_combat (tick, attacker, defender, killed)
SELECT (SELECT tick FROM t_game), attacker, defender, if(damage >= life, 'Y', 'N')
FROM t_ship_attacks
JOIN t_ship_damages ON t_ship_damages.ship = t_ship_attacks.defender
JOIN t_ship ON t_ship.id = t_ship_attacks.defender;

UPDATE t_ship JOIN t_ship_damages ON t_ship_damages.ship = t_ship.id SET life = GREATEST(life - damage, 0);

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_process_constructions
DROP PROCEDURE IF EXISTS `p_process_constructions`;
DELIMITER //
CREATE PROCEDURE `p_process_constructions`()
    SQL SECURITY INVOKER
BEGIN

DECLARE n INT DEFAULT 0;
DECLARE i INT DEFAULT 0;
DECLARE id INT;

# pick suitable construction commands
DROP TEMPORARY TABLE IF EXISTS t_constructions;
CREATE TEMPORARY TABLE t_constructions
(PRIMARY KEY(ship), INDEX(player))
SELECT t_command.ship, t_object.owner AS player, t_command.class, nc.price
FROM t_command
JOIN t_ship ON t_ship.id = t_command.ship
JOIN t_object ON t_object.id = t_command.ship
JOIN d_class AS cc ON cc.id = t_ship.class
JOIN d_class AS nc ON nc.id = t_command.class
WHERE t_command.`type` = 'construct' AND cc.shipyard = 'Y' AND nc.price IS NOT NULL;

# players with insufficient money shall construct no ships
DELETE a
FROM t_constructions AS a
WHERE a.player IN
(
	SELECT player FROM
	(
		SELECT b.player, t_player.money
		FROM t_constructions AS b
		JOIN t_player ON t_player.id = b.player
		GROUP BY t_player.id
		HAVING SUM(b.price) > t_player.money
	) AS subquery
);

# subtract players money
UPDATE t_player
SET t_player.money = t_player.money - IFNULL(
(
	SELECT SUM(t_constructions.price)
	FROM t_constructions
	WHERE t_constructions.player = t_player.id
), 0);

# create ships, one by one, so that the auto-incremented t_object.id can be used to insert into t_ship
SELECT COUNT(*) INTO n FROM t_constructions;
WHILE i < n DO
	INSERT INTO t_object (owner, pos_x, pos_y, pos_x_prev, pos_y_prev)
	SELECT t_object.owner, pos_x, pos_y, pos_x, pos_y
	FROM t_constructions
	JOIN t_object ON t_object.id = t_constructions.ship
	LIMIT i,1;
	SET id = LAST_INSERT_ID();
	INSERT INTO t_ship (id, class, life)
	SELECT id, t_constructions.class, d_class.life
	FROM t_constructions
	JOIN d_class ON d_class.id = t_constructions.class
	LIMIT i,1;
	SET i = i + 1;
END WHILE;

# delete fulfilled commands
DELETE t_command
FROM t_command
JOIN t_constructions ON t_constructions.ship = t_command.ship;

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_process_decommissions
DROP PROCEDURE IF EXISTS `p_process_decommissions`;
DELIMITER //
CREATE PROCEDURE `p_process_decommissions`()
    SQL SECURITY INVOKER
BEGIN

# refund some money to players
UPDATE t_player
SET t_player.money = t_player.money + IFNULL(
(
	SELECT SUM(d_class.price * t_ship.life / d_class.life / 2)
	FROM t_command
	JOIN t_ship ON t_ship.id = t_command.ship
	JOIN t_object ON t_object.id = t_ship.id
	JOIN d_class ON d_class.id = t_ship.class
	WHERE t_command.type = 'decommission' and t_object.owner = t_player.id AND d_class.price > 0
), 0);

# set ships life to zero
UPDATE t_ship JOIN t_command ON t_ship.id = t_command.ship SET life = 0 WHERE t_command.type = 'decommission';

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_process_destroyed_ships
DROP PROCEDURE IF EXISTS `p_process_destroyed_ships`;
DELIMITER //
CREATE PROCEDURE `p_process_destroyed_ships`()
    SQL SECURITY INVOKER
BEGIN

# destroyed ships may not have any commands
DELETE t_command FROM t_command JOIN t_ship ON t_ship.id = t_command.ship WHERE t_ship.life = 0;

# delete commands that are targetting destroyed ships
DELETE t_command FROM t_command JOIN t_ship ON t_ship.id = t_command.target WHERE t_ship.life = 0;

# the cargo is lost
DELETE t_commodity FROM t_commodity JOIN t_ship ON t_ship.id = t_commodity.object WHERE t_ship.life = 0;

# actually delete the ships
DELETE t_ship FROM t_ship WHERE t_ship.life = 0;

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_process_recipes
DROP PROCEDURE IF EXISTS `p_process_recipes`;
DELIMITER //
CREATE PROCEDURE `p_process_recipes`()
    SQL SECURITY INVOKER
BEGIN

DROP TEMPORARY TABLE IF EXISTS t_recipe_planets;
CREATE TEMPORARY TABLE t_recipe_planets
(PRIMARY KEY(planet))
SELECT planet
FROM t_recipe
GROUP BY planet;

DELETE t_recipe_planets
FROM t_recipe_planets
JOIN t_recipe ON t_recipe.planet = t_recipe_planets.planet AND t_recipe.production < 0
LEFT JOIN t_commodity ON t_recipe_planets.planet = t_commodity.object AND t_commodity.resource = t_recipe.resource
WHERE IFNULL(t_commodity.amount, 0) <= -t_recipe.production;

DROP TEMPORARY TABLE IF EXISTS t_recipe_result;
CREATE TEMPORARY TABLE t_recipe_result
(PRIMARY KEY(planet, resource))
SELECT t_recipe.planet, t_recipe.resource, IFNULL(t_commodity.amount, 0) + t_recipe.production AS amount
FROM t_recipe
JOIN t_recipe_planets ON t_recipe_planets.planet = t_recipe.planet
left JOIN t_commodity ON t_commodity.object = t_recipe.planet AND t_commodity.resource = t_recipe.resource;

REPLACE INTO t_commodity
SELECT * FROM t_recipe_result;

DELETE FROM t_commodity WHERE amount = 0;

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_process_repairs
DROP PROCEDURE IF EXISTS `p_process_repairs`;
DELIMITER //
CREATE PROCEDURE `p_process_repairs`()
    SQL SECURITY INVOKER
BEGIN

# passive regen
UPDATE t_ship JOIN d_class ON d_class.id = t_ship.class SET t_ship.life = t_ship.life + d_class.regen;

# find suitable commands
DROP TEMPORARY TABLE IF EXISTS t_repairs;
CREATE TEMPORARY TABLE t_repairs
(PRIMARY KEY(id), INDEX(player))
SELECT t_ship.id, t_object.owner AS player, d_class.repair_life AS repair, d_class.repair_price AS price
FROM t_command
JOIN t_ship ON t_ship.id = t_command.ship
JOIN t_object ON t_object.id = t_ship.id
JOIN d_class ON d_class.id = t_ship.class
WHERE t_command.type = 'repair';

# players with insufficient money shall repair no ships
DELETE a
FROM t_repairs AS a
WHERE a.player IN
(
	SELECT player FROM
	(
		SELECT b.player, t_player.money
		FROM t_repairs AS b
		JOIN t_player ON t_player.id = b.player
		GROUP BY t_player.id
		HAVING SUM(b.price) > t_player.money
	) AS subquery
);

# subtract players money
UPDATE t_player
SET t_player.money = t_player.money - IFNULL(
(
	SELECT SUM(t_repairs.price)
	FROM t_repairs
	WHERE t_repairs.player = t_player.id
), 0);

# replenish ships life
UPDATE t_ship
JOIN t_repairs ON t_repairs.id = t_ship.id
SET t_ship.life = t_ship.life + t_repairs.repair;

# cap the life
UPDATE t_ship JOIN d_class ON d_class.id = t_ship.class SET t_ship.life = LEAST(t_ship.life, d_class.life);

# delete fulfilled commands
DELETE t_command
FROM t_command
JOIN t_repairs ON t_repairs.id = t_command.ship;

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_process_trades
DROP PROCEDURE IF EXISTS `p_process_trades`;
DELIMITER //
CREATE PROCEDURE `p_process_trades`()
    SQL SECURITY INVOKER
BEGIN

# create a temporary player to represent all the planets which allows to simplify the other queries related to money
# it has A LOT of money from the beginning to ensure that the planets pass the 'available money' filter
INSERT IGNORE INTO d_user (id, name) VALUES (-1, '<planets>');
INSERT IGNORE INTO t_player (id, user, name, money) VALUES (-1, -1, '<planets>', 1000000000000000);

# filter by commands

DROP TEMPORARY TABLE IF EXISTS t_trades;
CREATE TEMPORARY TABLE t_trades
(price int NULL, INDEX(buyer), INDEX(seller), INDEX(resource), PRIMARY KEY(buyer, seller, resource), INDEX(buyer_player), INDEX(seller_player))
SELECT if(amount > 0, ship, target) AS buyer , IFNULL(if(amount > 0, ao.owner, bo.owner), -1) AS buyer_player,
       if(amount > 0, target, ship) AS seller, IFNULL(if(amount > 0, bo.owner, ao.owner), -1) AS seller_player,
	   resource, ABS(amount) AS amount, NULL AS price
FROM t_command
LEFT JOIN t_ship AS a ON a.id = t_command.ship
LEFT JOIN t_object AS ao ON ao.id = a.id
LEFT JOIN t_ship AS b ON b.id = t_command.target
LEFT JOIN t_object AS bo ON bo.id = b.id
WHERE t_command.type = 'trade';

# filter by positions

DELETE t_trades
FROM t_trades
JOIN t_object AS a ON a.id = t_trades.buyer
JOIN t_object AS b ON b.id = t_trades.seller
WHERE a.pos_x != a.pos_x OR a.pos_y != b.pos_y;

# filter by price

UPDATE t_trades
SET t_trades.price = 0
WHERE t_trades.seller_player = t_trades.buyer_player;

UPDATE t_trades
JOIN t_price ON t_price.planet = t_trades.seller AND t_price.resource = t_trades.resource
SET t_trades.price = t_price.buy;

UPDATE t_trades
JOIN t_price ON t_price.planet = t_trades.buyer AND t_price.resource = t_trades.resource
SET t_trades.price = t_price.sell;

DELETE FROM t_trades WHERE price IS NULL;

UPDATE t_trades SET price = amount * price;

# filter by available cargo space

DROP TEMPORARY TABLE IF EXISTS t_ship_cargo_used;
CREATE TEMPORARY TABLE t_ship_cargo_used
(PRIMARY KEY(ship))
SELECT t_ship.id AS ship, IFNULL(SUM(t_commodity.amount), 0) AS used
FROM t_ship
LEFT JOIN t_commodity ON t_commodity.object = t_ship.id
GROUP BY t_ship.id;

DELETE t_trades
FROM t_trades
JOIN t_ship_cargo_used ON t_ship_cargo_used.ship = t_trades.buyer
JOIN t_ship ON t_ship.id = t_trades.buyer
JOIN d_class ON d_class.id = t_ship.class
WHERE t_ship_cargo_used.used + t_trades.amount > d_class.cargo;

# filter by available money
# filtering by money before goods prevents players interfering (screwing) with each other without actually buying the goods afterwards due to insufficient money

DELETE FROM t_trades
WHERE t_trades.buyer_player IN
(
 SELECT player
 FROM
 (
  SELECT buyer_player AS player, SUM(price) AS required
  FROM
  (
   SELECT buyer_player, price
   FROM t_trades
   UNION ALL
   SELECT id, 0
   FROM t_player
  ) AS subquery
  GROUP BY player
 ) AS players
 JOIN t_player ON t_player.id = players.player
 WHERE t_player.money < required
);

# filter by available goods

DROP TEMPORARY TABLE IF EXISTS t_trade_goods_requested;
CREATE TEMPORARY TABLE t_trade_goods_requested
(INDEX(object), INDEX(resource), PRIMARY KEY(object, resource))
SELECT seller AS object, resource, SUM(amount) AS request
FROM t_trades
GROUP BY seller, resource;

DELETE t_trades
FROM t_trades
JOIN t_trade_goods_requested ON t_trade_goods_requested.object = t_trades.seller AND t_trade_goods_requested.resource = t_trades.resource
left JOIN t_commodity ON t_commodity.object = t_trades.seller AND t_commodity.resource = t_trades.resource
WHERE t_trade_goods_requested.request > IFNULL(t_commodity.amount, 0);

# transfer money

UPDATE t_player
JOIN t_trades ON t_trades.seller_player = t_player.id
SET t_player.money = t_player.money + t_trades.price;

UPDATE t_player
JOIN t_trades ON t_trades.buyer_player = t_player.id
SET t_player.money = t_player.money - t_trades.price;

# transfer goods

INSERT IGNORE INTO t_commodity (object, resource)
SELECT buyer, resource
FROM t_trades;

UPDATE t_commodity
JOIN t_trades ON t_trades.seller = t_commodity.object AND t_trades.resource = t_commodity.resource
SET t_commodity.amount = t_commodity.amount - t_trades.amount;

UPDATE t_commodity
JOIN t_trades ON t_trades.buyer = t_commodity.object AND t_trades.resource = t_commodity.resource
SET t_commodity.amount = t_commodity.amount + t_trades.amount;

# generate reports

INSERT INTO t_report_trade (tick, buyer, seller, resource, amount, price)
SELECT (SELECT tick FROM t_game), buyer, seller, resource, amount, price
FROM t_trades;

# remove fulfilled commands

DELETE t_command
FROM t_command
JOIN t_trades ON t_trades.buyer = t_command.ship AND t_command.amount > 0;

DELETE t_command
FROM t_command
JOIN t_trades ON t_trades.seller = t_command.ship AND t_command.amount < 0;

# clean up

DELETE FROM t_commodity WHERE amount = 0;
DELETE FROM t_player WHERE id = -1;
DELETE FROM d_user WHERE id = -1;

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_purge_all
DROP PROCEDURE IF EXISTS `p_purge_all`;
DELIMITER //
CREATE PROCEDURE `p_purge_all`()
    SQL SECURITY INVOKER
    COMMENT 'clears all tables and resets autoincrement values - use before commiting changes in git'
BEGIN

CALL p_clear_all;

DELETE FROM d_user_score;
DELETE FROM d_user;
ALTER TABLE d_user AUTO_INCREMENT = 1;

ALTER TABLE t_report_resource_price AUTO_INCREMENT = 1;
ALTER TABLE t_report_player_score AUTO_INCREMENT = 1;
ALTER TABLE t_report_timing AUTO_INCREMENT = 1;
ALTER TABLE t_report_combat AUTO_INCREMENT = 1;
ALTER TABLE t_report_trade AUTO_INCREMENT = 1;
ALTER TABLE t_commodity AUTO_INCREMENT = 1;
ALTER TABLE t_price AUTO_INCREMENT = 1;
ALTER TABLE t_recipe AUTO_INCREMENT = 1;
ALTER TABLE t_planet AUTO_INCREMENT = 1;
ALTER TABLE t_command AUTO_INCREMENT = 1;
ALTER TABLE t_ship AUTO_INCREMENT = 1;
ALTER TABLE t_object AUTO_INCREMENT = 1;
ALTER TABLE t_player AUTO_INCREMENT = 1;
UPDATE t_game SET season = 1, tick = 1;

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_report_player_score
DROP PROCEDURE IF EXISTS `p_report_player_score`;
DELIMITER //
CREATE PROCEDURE `p_report_player_score`()
    SQL SECURITY INVOKER
BEGIN

INSERT INTO t_report_player_score
SELECT t_player.id, (SELECT tick FROM t_game LIMIT 1), v.commodities, v.ships, v.money, v.total
FROM t_player
JOIN v_player_total_worth AS v ON v.player = t_player.id;

INSERT INTO t_report_resource_price
SELECT resource, (SELECT tick FROM t_game LIMIT 1), sell
FROM v_resource_price;

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_reset_all
DROP PROCEDURE IF EXISTS `p_reset_all`;
DELIMITER //
CREATE PROCEDURE `p_reset_all`()
    SQL SECURITY INVOKER
    COMMENT 'reset all runtime data and initialize for next season'
BEGIN

START TRANSACTION READ WRITE;

INSERT INTO d_user_score (season, user, score)
SELECT (SELECT season FROM t_game LIMIT 1), user, score
FROM v_user_score;

UPDATE t_game SET season = season + 1, tick = 1;

CALL p_clear_all;
CALL p_generate_planets;
CALL p_generate_resources;
CALL p_process_recipes;
CALL p_generate_prices;
CALL p_update_prices;

COMMIT;

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_update_all
DROP PROCEDURE IF EXISTS `p_update_all`;
DELIMITER //
CREATE PROCEDURE `p_update_all`()
    SQL SECURITY INVOKER
    COMMENT 'evaluate all players commands and progress time'
BEGIN

DECLARE ts_entry TIMESTAMP(6);
DECLARE ts_begin TIMESTAMP(6);
DECLARE ts_movement TIMESTAMP(6);
DECLARE ts_attacks TIMESTAMP(6);
DECLARE ts_trades TIMESTAMP(6);
DECLARE ts_recipes TIMESTAMP(6);
DECLARE ts_prices TIMESTAMP(6);
DECLARE ts_constructions TIMESTAMP(6);
DECLARE ts_report TIMESTAMP(6);
DECLARE ts_overall TIMESTAMP(6);
DECLARE my_tick INT;

SET ts_entry = SYSDATE(6);

START TRANSACTION READ WRITE;

SELECT tick FROM t_game INTO my_tick;

SET ts_begin = SYSDATE(6);
CALL p_move_ships;
SET ts_movement = SYSDATE(6);
CALL p_process_attacks;
CALL p_process_decommissions;
CALL p_process_destroyed_ships;
SET ts_attacks = SYSDATE(6);
CALL p_process_trades;
SET ts_trades = SYSDATE(6);
CALL p_process_recipes;
SET ts_recipes = SYSDATE(6);
CALL p_update_prices;
SET ts_prices = SYSDATE(6);
CALL p_process_constructions;
CALL p_process_repairs;
SET ts_constructions = SYSDATE(6);
CALL p_report_player_score;
SET ts_report = SYSDATE(6);

UPDATE t_game SET tick = tick + 1;

COMMIT;

SET ts_overall = SYSDATE(6);

INSERT INTO t_report_timing VALUES (
my_tick,
TIMESTAMPDIFF(MICROSECOND, ts_begin, ts_movement),
TIMESTAMPDIFF(MICROSECOND, ts_movement, ts_attacks),
TIMESTAMPDIFF(MICROSECOND, ts_attacks, ts_trades),
TIMESTAMPDIFF(MICROSECOND, ts_trades, ts_recipes),
TIMESTAMPDIFF(MICROSECOND, ts_recipes, ts_prices),
TIMESTAMPDIFF(MICROSECOND, ts_prices, ts_constructions),
TIMESTAMPDIFF(MICROSECOND, ts_constructions, ts_report),
TIMESTAMPDIFF(MICROSECOND, ts_begin, ts_report),
TIMESTAMPDIFF(MICROSECOND, ts_entry, ts_overall),
SYSDATE(6)
);

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_update_prices
DROP PROCEDURE IF EXISTS `p_update_prices`;
DELIMITER //
CREATE PROCEDURE `p_update_prices`()
    SQL SECURITY INVOKER
BEGIN

# TODO

END//
DELIMITER ;

-- Dumping structure for table space_tycoon.t_command
DROP TABLE IF EXISTS `t_command`;
CREATE TABLE IF NOT EXISTS `t_command` (
  `ship` int(11) NOT NULL,
  `type` enum('move','attack','trade','construct','decommission','repair') NOT NULL,
  `target` int(11) DEFAULT NULL,
  `resource` int(11) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL COMMENT 'positive = buy, negative = sell',
  `class` int(11) DEFAULT NULL,
  PRIMARY KEY (`ship`) USING BTREE,
  KEY `FK_t_command_t_object` (`target`),
  KEY `FK_t_command_t_resource` (`resource`),
  KEY `FK_t_command_d_class` (`class`),
  CONSTRAINT `FK__ship` FOREIGN KEY (`ship`) REFERENCES `t_ship` (`id`),
  CONSTRAINT `FK_t_command_d_class` FOREIGN KEY (`class`) REFERENCES `d_class` (`id`),
  CONSTRAINT `FK_t_command_t_object` FOREIGN KEY (`target`) REFERENCES `t_object` (`id`),
  CONSTRAINT `FK_t_command_t_resource` FOREIGN KEY (`resource`) REFERENCES `d_resource` (`id`),
  CONSTRAINT `ships_command_target_not_self` CHECK (`ship` <> `target`),
  CONSTRAINT `command_trade_amount_not_zero` CHECK (`amount` <> 0),
  CONSTRAINT `move command` CHECK (`type` <> 'move' or `target` is not null and `resource` is null and `amount` is null and `class` is null),
  CONSTRAINT `attack command` CHECK (`type` <> 'attack' or `target` is not null and `resource` is null and `amount` is null and `class` is null),
  CONSTRAINT `construct command` CHECK (`type` <> 'construct' or `target` is null and `resource` is null and `amount` is null and `class` is not null),
  CONSTRAINT `trade command` CHECK (`type` <> 'trade' or `target` is not null and `resource` is not null and `amount` is not null and `class` is null),
  CONSTRAINT `decommission command` CHECK (`type` <> 'decommission' or `target` is null and `resource` is null and `amount` is null and `class` is null),
  CONSTRAINT `repair command` CHECK (`type` <> 'repair' or `target` is null and `resource` is null and `amount` is null and `class` is null)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_command: ~0 rows (approximately)
/*!40000 ALTER TABLE `t_command` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_command` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.t_commodity
DROP TABLE IF EXISTS `t_commodity`;
CREATE TABLE IF NOT EXISTS `t_commodity` (
  `object` int(11) NOT NULL,
  `resource` int(11) NOT NULL,
  `amount` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`object`,`resource`),
  KEY `FK__t_resource` (`resource`),
  CONSTRAINT `FK__t_object` FOREIGN KEY (`object`) REFERENCES `t_object` (`id`),
  CONSTRAINT `FK__t_resource` FOREIGN KEY (`resource`) REFERENCES `d_resource` (`id`),
  CONSTRAINT `commodity_amount_not_negative` CHECK (`amount` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_commodity: ~0 rows (approximately)
/*!40000 ALTER TABLE `t_commodity` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_commodity` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.t_game
DROP TABLE IF EXISTS `t_game`;
CREATE TABLE IF NOT EXISTS `t_game` (
  `season` int(10) NOT NULL,
  `tick` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_game: ~1 rows (approximately)
/*!40000 ALTER TABLE `t_game` DISABLE KEYS */;
INSERT INTO `t_game` (`season`, `tick`) VALUES
	(1, 1);
/*!40000 ALTER TABLE `t_game` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.t_object
DROP TABLE IF EXISTS `t_object`;
CREATE TABLE IF NOT EXISTS `t_object` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `owner` int(11) DEFAULT NULL,
  `name` tinytext NOT NULL DEFAULT '',
  `pos_x` int(11) NOT NULL,
  `pos_y` int(11) NOT NULL,
  `pos_x_prev` int(11) NOT NULL DEFAULT 0,
  `pos_y_prev` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `FK_t_object_t_player` (`owner`),
  CONSTRAINT `FK_t_object_t_player` FOREIGN KEY (`owner`) REFERENCES `t_player` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_object: ~0 rows (approximately)
/*!40000 ALTER TABLE `t_object` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_object` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.t_planet
DROP TABLE IF EXISTS `t_planet`;
CREATE TABLE IF NOT EXISTS `t_planet` (
  `id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK__object_id` FOREIGN KEY (`id`) REFERENCES `t_object` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_planet: ~0 rows (approximately)
/*!40000 ALTER TABLE `t_planet` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_planet` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.t_player
DROP TABLE IF EXISTS `t_player`;
CREATE TABLE IF NOT EXISTS `t_player` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `name` tinytext NOT NULL,
  `money` bigint(20) NOT NULL DEFAULT 3000000,
  `color` tinytext NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Index 3` (`name`(255)),
  KEY `FK_t_player_t_user` (`user`),
  CONSTRAINT `FK_t_player_t_user` FOREIGN KEY (`user`) REFERENCES `d_user` (`id`),
  CONSTRAINT `money_are_not_negative` CHECK (`money` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_player: ~0 rows (approximately)
/*!40000 ALTER TABLE `t_player` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_player` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.t_price
DROP TABLE IF EXISTS `t_price`;
CREATE TABLE IF NOT EXISTS `t_price` (
  `planet` int(11) NOT NULL,
  `resource` int(11) NOT NULL,
  `buy` int(11) DEFAULT NULL COMMENT 'ship buys from the planet',
  `sell` int(11) DEFAULT NULL COMMENT 'ship sells to the planet',
  PRIMARY KEY (`planet`,`resource`),
  KEY `FK__resource_type_` (`resource`),
  CONSTRAINT `FK__planet_id_` FOREIGN KEY (`planet`) REFERENCES `t_planet` (`id`),
  CONSTRAINT `FK__resource_type_` FOREIGN KEY (`resource`) REFERENCES `d_resource` (`id`),
  CONSTRAINT `buy_price_is_positive` CHECK (`buy` is null or `buy` > 0),
  CONSTRAINT `sell_price_is_positive` CHECK (`sell` is null or `sell` > 0),
  CONSTRAINT `buy_price_is_larger_than_sell_price` CHECK (`buy` is null or `sell` is null or `buy` > `sell`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_price: ~0 rows (approximately)
/*!40000 ALTER TABLE `t_price` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_price` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.t_recipe
DROP TABLE IF EXISTS `t_recipe`;
CREATE TABLE IF NOT EXISTS `t_recipe` (
  `planet` int(11) NOT NULL,
  `resource` int(11) NOT NULL,
  `production` int(11) NOT NULL COMMENT 'negative is consumption, positive is production',
  PRIMARY KEY (`planet`,`resource`) USING BTREE,
  KEY `FK_t_recipe_resource_t_resource_class` (`resource`),
  CONSTRAINT `FK_t_recipe_resource_t_resource_class` FOREIGN KEY (`resource`) REFERENCES `d_resource` (`id`),
  CONSTRAINT `FK_t_recipe_t_planet` FOREIGN KEY (`planet`) REFERENCES `t_planet` (`id`),
  CONSTRAINT `production_not_zero` CHECK (`production` <> 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_recipe: ~0 rows (approximately)
/*!40000 ALTER TABLE `t_recipe` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_recipe` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.t_report_combat
DROP TABLE IF EXISTS `t_report_combat`;
CREATE TABLE IF NOT EXISTS `t_report_combat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tick` int(11) NOT NULL,
  `attacker` int(11) NOT NULL,
  `defender` int(11) NOT NULL,
  `killed` enum('Y','N') NOT NULL DEFAULT 'N',
  PRIMARY KEY (`id`),
  KEY `Index 4` (`tick`),
  KEY `FK_t_report_combat_t_object` (`attacker`),
  KEY `FK_t_report_combat_t_object_2` (`defender`),
  CONSTRAINT `FK_t_report_combat_t_object` FOREIGN KEY (`attacker`) REFERENCES `t_object` (`id`),
  CONSTRAINT `FK_t_report_combat_t_object_2` FOREIGN KEY (`defender`) REFERENCES `t_object` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_report_combat: ~0 rows (approximately)
/*!40000 ALTER TABLE `t_report_combat` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_report_combat` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.t_report_player_score
DROP TABLE IF EXISTS `t_report_player_score`;
CREATE TABLE IF NOT EXISTS `t_report_player_score` (
  `player` int(11) NOT NULL,
  `tick` int(11) NOT NULL,
  `commodities` bigint(20) NOT NULL,
  `ships` bigint(20) NOT NULL,
  `money` bigint(20) NOT NULL,
  `total` bigint(20) NOT NULL,
  PRIMARY KEY (`player`,`tick`) USING BTREE,
  CONSTRAINT `FK_t_report_player_score_t_player` FOREIGN KEY (`player`) REFERENCES `t_player` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_report_player_score: ~0 rows (approximately)
/*!40000 ALTER TABLE `t_report_player_score` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_report_player_score` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.t_report_resource_price
DROP TABLE IF EXISTS `t_report_resource_price`;
CREATE TABLE IF NOT EXISTS `t_report_resource_price` (
  `resource` int(11) NOT NULL,
  `tick` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`resource`,`tick`),
  CONSTRAINT `FK_t_report_resource_price_d_resource` FOREIGN KEY (`resource`) REFERENCES `d_resource` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_report_resource_price: ~0 rows (approximately)
/*!40000 ALTER TABLE `t_report_resource_price` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_report_resource_price` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.t_report_timing
DROP TABLE IF EXISTS `t_report_timing`;
CREATE TABLE IF NOT EXISTS `t_report_timing` (
  `tick` int(11) NOT NULL,
  `movement` bigint(20) NOT NULL,
  `attacks` bigint(20) NOT NULL,
  `trades` bigint(20) NOT NULL,
  `recipes` bigint(20) NOT NULL,
  `prices` bigint(20) NOT NULL,
  `constructions` bigint(20) NOT NULL,
  `report` bigint(20) NOT NULL,
  `total` bigint(20) NOT NULL COMMENT 'total duration of processing tasks',
  `overall` bigint(20) NOT NULL COMMENT 'includes transaction start and other overhead',
  `at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`tick`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_report_timing: ~0 rows (approximately)
/*!40000 ALTER TABLE `t_report_timing` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_report_timing` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.t_report_trade
DROP TABLE IF EXISTS `t_report_trade`;
CREATE TABLE IF NOT EXISTS `t_report_trade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tick` int(11) NOT NULL,
  `buyer` int(11) NOT NULL,
  `seller` int(11) NOT NULL,
  `resource` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_report_d_resource` (`resource`),
  KEY `Index 6` (`tick`),
  KEY `FK_report_t_ship` (`buyer`) USING BTREE,
  KEY `FK_report_t_object` (`seller`) USING BTREE,
  CONSTRAINT `FK_report_d_resource` FOREIGN KEY (`resource`) REFERENCES `d_resource` (`id`),
  CONSTRAINT `FK_t_report_trade_t_object` FOREIGN KEY (`buyer`) REFERENCES `t_object` (`id`),
  CONSTRAINT `FK_t_report_trade_t_object_2` FOREIGN KEY (`seller`) REFERENCES `t_object` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_report_trade: ~0 rows (approximately)
/*!40000 ALTER TABLE `t_report_trade` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_report_trade` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.t_ship
DROP TABLE IF EXISTS `t_ship`;
CREATE TABLE IF NOT EXISTS `t_ship` (
  `id` int(11) NOT NULL,
  `class` int(11) NOT NULL,
  `life` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ship_ship_type` (`class`),
  CONSTRAINT `FK_ship_object` FOREIGN KEY (`id`) REFERENCES `t_object` (`id`),
  CONSTRAINT `FK_ship_ship_type` FOREIGN KEY (`class`) REFERENCES `d_class` (`id`),
  CONSTRAINT `life_is_not_negative` CHECK (`life` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_ship: ~0 rows (approximately)
/*!40000 ALTER TABLE `t_ship` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_ship` ENABLE KEYS */;

-- Dumping structure for view space_tycoon.v_player_commodities_worth
DROP VIEW IF EXISTS `v_player_commodities_worth`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_player_commodities_worth` (
	`player` INT(11) NOT NULL,
	`commodities` BIGINT(21) NULL
) ENGINE=MyISAM;

-- Dumping structure for view space_tycoon.v_player_score
DROP VIEW IF EXISTS `v_player_score`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_player_score` (
	`player` INT(11) NOT NULL,
	`total` BIGINT(23) NULL,
	`score` BIGINT(21) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view space_tycoon.v_player_ships_worth
DROP VIEW IF EXISTS `v_player_ships_worth`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_player_ships_worth` (
	`player` INT(11) NOT NULL,
	`ships` BIGINT(21) NULL
) ENGINE=MyISAM;

-- Dumping structure for view space_tycoon.v_player_total_worth
DROP VIEW IF EXISTS `v_player_total_worth`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_player_total_worth` (
	`player` INT(11) NOT NULL,
	`commodities` BIGINT(21) NULL,
	`ships` BIGINT(21) NULL,
	`money` BIGINT(20) NOT NULL,
	`total` BIGINT(23) NULL
) ENGINE=MyISAM;

-- Dumping structure for view space_tycoon.v_resource_price
DROP VIEW IF EXISTS `v_resource_price`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_resource_price` (
	`resource` INT(11) NOT NULL,
	`buy` BIGINT(16) NOT NULL,
	`sell` BIGINT(16) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view space_tycoon.v_ship_cargo
DROP VIEW IF EXISTS `v_ship_cargo`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_ship_cargo` (
	`id` INT(11) NOT NULL,
	`capacity` INT(11) NOT NULL COMMENT 'maximum allowed amount of resources loaded on the ship',
	`used` BIGINT(21) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view space_tycoon.v_user_best_worth
DROP VIEW IF EXISTS `v_user_best_worth`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_user_best_worth` (
	`user` INT(11) NOT NULL,
	`total` BIGINT(23) NULL
) ENGINE=MyISAM;

-- Dumping structure for view space_tycoon.v_user_score
DROP VIEW IF EXISTS `v_user_score`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_user_score` (
	`user` INT(11) NOT NULL,
	`total` BIGINT(23) NULL,
	`score` BIGINT(21) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view space_tycoon.v_player_commodities_worth
DROP VIEW IF EXISTS `v_player_commodities_worth`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_player_commodities_worth`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `v_player_commodities_worth` AS SELECT t_player.id AS player, CAST(SUM(IFNULL(t_commodity.amount * v_resource_price.sell, 0)) AS INTEGER) AS commodities
FROM t_player
LEFT JOIN t_object ON t_object.owner = t_player.id
LEFT JOIN t_commodity ON t_commodity.object = t_object.id
LEFT JOIN v_resource_price ON v_resource_price.resource = t_commodity.resource
GROUP BY t_player.id ;

-- Dumping structure for view space_tycoon.v_player_score
DROP VIEW IF EXISTS `v_player_score`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_player_score`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `v_player_score` AS SELECT a.player AS player, a.total AS total, COUNT(1) AS score
FROM v_player_total_worth AS a
JOIN v_player_total_worth AS b ON a.total >= b.total
GROUP BY a.player
ORDER BY a.total desc ;

-- Dumping structure for view space_tycoon.v_player_ships_worth
DROP VIEW IF EXISTS `v_player_ships_worth`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_player_ships_worth`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `v_player_ships_worth` AS SELECT t_player.id AS player, CAST(SUM(ifnull(d_class.price, 0)) AS INTEGER) AS ships
FROM t_player
LEFT JOIN t_object ON t_object.owner = t_player.id
LEFT JOIN t_ship ON t_ship.id = t_object.id
LEFT JOIN d_class ON d_class.id = t_ship.class
GROUP BY t_player.id ;

-- Dumping structure for view space_tycoon.v_player_total_worth
DROP VIEW IF EXISTS `v_player_total_worth`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_player_total_worth`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `v_player_total_worth` AS SELECT t_player.id AS player, v_player_commodities_worth.commodities, v_player_ships_worth.ships, t_player.money, v_player_commodities_worth.commodities + v_player_ships_worth.ships + t_player.money AS total
FROM t_player
JOIN v_player_commodities_worth ON v_player_commodities_worth.player = t_player.id
JOIN v_player_ships_worth ON v_player_ships_worth.player = t_player.id ;

-- Dumping structure for view space_tycoon.v_resource_price
DROP VIEW IF EXISTS `v_resource_price`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_resource_price`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `v_resource_price` AS SELECT d_resource.id AS resource, CAST(ifnull(AVG(buy), 0) AS integer) AS buy, CAST(ifnull(AVG(sell), 0) AS integer) AS sell
FROM d_resource
LEFT JOIN t_price ON t_price.resource = d_resource.id
GROUP BY d_resource.id ;

-- Dumping structure for view space_tycoon.v_ship_cargo
DROP VIEW IF EXISTS `v_ship_cargo`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_ship_cargo`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `v_ship_cargo` AS SELECT t_ship.id, d_class.cargo AS capacity, CAST(IFNULL(SUM(t_commodity.amount), 0) AS INTEGER) AS used
FROM t_ship
JOIN d_class ON d_class.id = t_ship.class
LEFT JOIN t_commodity ON t_commodity.object = t_ship.id
GROUP BY t_ship.id ;

-- Dumping structure for view space_tycoon.v_user_best_worth
DROP VIEW IF EXISTS `v_user_best_worth`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_user_best_worth`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `v_user_best_worth` AS SELECT t_player.user, MAX(v_player_total_worth.total) AS total
FROM v_player_total_worth
JOIN t_player ON t_player.id = v_player_total_worth.player
GROUP BY t_player.user
ORDER BY total desc ;

-- Dumping structure for view space_tycoon.v_user_score
DROP VIEW IF EXISTS `v_user_score`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_user_score`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `v_user_score` AS SELECT a.user AS user, a.total AS total, COUNT(1) AS score
FROM v_user_best_worth AS a
JOIN v_user_best_worth AS b ON a.total >= b.total
GROUP BY a.user
ORDER BY a.total desc ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
