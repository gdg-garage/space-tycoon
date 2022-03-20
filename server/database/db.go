package database

import (
	"database/sql"
	"github.com/go-sql-driver/mysql"
	log "github.com/sirupsen/logrus"
)

func CloseDB(db *sql.DB) {
	err := db.Close()
	if err != nil {
		log.Errorf("Closing db connection failed %v", err)
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
	log.Infof("Connecting to DB") // TODO print address
	db, err := sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatalf("DB connection failed %v", err)
	}
	TestDBorDie(db)
	return db
}

func TestDBorDie(db *sql.DB) {
	var version string
	err := db.QueryRow("SELECT VERSION();").Scan(&version)
	if err != nil {
		log.Fatalf("DB connection failed %v", err)
	}
}
