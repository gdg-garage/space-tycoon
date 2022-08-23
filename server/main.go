package main

import (
	"context"
	"database/sql"
	"flag"
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
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		fn(w, r)
	}
}

func main() {
	dev := flag.Bool("dev", false, "should the server run in dev mode (for debug)")
	flag.Parse()

	if *dev {
		log.Warn().Msg("RUNNING IN DEV MODE!")
	}

	db = database.ConnectDBWithRetries()
	defer database.CloseDB(db)
	sessionManager := sessions.NewFilesystemStore("./sessions", []byte(os.Getenv("SESSION_KEY")))
	game, err := stycoon.NewGame(db, sessionManager)
	if err != nil {
		log.Fatal().Err(err).Msg("Game object init failed")
	}

	http.HandleFunc("/", addDefaultHeaders(handlers.Root))
	if *dev {
		http.HandleFunc("/create-user", addDefaultHeaders(func(w http.ResponseWriter, r *http.Request) {
			handlers.CreateUser(game, db, w, r)
		}))
		http.HandleFunc("/reset", addDefaultHeaders(func(w http.ResponseWriter, r *http.Request) {
			handlers.Reset(game, w, r)
		}))
	}
	http.HandleFunc("/login", addDefaultHeaders(func(w http.ResponseWriter, r *http.Request) {
		handlers.Login(game, db, w, r)
	}))
	http.HandleFunc("/logout", addDefaultHeaders(func(w http.ResponseWriter, r *http.Request) {
		handlers.Logout(sessionManager, w, r)
	}))
	http.HandleFunc("/data", addDefaultHeaders(func(w http.ResponseWriter, r *http.Request) {
		handlers.Data(game, w, r)
	}))
	http.HandleFunc("/current-tick", addDefaultHeaders(func(w http.ResponseWriter, r *http.Request) {
		handlers.CurrentTick(game, w, r)
	}))
	http.HandleFunc("/static-data", addDefaultHeaders(func(w http.ResponseWriter, r *http.Request) {
		handlers.StaticGameData(game, w, r)
	}))
	http.HandleFunc("/end-turn", addDefaultHeaders(func(w http.ResponseWriter, r *http.Request) {
		handlers.EndTurn(game, w, r)
	}))
	http.HandleFunc("/commands", addDefaultHeaders(func(w http.ResponseWriter, r *http.Request) {
		handlers.Commands(game, w, r)
	}))
	http.HandleFunc("/reports", addDefaultHeaders(func(w http.ResponseWriter, r *http.Request) {
		handlers.Reports(game, w, r)
	}))

	wg := &sync.WaitGroup{}
	ctx := context.Background()
	ctx, stop := signal.NotifyContext(ctx, os.Interrupt, syscall.SIGTERM)
	defer stop()

	wg.Add(1)
	go game.MainLoop(ctx, wg)

	serve(ctx, wg)

	wg.Wait()
}
