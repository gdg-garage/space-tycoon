package handlers

import (
	"encoding/json"
	"github.com/rs/zerolog/log"
	"io/ioutil"
	"net/http"

	"github.com/gdg-garage/space-tycoon/server/stycoon"
)

func Root(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		w.WriteHeader(http.StatusNotFound)
		return
	}
}

func Data(game *stycoon.Game, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, "only GET method is supported", http.StatusBadRequest)
		return
	}
	game.Ready.RLock()
	defer game.Ready.RUnlock()
	if stycoon.SeasonChanged(game, req, game.SessionManager) {
		http.Error(w, "season changed", http.StatusForbidden)
		return
	}
	var gameData stycoon.Data
	var err error
	user, loggedErr := stycoon.LoggedUserFromSession(req, game.SessionManager)
	if loggedErr != nil {
		gameData, err = game.GetData(nil)
	} else {
		gameData, err = game.GetData(&user.PlayerId)
	}
	if err != nil {
		log.Warn().Err(err).Msg("game data fetch failed")
		http.Error(w, "db call failed", http.StatusInternalServerError)
		return
	}
	scores, err := json.Marshal(gameData)
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
}

func Commands(game *stycoon.Game, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, "only POST method is supported", http.StatusBadRequest)
		return
	}
	game.Ready.RLock()
	defer game.Ready.RUnlock()
	if stycoon.SeasonChanged(game, req, game.SessionManager) {
		http.Error(w, "season changed", http.StatusForbidden)
		return
	}
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
	user, err := stycoon.LoggedUserFromSession(req, game.SessionManager)
	if err != nil {
		log.Warn().Err(err).Msg("User is not logged in")
		http.Error(w, "only for logged users", http.StatusForbidden)
		return
	}
	errs, processsingErr := game.ProcessCommands(commands, user)
	if processsingErr != nil {
		log.Warn().Err(processsingErr).Msg("Command processing failed")
		w.WriteHeader(http.StatusInternalServerError)
	} else if len(errs) > 0 {
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
	}
}

func Reports(game *stycoon.Game, w http.ResponseWriter, req *http.Request) {
	// TODO: all the ****
	reports, _ := json.Marshal(game.Reports)
	w.Write(reports)
}
