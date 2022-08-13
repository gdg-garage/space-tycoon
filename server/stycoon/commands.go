package stycoon

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/gdg-garage/space-tycoon/server/database"
	"github.com/rs/zerolog/log"
)

func ParseCommands(s string) (map[string]Command, error) {
	var c map[string]Command
	err := json.Unmarshal([]byte(s), &c)
	return c, err
}

func (game *Game) ProcessCommands(commands map[string]Command, user LoggedUser) (map[string]string, error) {
	res := map[string]string{}
	playerOwnedShips, err := database.GetPlayerOwnedShips(game.db, user.PlayerId)
	if err != nil {
		return res, fmt.Errorf("unable fetch ships owned by player: %v", err)
	}
	for strId, command := range commands {
		id, err := strconv.Atoi(strId)
		if err != nil {
			res[strId] = fmt.Sprintf("unable to convert id to number")
			continue
		}
		log.Info().Msgf("id: %d, command_type: %s", id, command.Type)

		_, ownedByPlayer := playerOwnedShips[int64(id)]
		if !ownedByPlayer {
			res[strId] = fmt.Sprintf("object id: %d does not belong to player id: %d", id, user.PlayerId)
			continue
		}

		switch command.Type {
		case "move":
			err = game.processMove(int64(id), command)
		case "construct":
			err = game.processConstruct(int64(id), command)
		case "attack":
			err = game.processAttack(int64(id), command)
		case "trade":
			err = game.processTrade(int64(id), user.PlayerId, command)
		case "rename":
			err = game.processRename(int64(id), command)
		case "decommission":
			err = game.processDecommission(int64(id), command)
		case "stop":
			err = game.processStop(int64(id))
		default:
			err = fmt.Errorf("unrecognized command type: %s", command.Type)
		}
		if err != nil {
			res[strId] = err.Error()
		}
	}
	return res, nil
}
