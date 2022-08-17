package handlers

import (
	"github.com/gdg-garage/space-tycoon/server/stycoon"
	"github.com/rs/zerolog/log"
	"net/http"
	"strconv"
)

func StaticGameData(game *stycoon.Game, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, "only GET method is supported", http.StatusBadRequest)
		return
	}
	if req.URL.Query().Has(querySeasonParam) {
		requestedSeason, err := strconv.Atoi(req.URL.Query().Get(querySeasonParam))
		staticData, err := game.HistoricStaticData(requestedSeason)
		if err != nil {
			log.Warn().Err(err).Int("season", requestedSeason).Msg("fetch historic static data failed")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		_, err = w.Write([]byte(staticData))
		if err != nil {
			log.Warn().Err(err).Msg("response write failed")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		return
	}
	game.Ready.RLock()
	defer game.Ready.RUnlock()

	if stycoon.SeasonChanged(game, req, game.SessionManager) {
		http.Error(w, "season changed", http.StatusForbidden)
		return
	}
	_, err := w.Write(game.SerializedStaticData)
	if err != nil {
		log.Warn().Err(err).Msg("response write failed")
		w.WriteHeader(http.StatusInternalServerError)
	}
}
