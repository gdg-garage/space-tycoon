package stycoon

import (
	"database/sql"
	"time"
)

type Game struct {
	Tick     GameTickState
	db       *sql.DB
	lastTick time.Time
}

func NewGame(db *sql.DB) *Game {
	game := Game{
		db:       db,
		lastTick: time.Now(),
	}
	game.getGameTick()
	return &game
}
