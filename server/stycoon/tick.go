package stycoon

import (
	"database/sql"
	"github.com/rs/zerolog/log"
	"time"
)

type Tick struct {
	Tick int64 `json:"tick"`
}

func (game *Game) getGameTick() {
	err := game.db.QueryRow("select * from t_game").Scan(&game.Tick.Season, &game.Tick.Tick)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Error().Err(err).Msg("Update tick failed - t_game is empty")
			return
		}
		log.Error().Err(err).Msg("Update tick failed")
		return
	}
}

func (game *Game) getTickWait() time.Duration {
	return TickDuration - time.Since(game.lastTick)
}

func (game *Game) GetGameTickState() CurrentTick {
	tickData := game.Tick
<<<<<<< HEAD
	tickData.TimeLeftMs = game.getTickWaitMs()
=======
	tickData.TimeWaitMs = game.getTickWait().Milliseconds()
>>>>>>> cdcf03c (end-turn endpoint)
	return tickData
}

func (game *Game) EndTurn(tick int64) GameTickState {
	if tick < game.Tick.Tick {
		return game.GetGameTickState()
	}
	currentTick := game.Tick.Tick
	time.Sleep(game.getTickWait())
	tickState := game.GetGameTickState()
	for tickState.Tick == currentTick {
		time.Sleep(time.Millisecond)
		tickState = game.GetGameTickState()
	}
	return tickState
}
