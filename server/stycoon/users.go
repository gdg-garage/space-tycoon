package stycoon

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gorilla/sessions"
	"github.com/rs/zerolog/log"
	"golang.org/x/crypto/bcrypt"
)

const SessionKey = "SESSION_ID"
const UsernameField = "username"
const PlayerIdField = "playerId"
const SeasonField = "season"

type LoggedUser struct {
	Username string
	PlayerId string
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
		if player, ok := maybePlayer.(string); ok {
			user.PlayerId = player
		} else {
			return user, errors.New("player is corrupted")
		}
	} else {
		return user, errors.New("player is not set")
	}
	return user, nil
}

func SeasonChanged(game *Game, req *http.Request, sessionManager sessions.Store) bool {
	session, err := sessionManager.Get(req, SessionKey)
	if err != nil {
		return false
	}
	if maybeSeason, ok := session.Values[SeasonField]; ok {
		if season, ok := maybeSeason.(int64); ok {
			if game.Tick.Season != season {
				log.Info().Msgf("season changed for user [%v]", session.Values[UsernameField])
				return true
			}
		} else {
			log.Warn().Msgf("user is corrupted, %v", session.Values)
			return true
		}
	} else if len(session.Values) > 0 {
		log.Warn().Msgf("user season field is missing, %v", session.Values)
		return true
	}
	return false
}

func MaybeGetLoggedPlayerId(req *http.Request, sessionManager sessions.Store) *string {
	user, err := LoggedUserFromSession(req, sessionManager)
	if err != nil {
		return nil
	}
	// To be extra sure that none can get -1 (which is allowed to get everything)
	playerIdInt, err := strconv.Atoi(user.PlayerId)
	if err != nil {
		return nil
	}
	if playerIdInt <= 0 {
		return nil
	}
	return &user.PlayerId
}
