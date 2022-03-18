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

-- Dumping structure for table space_tycoon.d_class
DROP TABLE IF EXISTS `d_class`;
CREATE TABLE IF NOT EXISTS `d_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` tinytext NOT NULL,
  `shipyard` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT 'allows constructing new ships',
  `speed` double NOT NULL,
  `cargo` int(11) NOT NULL,
  `life` int(11) NOT NULL,
  `damage` int(11) NOT NULL,
  `price` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.d_class: ~7 rows (approximately)
/*!40000 ALTER TABLE `d_class` DISABLE KEYS */;
INSERT INTO `d_class` (`id`, `name`, `shipyard`, `speed`, `cargo`, `life`, `damage`, `price`) VALUES
	(1, 'mothership', 'Y', 10, 0, 1000, 50, NULL),
	(2, 'hauler', 'N', 13, 200, 200, 0, 500000),
	(3, 'shipper', 'N', 18, 50, 100, 0, 300000),
	(4, 'fighter', 'N', 20, 0, 150, 15, 1500000),
	(5, 'bomber', 'N', 15, 0, 250, 30, 2000000),
	(6, 'destroyer', 'Y', 10, 0, 3000, 250, 42000000),
	(7, 'shipyard', 'Y', 10, 0, 1000, 0, 5000000);
/*!40000 ALTER TABLE `d_class` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.d_resource
DROP TABLE IF EXISTS `d_resource`;
CREATE TABLE IF NOT EXISTS `d_resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` tinytext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.d_resource: ~21 rows (approximately)
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
	(16, 'Powerfull Psychic Abilities'),
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.d_user: ~4 rows (approximately)
/*!40000 ALTER TABLE `d_user` DISABLE KEYS */;
INSERT INTO `d_user` (`id`, `name`, `password`) VALUES
	(1, 'opice', NULL),
	(2, 'kokot', NULL),
	(3, 'orangutan', NULL),
	(4, 'lolitka', NULL),
	(5, 'rasputin', NULL);
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

-- Dumping data for table space_tycoon.d_user_score: ~38 rows (approximately)
/*!40000 ALTER TABLE `d_user_score` DISABLE KEYS */;
INSERT INTO `d_user_score` (`season`, `user`, `score`) VALUES
	(41, 1, 3),
	(41, 2, 4),
	(41, 3, 1),
	(41, 4, 5),
	(41, 5, 2),
	(42, 1, 1),
	(42, 2, 4),
	(42, 3, 2),
	(42, 4, 3),
	(42, 5, 5),
	(45, 1, 4),
	(45, 2, 2),
	(45, 3, 3),
	(45, 4, 1),
	(45, 5, 5),
	(46, 1, 5),
	(46, 2, 4),
	(46, 3, 3),
	(46, 4, 2),
	(46, 5, 1),
	(47, 1, 1),
	(47, 2, 4),
	(47, 3, 5),
	(47, 4, 3),
	(47, 5, 2),
	(51, 1, 4),
	(51, 2, 5),
	(51, 3, 2),
	(51, 4, 1),
	(51, 5, 3),
	(52, 1, 1),
	(52, 2, 3),
	(52, 4, 4),
	(52, 5, 2),
	(53, 2, 1),
	(53, 3, 4),
	(53, 4, 3),
	(53, 5, 2);
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
BEGIN

DELETE FROM t_report_timing;
DELETE FROM t_report_combat;
DELETE FROM t_report_trade;
DELETE FROM t_commodity;
DELETE FROM t_price;
DELETE FROM t_recipe;
DELETE FROM t_planet;
DELETE FROM t_command;
DELETE FROM t_ship;
DELETE FROM t_waypoint;
DELETE FROM t_object;
DELETE FROM t_player;

