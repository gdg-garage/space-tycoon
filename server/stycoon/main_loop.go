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
	err := game.db.QueryRow("call p_update_all()").Scan()
	if err != nil {
		if err == sql.ErrNoRows {
			// Expected error
			return
		}
		log.Error().Err(err).Msg("Update call failed")
		return
	}
}

func (game *Game) nextSeason() {
	err := game.db.QueryRow("call p_reset_all()").Scan()
	if err != nil {
		if err != sql.ErrNoRows {
			log.Error().Err(err).Msg("Update season call failed")
			return
		}
	}
	err = game.Init()
	if err != nil {
		log.Error().Err(err).Msg("Init game after new season failed")
	}
}

func (game *Game) MainLoop(ctx context.Context, wg *sync.WaitGroup) {
	ticker := time.NewTicker(TickDuration)
	// TODO make this configurable
	seasonDuration := 2 * int64(time.Hour.Seconds())
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			start := time.Now()
			game.callUpdate()
			game.lastTick = time.Now()
			game.Ready.Lock()
			game.setGameTick()
			if game.Tick.Tick > seasonDuration {
				log.Warn().Msg("Starting new season")
				game.nextSeason()
			}
			err := game.setPlayers()
			if err != nil {
				log.Error().Err(err).Msg("Players fetch failed")
			}
			game.Ready.Unlock()
			log.Info().Msgf("Update took %d ms", time.Since(start).Milliseconds())
		case <-ctx.Done():
			wg.Done()
			return
		}
	}
}
