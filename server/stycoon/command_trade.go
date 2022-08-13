package stycoon

import (
	"fmt"

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

func (game *Game) processTrade(id int64, playerOwnedShips map[int64]struct{}, command Command) error {
	c := NewTradeCommand(command)
	err := AssertTradeCommandRequired(*c)
	if err != nil {
		return err
	}

	_, shipOwnedByPlayer := playerOwnedShips[int64(id)]
	if shipOwnedByPlayer {
		return database.ReplaceTradeCommand(game.db, id, command.Type, *c.Target, *c.Resource, *c.Amount)
	}

	targetIsPlanet, err := database.CheckObjectIsPlanet(game.db, id)
	if err != nil {
		return err
	}
	if !targetIsPlanet {
		return fmt.Errorf("trading with another players ship is forbidden")
	}
	return database.ReplaceTradeCommand(game.db, id, command.Type, *c.Target, *c.Resource, *c.Amount)
}
