package handlers

import (
	"encoding/json"
	"github.com/gdg-garage/space-tycoon/server/stycoon"
	"github.com/rs/zerolog/log"
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
