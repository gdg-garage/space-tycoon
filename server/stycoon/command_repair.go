package stycoon

import (
	"github.com/gdg-garage/space-tycoon/server/database"
)

func (game *Game) processRepair(id int64, command Command) error {
	return database.ReplaceRepairCommand(game.db, id, command.Type)
}
