package handlers

import (
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/rs/zerolog/log"

	"github.com/gdg-garage/space-tycoon/server/stycoon"
)

const querySeasonParam = "season"
const queryTickParam = "tick"

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
	if req.URL.Query().Has(querySeasonParam) || req.URL.Query().Has(queryTickParam) {
		if req.URL.Query().Has(querySeasonParam) && !req.URL.Query().Has(queryTickParam) {
			http.Error(w, `{"message": "tick query param has to be provided with season"}`, http.StatusBadRequest)
			return
		}
		if !req.URL.Query().Has(querySeasonParam) && req.URL.Query().Has(queryTickParam) {
			http.Error(w, `{"message": "season query param has to be provided with tick"}`, http.StatusBadRequest)
			return
		}
		requestedSeason, err := strconv.ParseInt(req.URL.Query().Get(querySeasonParam), 10, 64)
		if err != nil {
			http.Error(w, `{"message": "season param is not valid int"}`, http.StatusBadRequest)
			return
		}
		requestedTick, err := strconv.ParseInt(req.URL.Query().Get(queryTickParam), 10, 64)
		if err != nil {
			http.Error(w, `{"message": "tick param is not valid int"}`, http.StatusBadRequest)
			return
		}
		historyEntry, err := game.HistoryData(requestedSeason, requestedTick, stycoon.MaybeGetLoggedPlayerId(req, game.SessionManager))
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
	}

	// we want data for the current tick
	game.Ready.RLock()
	defer game.Ready.RUnlock()
	if stycoon.SeasonChanged(game, req, game.SessionManager) {
		http.Error(w, "season changed", http.StatusForbidden)
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
	errs, processingErr := game.ProcessCommands(commands, user)
	if processingErr != nil {
		log.Warn().Err(processingErr).Msg("Command processing failed")
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
	// TODO: maybe only for logged users?
	// var err error
	// _, err = stycoon.LoggedUserFromSession(req, game.SessionManager)
	// if err != nil {
	// 	log.Warn().Err(err).Msg("User is not logged in")
	// 	http.Error(w, "only for logged users", http.StatusForbidden)
	// 	return
	// }
	// TODO: maybe only return player reports?
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

//func HistoryData(game *stycoon.Game, sessionManager sessions.Store, w http.ResponseWriter, req *http.Request) {
//	if req.Method != http.MethodPost {
//		log.Warn().Str("method", req.Method).Msg("Unsupported method")
//		http.Error(w, "only POST method is supported", http.StatusBadRequest)
//		return
//	}
//	body, err := ioutil.ReadAll(req.Body)
//	if err != nil {
//		log.Warn().Err(err).Msg("Error reading body")
//		http.Error(w, "can't read request body", http.StatusBadRequest)
//		return
//	}
//	var historyIdentifier stycoon.HistoryIdentifier
//	err = json.Unmarshal(body, &historyIdentifier)
//	if err != nil {
//		log.Warn().Err(err).Msg("Json unmarshall failed")
//		http.Error(w, "can't parse json", http.StatusBadRequest)
//		return
//	}
//	err = stycoon.AssertHistoryIdentifierRequired(historyIdentifier)
//	if err != nil {
//		log.Warn().Err(err).Msg("history identifier object is invalid")
//		w.WriteHeader(http.StatusBadRequest)
//		return
//	}
//	if historyIdentifier.Tick <= 0 || historyIdentifier.Season <= 0 {
//		log.Warn().Msg("input is negative")
//		http.Error(w, "invalid input", http.StatusBadRequest)
//		return
//	}
//	historyEntry, err := game.HistoryData(historyIdentifier, stycoon.MaybeGetLoggedPlayerId(req, sessionManager))
//	if err != nil {
//		if err == sql.ErrNoRows {
//			log.Warn().Err(err).Int64("tick", historyIdentifier.Tick).Int64("session", historyIdentifier.Season).Msg("history entry not found")
//			w.WriteHeader(http.StatusNotFound)
//			return
//		}
//		log.Warn().Err(err).Msg("history fetch failed")
//		w.WriteHeader(http.StatusInternalServerError)
//		return
//	}
//	history, err := json.Marshal(historyEntry)
//	if err != nil {
//		log.Warn().Err(err).Msg("Json marshall failed")
//		http.Error(w, "response failed", http.StatusInternalServerError)
//		return
//	}
//	_, err = w.Write(history)
//	if err != nil {
//		log.Warn().Err(err).Msg("response write failed")
//		w.WriteHeader(http.StatusInternalServerError)
//	}
//}
