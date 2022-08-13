package stycoon

import (
	"database/sql"
	"time"

	"github.com/rs/zerolog/log"
)

func (game *Game) setGameTick() {
	err := game.db.QueryRow("select `season`, `tick` from t_game").Scan(&game.Tick.Season, &game.Tick.Tick)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Error().Err(err).Msg("Update tick failed - t_game is empty")
			return
		}
		log.Error().Err(err).Msg("Update tick failed")
		return
	}
}

func (game *Game) getRemainingTickTime() time.Duration {
	if game.lastTickEstimate.After(game.lastTickReal) {
		return 0
	}
	return TickDuration - time.Since(game.lastTickEstimate)
}

func (game *Game) GetGameTickState() CurrentTick {
	tickData := game.Tick
	tickData.MinTimeLeftMs = game.getRemainingTickTime().Milliseconds()
	return tickData
}

func (game *Game) EndTurn(userTick int64) CurrentTick {
	if userTick < game.Tick.Tick {
		return game.GetGameTickState()
	}
	currentTick := game.Tick.Tick
	time.Sleep(game.getRemainingTickTime())
	tickState := game.GetGameTickState()
	for tickState.Tick == currentTick {
		time.Sleep(time.Millisecond)
		tickState = game.GetGameTickState()
	}
	return tickState
}