UPDATE t_game SET season = season + 1, tick = 0;

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
DECLARE star_x INT;
DECLARE star_y INT;
DECLARE id INT;
SET num_stars = RAND() * 20 + 4000;
SET star_index = 0;
WHILE star_index < num_stars DO
	SET star_x = (RAND() - 0.5) * 3000;
	SET star_y = (RAND() - 0.5) * 3000;
	SET num_planets = RAND() * RAND() * 5 + 1;
	SET planet_index = 0;
	WHILE planet_index < num_planets DO
		INSERT INTO t_object (name, pos_x, pos_y) VALUES (CONCAT('Planet-', star_index, "-", planet_index), star_x + (RAND() - 0.5) * 20, star_y + (RAND() - 0.5) * 20);
		SET id = LAST_INSERT_ID();
		INSERT INTO t_planet (id) VALUES (id);
		SET planet_index = planet_index + 1;
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
SET player_count = RAND() * 10 + 50;
SET player_index = 0;
WHILE player_index < player_count DO
	SET player_x = (RAND() - 0.5) * 3000;
	SET player_y = (RAND() - 0.5) * 3000;
	INSERT INTO t_player (name, USER, money) VALUES (CONCAT('AI-', player_index), (SELECT id FROM d_user ORDER BY RAND() LIMIT 1), RAND() * 10000000 + 10000);
	SET player_id = LAST_INSERT_ID();
	SET ship_count = RAND() * 5 + 100;
	SET ship_index = 0;
	WHILE ship_index < ship_count DO
		INSERT INTO t_object (name, pos_x, pos_y) VALUES (CONCAT('AI-', player_index, '-', ship_index), player_x, player_y);
		SET ship_id = LAST_INSERT_ID();
		INSERT INTO t_ship (id, class, player, life) VALUES (ship_id, (SELECT id FROM d_class ORDER BY RAND() LIMIT 1), player_id, 0);
		SET ship_index = ship_index + 1;
	END WHILE;
	SET player_index = player_index + 1;
END WHILE;

UPDATE t_ship JOIN d_class ON d_class.id = t_ship.class SET t_ship.life = d_class.life;

INSERT ignore INTO t_command (ship, type, target)
SELECT a.id, 'attack', (SELECT b.id FROM t_ship AS b WHERE b.player = (SELECT id FROM t_player WHERE t_player.id != a.player ORDER BY RAND() LIMIT 1) ORDER BY RAND() LIMIT 1)
FROM t_ship AS a
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
WHERE t_ship.life > 0
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
(INDEX(ship), INDEX(player), PRIMARY KEY(ship, player))
SELECT t_command.ship, t_ship.player, t_command.class, d_class.price
FROM t_command
JOIN t_ship ON t_ship.id = t_command.ship
JOIN t_player ON t_player.id = t_ship.player
JOIN d_class ON d_class.id = t_command.class
WHERE t_command.`type` = 'construct' AND d_class.shipyard = 'Y' AND d_class.price IS NOT NULL;

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
	INSERT INTO t_object (pos_x, pos_y, pos_x_prev, pos_y_prev)
	SELECT pos_x, pos_y, pos_x, pos_y
	FROM t_constructions
	JOIN t_object ON t_object.id = t_constructions.ship
	LIMIT i,1;
	SET id = LAST_INSERT_ID();
	INSERT INTO t_ship (id, class, player, life)
	SELECT id, t_constructions.class, t_constructions.player, d_class.life
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

-- Dumping structure for procedure space_tycoon.p_process_trades
DROP PROCEDURE IF EXISTS `p_process_trades`;
DELIMITER //
CREATE PROCEDURE `p_process_trades`()
    SQL SECURITY INVOKER
BEGIN

# filter by commands

DROP TEMPORARY TABLE IF EXISTS t_trades;
CREATE TEMPORARY TABLE t_trades
(INDEX(buyer), INDEX(seller), INDEX(resource), PRIMARY KEY(buyer, seller, resource))
SELECT if(amount > 0, ship, target) AS buyer, if(amount > 0, target, ship) AS seller, resource, ABS(amount) AS amount
FROM t_command
WHERE t_command.type = 'trade';

# filter by positions

DELETE t_trades
FROM t_trades
JOIN t_object AS a ON a.id = t_trades.buyer
JOIN t_object AS b ON b.id = t_trades.seller
WHERE a.pos_x != a.pos_x OR a.pos_y != b.pos_y;

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
JOIN t_commodity ON t_commodity.object = t_trades.seller AND t_commodity.resource = t_trades.resource
WHERE t_trade_goods_requested.request > t_commodity.amount;

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

# transfer money

# generate reports

INSERT INTO t_report_trade (tick, buyer, seller, resource, amount, price)
SELECT (SELECT tick FROM t_game), buyer, seller, resource, amount, 0
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

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_purge_commands
DROP PROCEDURE IF EXISTS `p_purge_commands`;
DELIMITER //
CREATE PROCEDURE `p_purge_commands`()
    SQL SECURITY INVOKER
