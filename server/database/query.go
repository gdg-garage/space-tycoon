package database

import (
	"database/sql"
	"fmt"
)

func CheckObjectIsPlanet(db *sql.DB, id int64) (bool, error) {
	var cnt int
	err := db.QueryRow("select count(*) from t_object join t_planet on t_planet.id = t_object.id where t_object.id = ?", id).Scan(&cnt)
	if err != nil {
		return false, fmt.Errorf("query failed %v", err)
	}
	return cnt == 1, nil
}

func GetPlanetIDs(db *sql.DB) (map[int64]struct{}, error) {
	planetIDs := map[int64]struct{}{}
	rows, err := db.Query("select t_planet.`id` from t_object join t_planet on t_planet.id = t_object.id")
	if err != nil {
		return planetIDs, fmt.Errorf("query failed %v", err)
	}
	for rows.Next() {
		var id int64
		err = rows.Scan(&id)
		if err != nil {
			return planetIDs, fmt.Errorf("row read failed %v", err)
		}
		planetIDs[id] = struct{}{}
	}
	if err = rows.Err(); err != nil {
		return planetIDs, fmt.Errorf("rows read failed: %v", err)
	}
	return planetIDs, nil
}

// Returns an error when planet can't trade or when some query failed
func CheckPlanetCanTrade(db *sql.DB, planetId int64, resourceId int64, amount int) error {
	if amount > 0 {
		// Check if planet is wiling to let player buy
		var cnt int
		err := db.QueryRow("select count(*) from t_price where planet = ? and resource = ? and buy is not null", planetId, resourceId).Scan(&cnt)
		if err != nil {
			return fmt.Errorf("query failed %v", err)
		}
		if cnt == 0 {
			return fmt.Errorf("planet %d is not willing to let player buy resource %d (no 'buy' price for resource)", planetId, resourceId)
		}
		// select count(*) from t_price where planet = 2901 and resource = 5 and buy != null
	} else {
		// Check if planet is wiling to let player sell
		var cnt int
		err := db.QueryRow("select count(*) from t_price where planet = ? and resource = ? and sell is not null", planetId, resourceId).Scan(&cnt)
		if err != nil {
			return fmt.Errorf("query failed %v", err)
		}
		if cnt == 0 {
			return fmt.Errorf("planet %d is not willing to let player sell resource %d (no 'sell' price for resource)", planetId, resourceId)
		}
		// select count(*) from t_price where planet = 2901 and resource = 5 and sell != null

		// check if planet has enough resources
		err = db.QueryRow("select count(*) from t_commodity where object = ? and resource = ? and amount >= ?", planetId, resourceId, amount).Scan(&cnt)
		if err != nil {
			return fmt.Errorf("query failed %v", err)
		}
		if cnt == 0 {
			return fmt.Errorf("planet %d does not have enough of resource %d", planetId, resourceId)
		}
		// select count(*) from t_commodity where object = 2901 and resource = 5 and amount > 90
	}
	return nil
}

// Returns an error when ship can't trade or when some query failed
func CheckShipCanTrade(db *sql.DB, shipId int64, resourceId int64, amount int) error {
	if amount > 0 {
		// Check if ship has enough cargo space
		// Calculate cargo
		var cargoAmount int
		err := db.QueryRow("select ifnull(sum(resource), 0) from t_commodity where object = ?", shipId).Scan(&cargoAmount)
		if err != nil {
			return fmt.Errorf("query failed %v", err)
		}
		// Get ship class capacity
		var classCapacity int
		err = db.QueryRow("select ifnull(cargo, 0) from t_ship join d_class on t_ship.class = d_class.id where t_ship.id = ? limit 1", shipId).Scan(&classCapacity)
		if err != nil {
			return fmt.Errorf("query failed %v", err)
		}
		freeCapacity := classCapacity - cargoAmount
		if freeCapacity < amount {
			return fmt.Errorf("ship %d does not have enough free cargo capacity", shipId)
		}
	} else {
		// Check if ship has enough resources
		var cnt int
		err := db.QueryRow("select count(*) from t_commodity where object = ? and resource = ? and amount >= ?", shipId, resourceId, amount).Scan(&cnt)
		if err != nil {
			return fmt.Errorf("query failed %v", err)
		}
		if cnt == 0 {
			return fmt.Errorf("ship %d does not have enough of resource %d", shipId, resourceId)
		}
	}
	return nil
}
