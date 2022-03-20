package stycoon

import (
	"context"
	"database/sql"
	log "github.com/sirupsen/logrus"
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
		log.Errorf("Update call failed %v", err)
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
			log.Infof("Update took %d ms", time.Since(start).Milliseconds())
		case <-ctx.Done():
			wg.Done()
			return
		}
	}
}
