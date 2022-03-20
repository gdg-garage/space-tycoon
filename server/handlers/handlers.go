package handlers

import (
	"database/sql"
	"encoding/json"
	"github.com/gdg-garage/space-tycoon/server/stycoon"
	log "github.com/sirupsen/logrus"
	"io/ioutil"
	"net/http"
)

func Root(w http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.Warningf("Error reading body: %v", err)
		http.Error(w, "can't read request body", http.StatusBadRequest)
		return
	}
	r, err := json.Marshal(map[string]string{"greeting": "hello", "body": string(body)})
	if err != nil {
		log.Warningf("Json marshall failed %v", err)
		http.Error(w, "response failed", http.StatusInternalServerError)
		return
	}
	_, err = w.Write(r)
	if err != nil {
		log.Warningf("response write failed %v", err)
		w.WriteHeader(http.StatusInternalServerError)
	}
}

func PlayerScores(db *sql.DB, w http.ResponseWriter, req *http.Request) {
	playerScores := stycoon.GetPlayerScores(db)
	scores, err := json.Marshal(playerScores)
	if err != nil {
		log.Warningf("Json marshall failed %v", err)
		http.Error(w, "response failed", http.StatusInternalServerError)
		return
	}
	_, err = w.Write(scores)
	if err != nil {
		log.Warningf("response write failed %v", err)
		w.WriteHeader(http.StatusInternalServerError)
	}
}
