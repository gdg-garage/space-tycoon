package stycoon

import (
	"fmt"

	"github.com/gdg-garage/space-tycoon/server/database"
)

func NewMoveCommand(command Command) *MoveCommand {
	return &MoveCommand{
		Type:        command.Type,
		Destination: command.Destination,
	}
}

func (game *Game) CreateWaypointFromCoordinates(c []int64) (int64, error) {
	if len(c) != 2 {
		return 0, fmt.Errorf("move command: coordinates must have exactly two elements")
	}
	// TODO search for existing waypoints first
	waypointId, err := database.InsertObject(game.db, c[0], c[1])
	if err != nil {
		return 0, err
	}
	return waypointId, nil
}

func (game *Game) DetermineTarget(d Destination) (int64, error) {
	if d.Coordinates != nil && d.Target != nil {
		return 0, fmt.Errorf("move command: forbidden to specify both coordinates and target")
	}
	if d.Coordinates == nil && d.Target == nil {
		return 0, fmt.Errorf("move command: one of coordinates and target must be specified")
	}
	if d.Coordinates != nil {
		return game.CreateWaypointFromCoordinates(*d.Coordinates)
	}
	return *d.Target, nil
}

func (game *Game) processMove(id int64, command Command) error {
	c := NewMoveCommand(command)
	err := AssertMoveCommandRequired(*c)
	if err != nil {
		return err
	}
	target, err := game.DetermineTarget(*c.Destination)
	if err != nil {
		return err
	}
	return database.InsertMoveCommand(game.db, id, c.Type, target)
}
