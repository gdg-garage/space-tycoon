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
