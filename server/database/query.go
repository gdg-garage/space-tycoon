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
	var id int64
	if err != nil {
		return planetIDs, fmt.Errorf("query failed %v", err)
	}
	for rows.Next() {
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
