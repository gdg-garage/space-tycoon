package handlers

import (
	"encoding/json"
	"github.com/gdg-garage/space-tycoon/server/stycoon"
	"github.com/rs/zerolog/log"
	"io/ioutil"
	"net/http"
)

func CurrentTick(game *stycoon.Game, w http.ResponseWriter, req *http.Request) {
	tickData := game.GetGameTickState()
	tick, err := json.Marshal(tickData)
	if err != nil {
		log.Warn().Err(err).Msg("Json marshall failed")
		http.Error(w, "response failed", http.StatusInternalServerError)
		return
	}
	_, err = w.Write(tick)
	if err != nil {
		log.Warn().Err(err).Msg("response write failed")
		w.WriteHeader(http.StatusInternalServerError)
	}
}

func EndTurn(game *stycoon.Game, w http.ResponseWriter, req *http.Request) {
	// TODO not sure if this should be only for logged users
	// TODO add dev server functionality
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.Warn().Err(err).Msg("Error reading body")
		http.Error(w, "can't read request body", http.StatusBadRequest)
		return
	}
	var userTick stycoon.Tick
	err = json.Unmarshal(body, &userTick)
	if err != nil {
		log.Warn().Err(err).Msg("Json unmarshall failed")
		http.Error(w, "can't parse json", http.StatusBadRequest)
		return
	}
	tickData := game.EndTurn(userTick.Tick)
	tick, err := json.Marshal(tickData)
	if err != nil {
		log.Warn().Err(err).Msg("Json marshall failed")
		http.Error(w, "response failed", http.StatusInternalServerError)
		return
	}
	_, err = w.Write(tick)
	if err != nil {
		log.Warn().Err(err).Msg("response write failed")
		w.WriteHeader(http.StatusInternalServerError)
	}
}
