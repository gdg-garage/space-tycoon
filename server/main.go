package main

import (
	"database/sql"
	"github.com/gdg-garage/space-tycoon/server/database"
	"github.com/gdg-garage/space-tycoon/server/handlers"
	log "github.com/sirupsen/logrus"
	"net/http"
)

var db *sql.DB

func main() {
	db = database.ConnectDB()
	defer database.CloseDB(db)

	http.HandleFunc("/", handlers.Root)
	http.HandleFunc("/player-scores", func(w http.ResponseWriter, r *http.Request) {
		handlers.PlayerScores(db, w, r)
	})

	port := ":80"
	log.Infof("Listening on %s", port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatal(err)
	}
}
