package stycoon

import (
	"github.com/gdg-garage/space-tycoon/server/database"
)

func (game *Game) processDecommission(id int64) error {
	return database.ProcessDecommission(game.db, id)
}
