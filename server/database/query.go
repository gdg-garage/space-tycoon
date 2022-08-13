package database

import (
	"database/sql"
	"fmt"
)

func CheckObjectIsPlanet(db *sql.DB, id int64) (bool, error) {
	rows, err := db.Query("select * from t_object join t_planet on t_planet.id = t_object.id where t_object.id = ?", id)
	if err != nil {
		return false, fmt.Errorf("query failed %v", err)
	}
	for rows.Next() {
		var owner int64
		rows.Scan(&owner)
		return true, nil
	}
	return false, nil
}
