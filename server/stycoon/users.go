package stycoon

import (
	"errors"
	"github.com/gorilla/sessions"
	"github.com/rs/zerolog/log"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

const SessionKey = "SESSION_ID"

func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hash), err
}

func IsPasswordValid(hash string, pass string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(pass))
}

func LoggedUser(req *http.Request, sessionManager sessions.Store) (Credentials, error) {
	session, err := sessionManager.Get(req, SessionKey)
	if err != nil {
		return Credentials{}, errors.New("session is missing = user is not logged")
	}
	user := Credentials{}
	if username, ok := session.Values["username"]; ok {
		if username, ok = username.(string); ok {
			user.Name = username.(string)
		} else {
			return Credentials{}, errors.New("username is corrupted = user is not logged")
		}
	} else {
		return Credentials{}, errors.New("username is missing = user is not logged")
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
