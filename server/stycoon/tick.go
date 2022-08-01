package stycoon

import (
	"database/sql"
	"github.com/rs/zerolog/log"
	"time"
)

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

func (game *Game) GetGameTickState() GameTickState {
	tickData := game.Tick
	tickData.TimeWaitMs = TickDuration.Milliseconds() - time.Since(game.lastTick).Milliseconds()
	return tickData
}
