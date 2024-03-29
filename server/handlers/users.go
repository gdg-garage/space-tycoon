package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/gdg-garage/space-tycoon/server/database"
	"github.com/gdg-garage/space-tycoon/server/stycoon"
	"github.com/gorilla/sessions"
	"github.com/rs/zerolog/log"
	"io/ioutil"
	"net/http"
)

const persistentLoginParam = "persistent"

func CreateUser(game *stycoon.Game, db *sql.DB, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, `{"message": "only POST method is supported""}`, http.StatusBadRequest)
		return
	}
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.Warn().Err(err).Msg("Error reading body")
		http.Error(w, `{"message": "can't read request body"}`, http.StatusBadRequest)
		return
	}
	var createUser stycoon.Credentials
	err = json.Unmarshal(body, &createUser)
	if err != nil {
		log.Warn().Err(err).Msg("Json unmarshall failed")
		http.Error(w, `{"message": "can't parse json"}`, http.StatusBadRequest)
		return
	}
	passwordHash, err := stycoon.HashPassword(createUser.Password)
	if err != nil {
		log.Warn().Err(err).Msg("hashing password failed")
		http.Error(w, `{"message": "creating user failed"}`, http.StatusInternalServerError)
		return
	}
	err = database.InsertUser(db, createUser.Username, passwordHash)
	if err != nil {
		log.Warn().Err(err).Msg("Insert user into DB failed")
		http.Error(w, `{"message": "creating user failed"}`, http.StatusInternalServerError)
		return
	}
	err = game.CreatePlayersForUsers()
	if err != nil {
		log.Warn().Err(err).Msg("Creating player for user failed")
		http.Error(w, "", http.StatusInternalServerError)
		http.Error(w, `{"message": "creating user failed"}`, http.StatusInternalServerError)
		return
	}
	r, err := json.Marshal(map[string]string{"status": "ok"})
	if err != nil {
		log.Warn().Err(err).Msg("Json marshall failed")
		http.Error(w, `{"message": "response marshal failed"}`, http.StatusInternalServerError)
		return
	}
	_, err = w.Write(r)
	if err != nil {
		log.Warn().Err(err).Msg("response write failed")
		http.Error(w, `{"message": "response write failed"}`, http.StatusInternalServerError)
		return
	}
}

func Login(game *stycoon.Game, db *sql.DB, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, `{"message": "only POST method is supported""}`, http.StatusBadRequest)
		return
	}
	game.Ready.RLock()
	defer game.Ready.RUnlock()
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.Warn().Err(err).Msg("Error reading body")
		http.Error(w, `{"message": "can't read request body"}`, http.StatusBadRequest)
		return
	}
	var userCredentials stycoon.Credentials
	err = json.Unmarshal(body, &userCredentials)
	if err != nil {
		log.Warn().Err(err).Msg("Json unmarshall failed")
		http.Error(w, `{"message": "can't parse json"}`, http.StatusBadRequest)
		return
	}
	err = stycoon.AssertCredentialsRequired(userCredentials)
	if err != nil {
		log.Warn().Err(err).Msg("credentials object is invalid")
		http.Error(w, `{"message": "invalid credentials"}`, http.StatusBadRequest)
		return
	}
	userId, hash, err := database.GetUserPassword(db, userCredentials.Username)
	if err != nil {
		log.Warn().Err(err).Str("username", userCredentials.Username).Msg("user search failed")
		http.Error(w, `{"message": "bad credentials"}`, http.StatusForbidden)
		return
	}
	err = stycoon.IsPasswordValid(hash, userCredentials.Password)
	if err != nil {
		log.Warn().Err(err).Str("username", userCredentials.Username).Msg("invalid password")
		http.Error(w, `{"message": "bad credentials"}`, http.StatusForbidden)
		return
	}
	session, _ := game.SessionManager.Get(req, stycoon.SessionKey)
	session.Values[stycoon.UsernameField] = userCredentials.Username
	playerId, err := database.GetPLayerIdForUser(userId)
	if err != nil {
		log.Warn().Err(err).Int64("userId", userId).Str("player", userCredentials.Username).Msg("Players fetch failed")
		http.Error(w, fmt.Sprintf(`{"message": "%s"}`, err.Error()), http.StatusInternalServerError)
		return
	}
	session.Values[stycoon.PlayerIdField] = playerId
	if req.URL.Query().Has(persistentLoginParam) {
		session.Values[stycoon.SeasonField] = int64(-1)
	} else {
		session.Values[stycoon.SeasonField] = game.Tick.Season
	}
	err = session.Save(req, w)
	if err != nil {
		log.Warn().Err(err).Msg("Session store failed")
		http.Error(w, fmt.Sprintf(`{"message": "%s"}`, err.Error()), http.StatusInternalServerError)
		return
	}
	log.Info().Err(err).Msgf("User logged in - session value: %v", session.Values)
	r, err := json.Marshal(stycoon.PlayerId{Id: playerId})
	if err != nil {
		log.Warn().Err(err).Msg("Json marshall failed")
		http.Error(w, `{"message": "response marshal failed"}`, http.StatusInternalServerError)
		return
	}
	_, err = w.Write(r)
	if err != nil {
		log.Warn().Err(err).Msg("response write failed")
		http.Error(w, `{"message": "response write failed"}`, http.StatusInternalServerError)
		return
	}
}

func Logout(sessionManager sessions.Store, w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		log.Warn().Str("method", req.Method).Msg("Unsupported method")
		http.Error(w, `{"message": "only GET method is supported""}`, http.StatusBadRequest)
		return
	}
	session, _ := sessionManager.Get(req, stycoon.SessionKey)
	session.Options.MaxAge = -1
	err := session.Save(req, w)
	if err != nil {
		log.Warn().Err(err).Msg("Session store failed")
		http.Error(w, fmt.Sprintf(`{"message": "%s"}`, err.Error()), http.StatusInternalServerError)
		return
	}
	_, err = w.Write([]byte(`{"message": "OK"}`))
	if err != nil {
		log.Warn().Err(err).Msg("response write failed")
		http.Error(w, `{"message": "response write failed"}`, http.StatusInternalServerError)
		return
	}
}
