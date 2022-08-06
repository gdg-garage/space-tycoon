package stycoon

import (
	"github.com/gdg-garage/space-tycoon/server/database"
)

func NewAttackCommand(command Command) *AttackCommand {
	return &AttackCommand{
		Type:   command.Type,
		Target: command.Target,
	}
}

func (game *Game) processAttack(id int64, command Command) error {
	c := NewAttackCommand(command)
	err := AssertAttackCommandRequired(*c)
	if err != nil {
		return err
	}
	return database.InsertAttackCommand(game.db, id, c.Type, *c.Target)
}
