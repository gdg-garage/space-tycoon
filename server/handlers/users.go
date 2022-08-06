package handlers

import (
	"database/sql"
	"encoding/json"
	"github.com/gdg-garage/space-tycoon/server/database"
	"github.com/gdg-garage/space-tycoon/server/stycoon"
	"github.com/gorilla/sessions"
	"github.com/rs/zerolog/log"
	"io/ioutil"
	"net/http"
)

func CreateUser(db *sql.DB, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, "only POST method is supported", http.StatusBadRequest)
		return
	}
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.Warn().Err(err).Msg("Error reading body")
		http.Error(w, "can't read request body", http.StatusBadRequest)
		return
	}
	var createUser stycoon.Credentials
	err = json.Unmarshal(body, &createUser)
	if err != nil {
		log.Warn().Err(err).Msg("Json unmarshall failed")
		http.Error(w, "can't parse json", http.StatusBadRequest)
		return
	}
	passwordHash, err := stycoon.HashPassword(createUser.Password)
	if err != nil {
		log.Warn().Err(err).Msg("hashing password failed")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	err = database.InsertUser(db, createUser.Username, passwordHash)
	if err != nil {
		log.Warn().Err(err).Msg("Insert user into DB failed")
		http.Error(w, "", http.StatusInternalServerError)
		return
	}
	r, err := json.Marshal(map[string]string{"status": "ok"})
	if err != nil {
		log.Warn().Err(err).Msg("Json marshall failed")
		http.Error(w, "response failed", http.StatusInternalServerError)
		return
	}
	_, err = w.Write(r)
	if err != nil {
		log.Warn().Err(err).Msg("response write failed")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
}

func Login(db *sql.DB, sessionManager sessions.Store, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, "only POST method is supported", http.StatusBadRequest)
		return
	}
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.Warn().Err(err).Msg("Error reading body")
		http.Error(w, "can't read request body", http.StatusBadRequest)
		return
	}
	var userCredentials stycoon.Credentials
	err = json.Unmarshal(body, &userCredentials)
	if err != nil {
		log.Warn().Err(err).Msg("Json unmarshall failed")
		http.Error(w, "can't parse json", http.StatusBadRequest)
		return
	}
	err = stycoon.AssertCredentialsRequired(userCredentials)
	if err != nil {
		log.Warn().Err(err).Msg("credentials object is invalid")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	userId, hash, err := database.GetUserPassword(db, userCredentials.Username)
	if err != nil {
		log.Warn().Err(err).Str("username", userCredentials.Username).Msg("user search failed")
		w.WriteHeader(http.StatusForbidden)
		return
	}
	err = stycoon.IsPasswordValid(hash, userCredentials.Password)
	if err != nil {
		log.Warn().Err(err).Str("username", userCredentials.Username).Msg("invalid password")
		w.WriteHeader(http.StatusForbidden)
		return
	}
	session, _ := sessionManager.Get(req, stycoon.SessionKey)
	session.Values[stycoon.UsernameField] = userCredentials.Username
	playerId, err := database.GetPLayerIdForUser(db, userId, userCredentials.Player)
	if err != nil {
		log.Warn().Err(err).Int64("userId", userId).Str("player", userCredentials.Player).Msg("Players fetch failed")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	session.Values[stycoon.PlayerIdField] = playerId
	err = session.Save(req, w)
	if err != nil {
		log.Warn().Err(err).Msg("Session store failed")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	log.Info().Err(err).Msgf("User logged in - session value: %v", session.Values)
	r, err := json.Marshal(stycoon.PlayerId{Id: playerId})
	if err != nil {
		log.Warn().Err(err).Msg("Json marshall failed")
		http.Error(w, "response failed", http.StatusInternalServerError)
		return
	}
	_, err = w.Write(r)
	if err != nil {
		log.Warn().Err(err).Msg("response write failed")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
}
