package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/rs/zerolog/log"

	"github.com/gdg-garage/space-tycoon/server/stycoon"
)

const querySeasonParam = "season"
const queryTickParam = "tick"

func checkTickAndSeasonQueryParams(w http.ResponseWriter, req *http.Request) (int64, int64, bool, error) {
	if req.URL.Query().Has(querySeasonParam) || req.URL.Query().Has(queryTickParam) {
		if req.URL.Query().Has(querySeasonParam) && !req.URL.Query().Has(queryTickParam) {
			http.Error(w, `{"message": "tick query param has to be provided with season"}`, http.StatusBadRequest)
			return 0, 0, true, errors.New("invalid user data")
		}
		if !req.URL.Query().Has(querySeasonParam) && req.URL.Query().Has(queryTickParam) {
			http.Error(w, `{"message": "season query param has to be provided with tick"}`, http.StatusBadRequest)
			return 0, 0, true, errors.New("invalid user data")
		}
		requestedSeason, err := strconv.ParseInt(req.URL.Query().Get(querySeasonParam), 10, 64)
		if err != nil {
			http.Error(w, `{"message": "season param is not valid int"}`, http.StatusBadRequest)
			return 0, 0, true, errors.New("invalid user data")
		}
		requestedTick, err := strconv.ParseInt(req.URL.Query().Get(queryTickParam), 10, 64)
		if err != nil {
			http.Error(w, `{"message": "tick param is not valid int"}`, http.StatusBadRequest)
			return 0, 0, true, errors.New("invalid user data")
		}
		if requestedSeason <= 0 || requestedTick <= 0 {
			http.Error(w, `{"message": "param hasto be >0"}`, http.StatusBadRequest)
			return 0, 0, true, errors.New("invalid user data")
		}
		return requestedSeason, requestedTick, true, nil
	}
	return 0, 0, false, nil
}

func Data(game *stycoon.Game, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, "only GET method is supported", http.StatusBadRequest)
		return
	}
	// history
	if requestedSeason, requestedTick, requested, err := checkTickAndSeasonQueryParams(w, req); err == nil && requested {
		historyEntry, err := game.GetHistoryData(requestedSeason, requestedTick, stycoon.MaybeGetLoggedPlayerId(req, game.SessionManager))
		if err != nil {
			if err == sql.ErrNoRows {
				log.Warn().Err(err).Int64("tick", requestedTick).Int64("session", requestedSeason).Msg("history entry not found")
				w.WriteHeader(http.StatusNotFound)
				return
			}
			log.Warn().Err(err).Msg("history fetch failed")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		serializedGameData, err := json.Marshal(historyEntry)
		if err != nil {
			log.Warn().Err(err).Msg("Json marshall failed")
			http.Error(w, "response failed", http.StatusInternalServerError)
			return
		}
		_, err = w.Write(serializedGameData)
		if err != nil {
			log.Warn().Err(err).Msg("response write failed")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		return
	} else if err != nil && requested {
		return
	}

	// data for the current tick
	game.Ready.RLock()
	defer game.Ready.RUnlock()
	if stycoon.SeasonChanged(game, req, game.SessionManager) {
		http.Error(w, `{"message": "season changed"}`, http.StatusForbidden)
		return
	}
	gameData, err := game.GetData(stycoon.MaybeGetLoggedPlayerId(req, game.SessionManager))
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
		http.Error(w, `{"message": "season changed"}`, http.StatusForbidden)
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
	errs, processingErr := game.ProcessCommands(commands, user)
	if processingErr != nil {
		log.Warn().Err(processingErr).Msg("Command processing failed")
		w.WriteHeader(http.StatusInternalServerError)
	} else if len(errs) > 0 {
		w.WriteHeader(http.StatusBadRequest)
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
	}
}

func Reports(game *stycoon.Game, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, "only GET method is supported", http.StatusBadRequest)
		return
	}
	// history
	if requestedSeason, requestedTick, requested, err := checkTickAndSeasonQueryParams(w, req); err == nil && requested {
		historyEntry, err := game.GetHistoryReports(requestedSeason, requestedTick)
		if err != nil {
			if err == sql.ErrNoRows {
				log.Warn().Err(err).Int64("tick", requestedTick).Int64("session", requestedSeason).Msg("reports history entry not found")
				w.WriteHeader(http.StatusNotFound)
				return
			}
			log.Warn().Err(err).Msg("report history fetch failed")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		serializedGameData, err := json.Marshal(historyEntry)
		if err != nil {
			log.Warn().Err(err).Msg("Json marshall failed")
			http.Error(w, "response failed", http.StatusInternalServerError)
			return
		}
		_, err = w.Write(serializedGameData)
		if err != nil {
			log.Warn().Err(err).Msg("response write failed")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		return
	} else if err != nil && requested {
		return
	}

	// data for the current tick
	game.Ready.RLock()
	defer game.Ready.RUnlock()
	if stycoon.SeasonChanged(game, req, game.SessionManager) {
		http.Error(w, `{"message": "season changed"}`, http.StatusForbidden)
		return
	}
	game.ReportsReady.RLock()
	defer game.ReportsReady.RUnlock()
	reports, err := json.Marshal(game.Reports)
	if err != nil {
		log.Warn().Err(err).Msg("Json marshall failed")
		http.Error(w, "response failed", http.StatusInternalServerError)
		return
	}
	_, err = w.Write(reports)
	if err != nil {
		log.Warn().Err(err).Msg("response write failed")
		w.WriteHeader(http.StatusInternalServerError)
	}
}

func Reset(game *stycoon.Game, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, "only GET method is supported", http.StatusBadRequest)
		return
	}
	game.NextSeason()
}
