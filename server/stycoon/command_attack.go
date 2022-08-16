package stycoon

import (
	"strconv"

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

	targetInt, err := strconv.Atoi(*c.Target)
	if err != nil {
		return err
	}

	return database.ReplaceAttackCommand(game.db, id, command.Type, int64(targetInt))
}