BEGIN

# dead ships may not have any commands
DELETE t_command FROM t_command JOIN t_ship ON t_ship.id = t_command.ship WHERE t_ship.life = 0;

# delete attack commands that are targetting dead ships
DELETE t_command FROM t_command JOIN t_ship ON t_ship.id = t_command.target WHERE t_command.type = 'attack' AND t_ship.life = 0;

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_reset_all
DROP PROCEDURE IF EXISTS `p_reset_all`;
DELIMITER //
CREATE PROCEDURE `p_reset_all`()
    SQL SECURITY INVOKER
BEGIN

START TRANSACTION READ WRITE;

INSERT INTO d_user_score (season, user, score)
SELECT (SELECT season FROM t_game LIMIT 1), user, score
FROM v_user_score;

CALL p_clear_all;
CALL p_generate_planets;
CALL p_generate_resources;
CALL p_process_recipes;
CALL p_generate_prices;
CALL p_update_prices;

# debug only
CALL p_generate_random_players;

COMMIT;

END//
DELIMITER ;

-- Dumping structure for procedure space_tycoon.p_update_all
DROP PROCEDURE IF EXISTS `p_update_all`;
DELIMITER //
CREATE PROCEDURE `p_update_all`()
    SQL SECURITY INVOKER
BEGIN

DECLARE ts_entry TIMESTAMP(6);
DECLARE ts_begin TIMESTAMP(6);
DECLARE ts_movement TIMESTAMP(6);
DECLARE ts_attacks TIMESTAMP(6);
DECLARE ts_trades TIMESTAMP(6);
DECLARE ts_recipes TIMESTAMP(6);
DECLARE ts_prices TIMESTAMP(6);
DECLARE ts_constructions TIMESTAMP(6);
DECLARE ts_overall TIMESTAMP(6);
DECLARE my_tick INT;

SET ts_entry = SYSDATE(6);

START TRANSACTION READ WRITE;

SELECT tick FROM t_game INTO my_tick;
DELETE FROM t_report_combat WHERE tick + 5 < my_tick;
DELETE FROM t_report_trade WHERE tick + 5 < my_tick;

SET ts_begin = SYSDATE(6);
CALL p_purge_commands;
CALL p_move_ships;
SET ts_movement = SYSDATE(6);
CALL p_process_attacks;
CALL p_purge_commands;
SET ts_attacks = SYSDATE(6);
CALL p_process_trades;
SET ts_trades = SYSDATE(6);
CALL p_process_recipes;
SET ts_recipes = SYSDATE(6);
CALL p_update_prices;
SET ts_prices = SYSDATE(6);
CALL p_process_constructions;
SET ts_constructions = SYSDATE(6);

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
TIMESTAMPDIFF(MICROSECOND, ts_begin, ts_constructions),
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

END//
DELIMITER ;

