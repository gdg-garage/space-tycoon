package main

import (
	"context"
	"database/sql"
	"github.com/gdg-garage/space-tycoon/server/database"
	"github.com/gdg-garage/space-tycoon/server/handlers"
	"github.com/gdg-garage/space-tycoon/server/stycoon"
	"github.com/gorilla/sessions"
	"github.com/rs/zerolog/log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"
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

func addDefaultHeaders(fn http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if origin := r.Header.Get("Origin"); origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, User-Agent")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		if r.Method == "OPTIONS" {
			return
		}
		w.Header().Set("Content-Type", "application/json")
		fn(w, r)
	}
}

func main() {
	db = database.ConnectDB()
	defer database.CloseDB(db)
	sessionManager := sessions.NewFilesystemStore("./sessions", []byte(os.Getenv("SESSION_KEY")))
	game := stycoon.NewGame(db)

	http.HandleFunc("/", addDefaultHeaders(func(w http.ResponseWriter, r *http.Request) {
		handlers.Root(w, r)
	}))
	// TODO: disable based on config
	http.HandleFunc("/create-user", addDefaultHeaders(func(w http.ResponseWriter, r *http.Request) {
		handlers.CreateUser(db, w, r)
	}))
	http.HandleFunc("/login", addDefaultHeaders(func(w http.ResponseWriter, r *http.Request) {
		handlers.Login(db, sessionManager, w, r)
	}))
	http.HandleFunc("/player-scores", addDefaultHeaders(func(w http.ResponseWriter, r *http.Request) {
		handlers.PlayerScores(game, w, r)
	}))
	http.HandleFunc("/current-tick", addDefaultHeaders(func(w http.ResponseWriter, r *http.Request) {
		handlers.CurrentTick(game, w, r)
	}))
	http.HandleFunc("/end-turn", addDefaultHeaders(func(w http.ResponseWriter, r *http.Request) {
		handlers.EndTurn(game, w, r)
	}))
	http.HandleFunc("/internal", addDefaultHeaders(func(w http.ResponseWriter, r *http.Request) {
		handlers.InternalPage(sessionManager, w, r)
	}))

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
