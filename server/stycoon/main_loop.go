package stycoon

import (
	"context"
	"database/sql"
	"github.com/rs/zerolog/log"
	"sync"
	"time"
)

func callUpdate(db *sql.DB) {
	err := db.QueryRow("CALL p_update_all();").Scan()
	if err != nil {
		if err == sql.ErrNoRows {
			// Expected error
			return
		}
		log.Error().Err(err).Msg("Update call failed")
		return
	}
}

func MainLoop(db *sql.DB, ctx context.Context, wg *sync.WaitGroup) {
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			start := time.Now()
			callUpdate(db)
			log.Info().Msgf("Update took %d ms", time.Since(start).Milliseconds())
		case <-ctx.Done():
			wg.Done()
			return
		}
	}
}
