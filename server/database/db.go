package database

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/go-sql-driver/mysql"
	"github.com/rs/zerolog/log"
)

func CloseDB(db *sql.DB) {
	err := db.Close()
	if err != nil {
		log.Error().Err(err).Msgf("Closing db connection failed")
	}
}

func ConnectDB(cfg mysql.Config) (*sql.DB, error) {
	db, err := sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		return nil, err
	}
	err = TestDB(db)
	if err != nil {
		return nil, err
	}
	return db, nil

}

func ConnectDBWithRetries() *sql.DB {
	maxRetries := 5
	retryBackoff := 500 * time.Millisecond
	cfg := mysql.Config{
		User:                 "root",
		Passwd:               "secret", // TODO load config
		Net:                  "tcp",
		Addr:                 "db:3306",
		DBName:               "space_tycoon",
		AllowNativePasswords: true,
	}
	log.Info().Msgf("Connecting to DB") // TODO print address
	retry := 0
	var db *sql.DB
	for {
		var err error
		db, err = ConnectDB(cfg)
		if err != nil {
			retryLog := log.With().Err(err).Int("retry", retry).Int("max_retries", maxRetries).Logger()
			if retry < maxRetries {
				retryLog.Error().Msg("DB connection failed - retrying")
				retry++
				time.Sleep(retryBackoff)
				continue
			} else {
				retryLog.Fatal().Err(err).Msg("DB connection failed - too many retires - giving up")
			}
		}
		break
	}
	return db
}

func TestDB(db *sql.DB) error {
	var version string
	err := db.QueryRow("SELECT VERSION();").Scan(&version)
	if err != nil {
		return fmt.Errorf("DB connection failed")
	}
	return nil
}
