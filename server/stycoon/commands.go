package stycoon

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/rs/zerolog/log"
)

func ParseCommands(s string) (map[string]Command, error) {
	var c map[string]Command
	err := json.Unmarshal([]byte(s), &c)
	return c, err
}

func (game *Game) ProcessCommands(commands map[string]Command) map[string]string {
	res := map[string]string{}
	for strId, command := range commands {
		id, err := strconv.Atoi(strId)
		if err != nil {
			res[strId] = fmt.Sprintf("unable to convert id to number")
			continue
		}
		log.Info().Msgf("id: %d, command_type: %s", id, command.Type)

		switch command.Type {
		case "move":
			err = game.processMove(int64(id), command)
		case "construct":
			err = game.processConstruct(int64(id), command)
		case "attack":
			err = game.processAttack(int64(id), command)
		case "trade":
			err = game.processTrade(int64(id), command)
		case "rename":
			err = game.processRename(int64(id), command)
		case "decommission":
			err = game.processDecommission(int64(id))
		case "stop":
			err = game.processStop(int64(id))
		default:
			err = fmt.Errorf("unrecognized command type: %s", command.Type)
		}
		if err != nil {
			res[strId] = err.Error()
		}
	}
	return res
}
