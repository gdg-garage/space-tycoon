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
	return TickDuration - time.Since(game.lastTick)
}

func (game *Game) GetGameTickState() CurrentTick {
	tickData := game.Tick
	tickData.TimeLeftMs = game.getRemainingTickTime().Milliseconds()
	if tickData.TimeLeftMs == 0 {
		tickData.TimeLeftMs = TickDuration.Milliseconds()
	}
	return tickData
}

func (game *Game) EndTurn(tick int64) CurrentTick {
	if tick < game.Tick.Tick {
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
