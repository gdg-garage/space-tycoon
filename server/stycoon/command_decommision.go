package stycoon

import (
	"github.com/gdg-garage/space-tycoon/server/database"
)

func (game *Game) processDecommission(id int64, command Command) error {
	return database.InsertDecommissionCommand(game.db, id, command.Type)
}
