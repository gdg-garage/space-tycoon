package stycoon

import (
	"fmt"
	"strconv"

	"github.com/gdg-garage/space-tycoon/server/database"
)

func NewTradeCommand(command Command) *TradeCommand {
	return &TradeCommand{
		Type:     command.Type,
		Amount:   command.Amount,
		Resource: command.Resource,
		Target:   command.Target,
	}
}

func (game *Game) processTrade(id int64, playerOwnedShips map[int64]struct{}, planetIDs map[int64]struct{}, command Command) error {
	c := NewTradeCommand(command)
	err := AssertTradeCommandRequired(*c)
	if err != nil {
		return err
	}

	_, shipOwnedByPlayer := playerOwnedShips[id]
	_, targetIsPlanet := planetIDs[id]

	target, err := strconv.Atoi(*c.Target)
	if err != nil {
		return err
	}

	resource, err := strconv.Atoi(*c.Resource)
	if err != nil {
		return err
	}

	if shipOwnedByPlayer || targetIsPlanet {
		return database.ReplaceTradeCommand(game.db, id, command.Type, int64(target), int64(resource), *c.Amount)
	}
	return fmt.Errorf("trading with another players ship is forbidden")
}
