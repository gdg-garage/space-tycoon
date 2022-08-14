package stycoon

import (
	"github.com/gdg-garage/space-tycoon/server/database"
)

func (game *Game) processStop(id int64) error {
	return database.StopCommand(game.db, id)
}
