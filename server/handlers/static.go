package handlers

import (
	"github.com/gdg-garage/space-tycoon/server/stycoon"
	"github.com/rs/zerolog/log"
	"net/http"
)

func StaticGameData(game *stycoon.Game, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, "only GET method is supported", http.StatusBadRequest)
		return
	}
	_, err := w.Write(game.SerializedStaticData)
	if err != nil {
		log.Warn().Err(err).Msg("response write failed")
		w.WriteHeader(http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
}
