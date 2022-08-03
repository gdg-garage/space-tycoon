package database

import (
	"database/sql"
	"errors"
	"github.com/gdg-garage/space-tycoon/server/stycoon"
)

func InsertUser(db *sql.DB, username string, password string) error {
	_, err := db.Exec(`insert into d_user (name, password) values (?, ?)`, username, password)
	return err
}

func GetUserPassword(db *sql.DB, username string) (stycoon.PlayerId, string, error) {
	var password sql.NullString
	var player stycoon.PlayerId
	err := db.QueryRow("select id, password from d_user where name = ? limit 1", username).Scan(&player.Id, &password)
	if err != nil {
		return player, "", err
	}
	if !password.Valid {
		return player, "", errors.New("user password is NULL")
	}
	return player, password.String, nil
}
