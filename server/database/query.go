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
