package main

import (
	"context"
	"database/sql"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/gdg-garage/space-tycoon/server/database"
	"github.com/gdg-garage/space-tycoon/server/handlers"
	"github.com/gdg-garage/space-tycoon/server/stycoon"
	"github.com/rs/zerolog/log"
)

var db *sql.DB

func serve(ctx context.Context, wg *sync.WaitGroup) {
	address := ":80"
	log.Info().Msgf("Listening on %s", address)
	server := &http.Server{Addr: address, Handler: nil}

	wg.Add(1)
	go func(ctx context.Context, server *http.Server, wg *sync.WaitGroup) {
		select {
		case <-ctx.Done():
			defer wg.Done()
			ctxShutDown, cancel := context.WithTimeout(context.Background(), 3*time.Second)
			defer cancel()
			err := server.Shutdown(ctxShutDown)
			if err != nil {
				log.Error().Err(err)
			}
		}
	}(ctx, server, wg)

	err := server.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		log.Fatal().Err(err)
	}
}

func main() {
	db = database.ConnectDB()
	defer database.CloseDB(db)
	game := stycoon.NewGame(db)

	http.HandleFunc("/", handlers.Root)
	// TODO: disable based on config
	http.HandleFunc("/create-user", func(w http.ResponseWriter, r *http.Request) {
		handlers.CreateUser(db, w, r)
	})
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		handlers.Login(db, w, r)
	})
	http.HandleFunc("/player-scores", func(w http.ResponseWriter, r *http.Request) {
		handlers.PlayerScores(game, w, r)
	})
	http.HandleFunc("/current-tick", func(w http.ResponseWriter, r *http.Request) {
		handlers.CurrentTick(game, w, r)
	})
	http.HandleFunc("/end-turn", func(w http.ResponseWriter, r *http.Request) {
		handlers.EndTurn(game, w, r)
	})

	wg := &sync.WaitGroup{}
	ctx := context.Background()
	ctx, stop := signal.NotifyContext(ctx, os.Interrupt, syscall.SIGTERM)
	defer stop()

	wg.Add(1)
	go game.MainLoop(ctx, wg)
	// TODO add code for starting new season

	serve(ctx, wg)

	wg.Wait()
}
