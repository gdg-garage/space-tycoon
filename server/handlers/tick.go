package handlers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/gdg-garage/space-tycoon/server/stycoon"
	"github.com/rs/zerolog/log"
)

func CurrentTick(game *stycoon.Game, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, `{"message": "only GET method is supported""}`, http.StatusBadRequest)
		return
	}
	game.Ready.RLock()
	defer game.Ready.RUnlock()
	if stycoon.SeasonChanged(game, req, game.SessionManager) {
		http.Error(w, `{"message": "season changed"}`, http.StatusForbidden)
		return
	}
	tickData := game.GetGameTickState()
	tick, err := json.Marshal(tickData)
	if err != nil {
		log.Warn().Err(err).Msg("Json marshall failed")
		http.Error(w, `{"message": "response marshal failed"}`, http.StatusInternalServerError)
		return
	}
	_, err = w.Write(tick)
	if err != nil {
		log.Warn().Err(err).Msg("response write failed")
		http.Error(w, `{"message": "response write failed"}`, http.StatusInternalServerError)
	}
}

func EndTurn(game *stycoon.Game, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, `{"message": "only POST method is supported""}`, http.StatusBadRequest)
		return
	}
	game.Ready.RLock()
	if stycoon.SeasonChanged(game, req, game.SessionManager) {
		http.Error(w, `{"message": "season changed"}`, http.StatusForbidden)
		return
	}
	game.Ready.RUnlock()
	// TODO not sure if this should be only for logged users
	// TODO add dev server functionality
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.Warn().Err(err).Msg("Error reading body")
		http.Error(w, `{"message": "can't read request body"}`, http.StatusBadRequest)
		return
	}
	var userTick stycoon.EndTurn
	err = json.Unmarshal(body, &userTick)
	if err != nil {
		log.Warn().Err(err).Msg("Json unmarshall failed")
		http.Error(w, `{"message": "can't parse json"}`, http.StatusBadRequest)
		return
	}
	err = stycoon.AssertEndTurnRequired(userTick)
	if err != nil {
		log.Warn().Err(err).Msg("end turn object is invalid")
		http.Error(w, `{"message": "end turn object is invalid"}`, http.StatusBadRequest)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	tickData := game.EndTurn(userTick)
	tick, err := json.Marshal(tickData)
	if err != nil {
		log.Warn().Err(err).Msg("Json marshall failed")
		http.Error(w, `{"message": "response marshal failed"}`, http.StatusInternalServerError)
		return
	}
	_, err = w.Write(tick)
	if err != nil {
		log.Warn().Err(err).Msg("response write failed")
		http.Error(w, `{"message": "response write failed"}`, http.StatusInternalServerError)
	}
}
