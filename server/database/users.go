package database

import (
	"database/sql"
	"errors"
)

func InsertUser(db *sql.DB, username string, password string) error {
	_, err := db.Exec(`insert into d_user (name, password) values (?, ?)`, username, password)
	return err
}

func GetUserPassword(db *sql.DB, username string) (string, error) {
	var password sql.NullString
	err := db.QueryRow("select password from d_user where name = ? limit 1;", username).Scan(&password)
	if err != nil {
		return "", err
	}
	if !password.Valid {
		return "", errors.New("user password is NULL")
	}
	return password.String, nil
}
