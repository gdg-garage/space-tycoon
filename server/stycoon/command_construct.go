package stycoon

import (
	"github.com/gdg-garage/space-tycoon/server/database"
)

func NewConstructCommand(command Command) *ConstructCommand {
	return &ConstructCommand{
		Type:      command.Type,
		ShipClass: command.ShipClass,
	}
}

func (game *Game) processConstruct(id int64, command Command) error {
	c := NewConstructCommand(command)
	err := AssertConstructCommandRequired(*c)
	if err != nil {
		return err
	}
	return database.InsertConstructCommand(game.db, id, c.Type, *c.ShipClass)
}
