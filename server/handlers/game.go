package handlers

import (
	"database/sql"
	"encoding/json"
	"github.com/gdg-garage/space-tycoon/server/stycoon"
	"github.com/gorilla/sessions"
	"github.com/rs/zerolog/log"
	"io/ioutil"
	"net/http"
)

func Root(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, "only GET method is supported", http.StatusBadRequest)
		return
	}
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.Warn().Err(err).Msg("Error reading body")
		http.Error(w, "can't read request body", http.StatusBadRequest)
		return
	}
	r, err := json.Marshal(map[string]string{"greeting": "hello", "body": string(body)})
	if err != nil {
		log.Warn().Err(err).Msg("Json marshall failed")
		http.Error(w, "response failed", http.StatusInternalServerError)
		return
	}
	_, err = w.Write(r)
	if err != nil {
		log.Warn().Err(err).Msg("response write failed")
		w.WriteHeader(http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
}

func Data(game *stycoon.Game, sessionManager sessions.Store, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, "only GET method is supported", http.StatusBadRequest)
		return
	}
	gameData, err := game.GetData(stycoon.MaybeGetLoggedPlayerId(req, sessionManager))
	if err != nil {
		log.Warn().Err(err).Msg("game data fetch failed")
		http.Error(w, "db call failed", http.StatusInternalServerError)
		return
	}
	serializedGameData, err := json.Marshal(gameData)
	if err != nil {
		log.Warn().Err(err).Msg("Json marshall failed")
		http.Error(w, "response failed", http.StatusInternalServerError)
		return
	}
	_, err = w.Write(serializedGameData)
	if err != nil {
		log.Warn().Err(err).Msg("response write failed")
		w.WriteHeader(http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
}

func History(game *stycoon.Game, sessionManager sessions.Store, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, "only POST method is supported", http.StatusBadRequest)
		return
	}
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.Warn().Err(err).Msg("Error reading body")
		http.Error(w, "can't read request body", http.StatusBadRequest)
		return
	}
	var historyIdentifier stycoon.HistoryIdentifier
	err = json.Unmarshal(body, &historyIdentifier)
	if err != nil {
		log.Warn().Err(err).Msg("Json unmarshall failed")
		http.Error(w, "can't parse json", http.StatusBadRequest)
		return
	}
	err = stycoon.AssertHistoryIdentifierRequired(historyIdentifier)
	if err != nil {
		log.Warn().Err(err).Msg("history identifier object is invalid")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	if historyIdentifier.Tick <= 0 || historyIdentifier.Season <= 0 {
		log.Warn().Msg("input is negative")
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}
	historyEntry, err := game.History(historyIdentifier, stycoon.MaybeGetLoggedPlayerId(req, sessionManager))
	if err != nil {
		if err == sql.ErrNoRows {
			log.Warn().Err(err).Int64("tick", historyIdentifier.Tick).Int64("session", historyIdentifier.Season).Msg("history entry not found")
			w.WriteHeader(http.StatusNotFound)
			return
		}
		log.Warn().Err(err).Msg("history fetch failed")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	history, err := json.Marshal(historyEntry)
	if err != nil {
		log.Warn().Err(err).Msg("Json marshall failed")
		http.Error(w, "response failed", http.StatusInternalServerError)
		return
	}
	_, err = w.Write(history)
	if err != nil {
		log.Warn().Err(err).Msg("response write failed")
		w.WriteHeader(http.StatusInternalServerError)
	}
}
