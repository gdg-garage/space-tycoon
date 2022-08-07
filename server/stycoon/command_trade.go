package stycoon

import (
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

func (game *Game) processTrade(id int64, command Command) error {
	c := NewTradeCommand(command)
	err := AssertTradeCommandRequired(*c)
	if err != nil {
		return err
	}
	// TODO should we validate trading with own ships?
	return database.InsertTradeCommand(game.db, id, command.Type, *c.Target, *c.Resource, *c.Amount)
}
