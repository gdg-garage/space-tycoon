package stycoon

import (
	"github.com/gdg-garage/space-tycoon/server/database"
)

func NewRenameCommand(command Command) *RenameCommand {
	return &RenameCommand{
		Type: command.Type,
		Name: command.Name,
	}
}

func (game *Game) processRename(id int64, command Command) error {
	c := NewRenameCommand(command)
	err := AssertRenameCommandRequired(*c)
	if err != nil {
		return err
	}
	// TODO players should be able to rename only ships they own
	return database.ProcessRename(game.db, id, *c.Name)
}