-- Dumping structure for table space_tycoon.t_command
DROP TABLE IF EXISTS `t_command`;
CREATE TABLE IF NOT EXISTS `t_command` (
  `ship` int(11) NOT NULL,
  `type` enum('stop','move','attack','trade','construct') NOT NULL DEFAULT 'stop',
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
  CONSTRAINT `stop command` CHECK (`type` <> 'stop' or `target` is null and `resource` is null and `amount` is null and `class` is null),
  CONSTRAINT `move command` CHECK (`type` <> 'move' or `target` is not null and `resource` is null and `amount` is null and `class` is null),
  CONSTRAINT `attack command` CHECK (`type` <> 'attack' or `target` is not null and `resource` is null and `amount` is null and `class` is null),
  CONSTRAINT `trade command` CHECK (`type` <> 'trade' or `target` is not null and `resource` is not null and `amount` is not null and `amount` <> 0 and `class` is null),
  CONSTRAINT `construct command` CHECK (`type` <> 'construct' or `target` is null and `resource` is null and `amount` is null and `class` is not null)
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
	(55, 0);
/*!40000 ALTER TABLE `t_game` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.t_object
DROP TABLE IF EXISTS `t_object`;
CREATE TABLE IF NOT EXISTS `t_object` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` tinytext NOT NULL DEFAULT '',
  `pos_x` int(11) NOT NULL,
  `pos_y` int(11) NOT NULL,
  `pos_x_prev` int(11) NOT NULL DEFAULT 0,
  `pos_y_prev` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=835704 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_object: ~155 rows (approximately)
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
  `money` bigint(20) NOT NULL DEFAULT 0,
  `color` tinytext NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `FK_t_player_t_user` (`user`),
  CONSTRAINT `FK_t_player_t_user` FOREIGN KEY (`user`) REFERENCES `d_user` (`id`),
  CONSTRAINT `money_are_not_negative` CHECK (`money` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=2960 DEFAULT CHARSET=utf8mb3;

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
  CONSTRAINT `buy_price_is_larger_than_sell_price` CHECK (`buy` is null or `sell` is null or `buy` >= `sell`)
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
  KEY `FK_t_report_combat_t_ship` (`attacker`),
  KEY `FK_t_report_combat_t_ship_2` (`defender`),
  KEY `Index 4` (`tick`),
  CONSTRAINT `FK_t_report_combat_t_ship` FOREIGN KEY (`attacker`) REFERENCES `t_ship` (`id`),
  CONSTRAINT `FK_t_report_combat_t_ship_2` FOREIGN KEY (`defender`) REFERENCES `t_ship` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1111228 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_report_combat: ~0 rows (approximately)
/*!40000 ALTER TABLE `t_report_combat` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_report_combat` ENABLE KEYS */;

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
) ENGINE=InnoDB AUTO_INCREMENT=24370 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_report_trade: ~0 rows (approximately)
/*!40000 ALTER TABLE `t_report_trade` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_report_trade` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.t_ship
DROP TABLE IF EXISTS `t_ship`;
CREATE TABLE IF NOT EXISTS `t_ship` (
  `id` int(11) NOT NULL,
  `class` int(11) NOT NULL,
  `player` int(11) NOT NULL,
  `life` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ship_ship_type` (`class`),
  KEY `FK_ship_person` (`player`) USING BTREE,
  CONSTRAINT `FK_ship_object` FOREIGN KEY (`id`) REFERENCES `t_object` (`id`),
  CONSTRAINT `FK_ship_person` FOREIGN KEY (`player`) REFERENCES `t_player` (`id`),
  CONSTRAINT `FK_ship_ship_type` FOREIGN KEY (`class`) REFERENCES `d_class` (`id`),
  CONSTRAINT `life_is_not_negative` CHECK (`life` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_ship: ~0 rows (approximately)
/*!40000 ALTER TABLE `t_ship` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_ship` ENABLE KEYS */;

