package stycoon

import (
	"errors"
	"github.com/gorilla/sessions"
	"github.com/rs/zerolog/log"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

const SessionKey = "SESSION_ID"

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Player   string `json:"player"`
}

func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hash), err
}

func IsPasswordValid(hash string, pass string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(pass))
}

func LoggedUser(req *http.Request, sessionManager sessions.Store) (User, error) {
	session, err := sessionManager.Get(req, SessionKey)
	if err != nil {
		return User{}, errors.New("session is missing = user is not logged")
	}
	user := User{}
	if username, ok := session.Values["username"]; ok {
		if username, ok = username.(string); ok {
			user.Username = username.(string)
		} else {
			return User{}, errors.New("username is corrupted = user is not logged")
		}
	} else {
		return User{}, errors.New("username is missing = user is not logged")
	}
	if username, ok := session.Values["player"]; ok {
		if username, ok = username.(string); ok {
			user.Player = username.(string)
		} else {
			// TODO - how to handle
			log.Warn().Msg("Player is corrupted")
		}
	} else {
		// TODO - how to handle
		log.Warn().Msg("Player is not set")
	}
	return user, nil
}
