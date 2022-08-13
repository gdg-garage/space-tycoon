package handlers

import (
	"encoding/json"
	"github.com/gdg-garage/space-tycoon/server/stycoon"
	"github.com/rs/zerolog/log"
	"net/http"
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
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
}
