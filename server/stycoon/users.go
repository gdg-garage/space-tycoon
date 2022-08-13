package stycoon

import (
	"errors"
	"github.com/gorilla/sessions"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

const SessionKey = "SESSION_ID"
const UsernameField = "username"
const PlayerIdField = "playerId"

type LoggedUser struct {
	Username string
	PlayerId int64
}

func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hash), err
}

func IsPasswordValid(hash string, pass string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(pass))
}

func LoggedUserFromSession(req *http.Request, sessionManager sessions.Store) (LoggedUser, error) {
	session, err := sessionManager.Get(req, SessionKey)
	user := LoggedUser{}
	if err != nil {
		return user, errors.New("session is missing = user is not logged")
	}
	if maybeUsername, ok := session.Values[UsernameField]; ok {
		if username, ok := maybeUsername.(string); ok {
			user.Username = username
		} else {
			return user, errors.New("username is corrupted = user is not logged")
		}
	} else {
		return user, errors.New("username is missing = user is not logged")
	}
	if maybePlayer, ok := session.Values[PlayerIdField]; ok {
		if player, ok := maybePlayer.(int64); ok {
			user.PlayerId = player
		} else {
			return user, errors.New("player is corrupted")
		}
	} else {
		return user, errors.New("player is not set")
	}
	return user, nil
}

func MaybeGetLoggedPlayerId(req *http.Request, sessionManager sessions.Store) *int64 {
	user, err := LoggedUserFromSession(req, sessionManager)
	if err != nil {
		return nil
	}
	// To be extra sure that none can get -1 (which is allowed to ge everything)
	if user.PlayerId <= 0 {
		return nil
	}
	return &user.PlayerId
}
