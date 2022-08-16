package stycoon

import (
	"fmt"
	"strconv"

	"github.com/gdg-garage/space-tycoon/server/database"
)

func NewMoveCommand(command Command) *MoveCommand {
	return &MoveCommand{
		Type:        command.Type,
		Destination: command.Destination,
	}
}

func (game *Game) CreateWaypointFromCoordinates(c []int64) (string, error) {
	if len(c) != 2 {
		return "", fmt.Errorf("move command: coordinates must have exactly two elements")
	}
	// TODO search for existing waypoints first
	waypointId, err := database.InsertObject(game.db, c[0], c[1])
	if err != nil {
		return "", err
	}
	return strconv.Itoa(int(waypointId)), nil
}

func (game *Game) DetermineTarget(d Destination) (string, error) {
	if d.Coordinates != nil && d.Target != nil {
		return "", fmt.Errorf("move command: forbidden to specify both coordinates and target")
	}
	if d.Coordinates == nil && d.Target == nil {
		return "", fmt.Errorf("move command: one of coordinates and target must be specified")
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

	targetInt, err := strconv.Atoi(target)
	if err != nil {
		return err
	}

	return database.ReplaceMoveCommand(game.db, id, command.Type, int64(targetInt))
}
