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
			game.lastTickEstimate = time.Now()
			game.Ready.Lock()
			if game.Tick.Tick > seasonDuration {
				log.Warn().Msg("Starting new season")
				game.nextSeason()
			} else {
				game.callUpdate()
			}
			game.lastTickReal = time.Now()
			err := game.setPlayers()
			if err != nil {
				log.Error().Err(err).Msg("Players fetch failed")
			}
			game.TickCond.L.Lock()
			game.setGameTick()
			// todo if season does not correspond with the current on we have to do init
			game.TickCond.L.Unlock()
			game.TickCond.Broadcast()
			go game.fillAllReportsForPreviousTick()
			go func(game *Game) {
				err := game.reportHistory()
				if err != nil {
					log.Warn().Err(err).Msg("history report failed")
				}
			}(game)
			game.Ready.Unlock()
			log.Info().Int64("tick", game.Tick.Tick).Msgf("Update took %d ms", time.Since(start).Milliseconds())
		case <-ctx.Done():
			wg.Done()
			return
		}
	}
}
