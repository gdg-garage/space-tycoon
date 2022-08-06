package stycoon

import (
	"context"
	"database/sql"
	"sync"
	"time"

	"github.com/rs/zerolog/log"
)

const TickDuration = time.Second

func (game *Game) callUpdate() {
	err := game.db.QueryRow("CALL p_update_all();").Scan()
	if err != nil {
		if err == sql.ErrNoRows {
			// Expected error
			return
		}
		log.Error().Err(err).Msg("Update call failed")
		return
	}
}

func (game *Game) MainLoop(ctx context.Context, wg *sync.WaitGroup) {
	ticker := time.NewTicker(TickDuration)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			start := time.Now()
			game.callUpdate()
			game.lastTick = time.Now()
			game.setGameTick()
			err := game.setPlayers()
			if err != nil {
				log.Error().Err(err).Msg("Players fetch failed")
			}
			log.Info().Msgf("Update took %d ms", time.Since(start).Milliseconds())
		case <-ctx.Done():
			wg.Done()
			return
		}
	}
}
