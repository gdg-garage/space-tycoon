package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gdg-garage/space-tycoon/server/stycoon"
	"github.com/gorilla/sessions"
	"github.com/rs/zerolog/log"
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

func PlayerScores(game *stycoon.Game, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, "only GET method is supported", http.StatusBadRequest)
		return
	}
	playerScores, err := game.GetPlayerScores()
	if err != nil {
		log.Warn().Err(err)
		http.Error(w, "db call failed", http.StatusInternalServerError)
		return
	}
	scores, err := json.Marshal(playerScores)
	if err != nil {
		log.Warn().Err(err).Msg("Json marshall failed")
		http.Error(w, "response failed", http.StatusInternalServerError)
		return
	}
	_, err = w.Write(scores)
	if err != nil {
		log.Warn().Err(err).Msg("response write failed")
		w.WriteHeader(http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
}

func Commands(game *stycoon.Game, w http.ResponseWriter, req *http.Request) {
	// read
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.Warn().Err(err).Msg("Error reading body")
		http.Error(w, "can't read request body", http.StatusBadRequest)
		return
	}
	// parse
	commands, err := stycoon.ParseCommands(string(body))
	if err != nil {
		log.Warn().Err(err).Msg("Command parsing failed")
		http.Error(w, "parsing failed", http.StatusBadRequest)
		return
	}
	// process
	errs := game.ProcessCommands(commands)
	if len(errs) > 0 {
		b, err := json.Marshal(errs)
		if err != nil {
			log.Warn().Err(err).Msg("Json marshall failed")
			w.WriteHeader(http.StatusInternalServerError)
		}
		_, err = w.Write(b)
		if err != nil {
			log.Warn().Err(err).Msg("response write failed")
			w.WriteHeader(http.StatusInternalServerError)
		}
		w.WriteHeader(http.StatusBadRequest)
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	}
}

func InternalPage(sessionManager sessions.Store, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, "only GET method is supported", http.StatusBadRequest)
		return
	}
	user, err := stycoon.LoggedUserFromSession(req, sessionManager)
	if err != nil {
		log.Warn().Err(err).Msg("User is not logged in")
		http.Error(w, "only for logged users", http.StatusForbidden)
		return
	}
	_, err = w.Write([]byte(fmt.Sprintf("Hello %s", user.Username)))
	if err != nil {
		log.Warn().Err(err).Msg("response write failed")
		w.WriteHeader(http.StatusInternalServerError)
	}
}
