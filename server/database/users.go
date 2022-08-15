package database

import (
	"database/sql"
	"errors"
	"fmt"
)

func InsertUser(db *sql.DB, username string, password string) error {
	_, err := db.Exec(`insert into d_user (name, password) values (?, ?)`, username, password)
	return err
}

func GetUserPassword(db *sql.DB, username string) (int64, string, error) {
	var password sql.NullString
	var userId int64
	err := db.QueryRow("select id, password from d_user where name = ? limit 1", username).Scan(&userId, &password)
	if err != nil {
		return userId, "", err
	}
	if !password.Valid {
		return userId, "", errors.New("user password is NULL")
	}
	return userId, password.String, nil
}

func GetPLayerIdForUser(db *sql.DB, userId int64, player string) (int64, error) {
	var id int64
	err := db.QueryRow("select `id` from t_player where user = ? and name = ?", userId, player).Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			return id, fmt.Errorf("player %s is unknown for %d", player, userId)
		}
		return id, fmt.Errorf("query failed %v", err)
	}
	return id, nil
}

func IsObjectOwnedByPlayer(db *sql.DB, playerId int64, objectId int64) (bool, error) {
	ownedObjects := make(map[int64]struct{})
	rows, err := db.Query("select `id` from t_object where owner = ?", playerId)
	if err != nil {
		return false, fmt.Errorf("query failed %v", err)
	}
	var id int64
	for rows.Next() {
		err = rows.Scan(&id)
		if err != nil {
			return false, fmt.Errorf("row read failed %v", err)
		}
		ownedObjects[id] = struct{}{}
	}
	_, ok := ownedObjects[objectId]
	return ok, nil
}

func GetPlayerOwnedShips(db *sql.DB, playerId int64) (map[int64]struct{}, error) {
	ownedShips := make(map[int64]struct{})
	rows, err := db.Query("select t_object.`id` from t_object join t_ship on t_ship.id = t_object.id where t_object.owner = ?", playerId)
	if err != nil {
		return ownedShips, fmt.Errorf("query failed %v", err)
	}
	var id int64
	for rows.Next() {
		err = rows.Scan(&id)
		if err != nil {
			return ownedShips, fmt.Errorf("row read failed %v", err)
		}
		ownedShips[id] = struct{}{}
	}
	return ownedShips, nil
}
