package database

import (
	"database/sql"

	"github.com/go-sql-driver/mysql"
	"github.com/rs/zerolog/log"
)

func CloseDB(db *sql.DB) {
	err := db.Close()
	if err != nil {
		log.Error().Err(err).Msgf("Closing db connection failed")
	}
}

func ConnectDB() *sql.DB {
	cfg := mysql.Config{
		User:                 "root",
		Passwd:               "secret", // TODO load config
		Net:                  "tcp",
		Addr:                 "db:3306",
		DBName:               "space_tycoon",
		AllowNativePasswords: true,
	}
	log.Info().Msgf("Connecting to DB") // TODO print address
	db, err := sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal().Err(err).Msg("DB connection failed")
	}
	TestDBorDie(db)
	return db
}

func TestDBorDie(db *sql.DB) {
	var version string
	err := db.QueryRow("SELECT VERSION();").Scan(&version)
	if err != nil {
		log.Fatal().Err(err).Msg("DB connection failed")
	}
}