-- Dumping structure for table space_tycoon.t_waypoint
DROP TABLE IF EXISTS `t_waypoint`;
CREATE TABLE IF NOT EXISTS `t_waypoint` (
  `id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK__object_id_` FOREIGN KEY (`id`) REFERENCES `t_object` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table space_tycoon.t_waypoint: ~0 rows (approximately)
/*!40000 ALTER TABLE `t_waypoint` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_waypoint` ENABLE KEYS */;

-- Dumping structure for view space_tycoon.v_player_commodities_worth
DROP VIEW IF EXISTS `v_player_commodities_worth`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_player_commodities_worth` (
	`player` INT(11) NOT NULL,
	`price` DECIMAL(46,4) NULL
) ENGINE=MyISAM;

-- Dumping structure for view space_tycoon.v_player_score
DROP VIEW IF EXISTS `v_player_score`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_player_score` (
	`player` INT(11) NOT NULL,
	`price` DECIMAL(48,4) NULL,
	`score` BIGINT(21) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view space_tycoon.v_player_ships_worth
DROP VIEW IF EXISTS `v_player_ships_worth`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_player_ships_worth` (
	`player` INT(11) NOT NULL,
	`price` DECIMAL(32,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view space_tycoon.v_player_total_worth
DROP VIEW IF EXISTS `v_player_total_worth`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_player_total_worth` (
	`player` INT(11) NOT NULL,
	`price` DECIMAL(48,4) NULL
) ENGINE=MyISAM;

-- Dumping structure for view space_tycoon.v_resource_price
DROP VIEW IF EXISTS `v_resource_price`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_resource_price` (
	`resource` INT(11) NOT NULL,
	`buy` DECIMAL(14,4) NOT NULL,
	`sell` DECIMAL(14,4) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view space_tycoon.v_ship_cargo
DROP VIEW IF EXISTS `v_ship_cargo`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_ship_cargo` (
	`id` INT(11) NOT NULL,
	`capacity` INT(11) NOT NULL,
	`used` DECIMAL(32,0) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view space_tycoon.v_user_best_worth
DROP VIEW IF EXISTS `v_user_best_worth`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_user_best_worth` (
	`user` INT(11) NOT NULL,
	`price` DECIMAL(48,4) NULL
) ENGINE=MyISAM;

-- Dumping structure for view space_tycoon.v_user_score
DROP VIEW IF EXISTS `v_user_score`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_user_score` (
	`user` INT(11) NOT NULL,
	`price` DECIMAL(48,4) NULL,
	`score` BIGINT(21) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view space_tycoon.v_player_commodities_worth
DROP VIEW IF EXISTS `v_player_commodities_worth`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_player_commodities_worth`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `v_player_commodities_worth` AS SELECT t_player.id AS player, SUM(IFNULL(t_commodity.amount * v_resource_price.sell, 0)) AS price
FROM t_player
LEFT JOIN t_ship ON t_ship.player = t_player.id
LEFT JOIN t_commodity ON t_commodity.object = t_ship.id
LEFT JOIN v_resource_price ON v_resource_price.resource = t_commodity.resource
GROUP BY t_player.id ;

-- Dumping structure for view space_tycoon.v_player_score
DROP VIEW IF EXISTS `v_player_score`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_player_score`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `v_player_score` AS SELECT a.player AS player, a.price AS price, COUNT(1) AS score
FROM v_player_total_worth AS a
JOIN v_player_total_worth AS b ON a.price >= b.price
GROUP BY a.player
ORDER BY a.price desc ;

-- Dumping structure for view space_tycoon.v_player_ships_worth
DROP VIEW IF EXISTS `v_player_ships_worth`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_player_ships_worth`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `v_player_ships_worth` AS SELECT t_player.id AS player, SUM(ifnull(d_class.price, 0)) AS price
FROM t_player
LEFT JOIN t_ship ON t_ship.player = t_player.id AND t_ship.life > 0
LEFT JOIN d_class ON d_class.id = t_ship.class
GROUP BY t_player.id ;

-- Dumping structure for view space_tycoon.v_player_total_worth
DROP VIEW IF EXISTS `v_player_total_worth`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_player_total_worth`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `v_player_total_worth` AS SELECT t_player.id AS player, v_player_commodities_worth.price + v_player_ships_worth.price + t_player.money AS price
FROM t_player
JOIN v_player_commodities_worth ON v_player_commodities_worth.player = t_player.id
JOIN v_player_ships_worth ON v_player_ships_worth.player = t_player.id ;

-- Dumping structure for view space_tycoon.v_resource_price
DROP VIEW IF EXISTS `v_resource_price`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_resource_price`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `v_resource_price` AS SELECT d_resource.id AS resource, ifnull(AVG(buy), 0) AS buy, ifnull(AVG(sell), 0) AS sell
FROM d_resource
left JOIN t_price ON t_price.resource = d_resource.id
GROUP BY d_resource.id ;

-- Dumping structure for view space_tycoon.v_ship_cargo
DROP VIEW IF EXISTS `v_ship_cargo`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_ship_cargo`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `v_ship_cargo` AS SELECT t_ship.id, d_class.cargo AS capacity, IFNULL(SUM(t_commodity.amount), 0) AS used
FROM t_ship
JOIN d_class ON d_class.id = t_ship.class
LEFT JOIN t_commodity ON t_commodity.object = t_ship.id
GROUP BY t_ship.id ;

-- Dumping structure for view space_tycoon.v_user_best_worth
DROP VIEW IF EXISTS `v_user_best_worth`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_user_best_worth`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `v_user_best_worth` AS SELECT t_player.user, MAX(v_player_total_worth.price) AS price
FROM v_player_total_worth
JOIN t_player ON t_player.id = v_player_total_worth.player
GROUP BY t_player.user
ORDER BY price desc ;

-- Dumping structure for view space_tycoon.v_user_score
DROP VIEW IF EXISTS `v_user_score`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_user_score`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `v_user_score` AS SELECT a.user AS user, a.price AS price, COUNT(1) AS score
FROM v_user_best_worth AS a
JOIN v_user_best_worth AS b ON a.price >= b.price
GROUP BY a.user
ORDER BY a.price desc ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
