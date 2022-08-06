package stycoon

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"strconv"
	"time"
)

type Game struct {
	Tick     CurrentTick
	db       *sql.DB
	lastTick time.Time
	players  map[string]PlayersValue
}

func NewGame(db *sql.DB) *Game {
	game := Game{
		db:       db,
		lastTick: time.Now(),
	}
	game.setGameTick()
	return &game
}

func (game *Game) GetData(playerId *int64) (Data, error) {
	data := Data{
		CurrentTick: game.Tick,
		PlayerId:    playerId,
		Players:     game.players,
	}

	return data, nil
}

func (game *Game) SetPlayers() error {
	var players = make(map[string]PlayersValue)
	rows, err := game.db.Query("select `id`, `name`, `color`, `money` from t_player")
	if err != nil {
		return fmt.Errorf("query failed %v", err)
	}
	var id int
	var player PlayersValue
	var color string
	for rows.Next() {
		err = rows.Scan(&id, &player.Name, &color, &player.NetWorth.Money)
		if err != nil {
			return fmt.Errorf("row read failed %v", err)
		}
		err = json.Unmarshal([]byte(color), &player.Color)
		if err != nil {
			return err
		}
		err = game.SetPlayerNetWorth(id, &player.NetWorth)
		if err != nil {
			return err
		}
		players[strconv.Itoa(id)] = player
	}
	if err = rows.Err(); err != nil {
		return fmt.Errorf("rows read failed: %v", err)
	}
	game.players = players
	return nil
}

func (game *Game) SetPlayerNetWorth(playerId int, playerNetWorth *NetWorth) error {
	err := game.db.QueryRow("select `price` from v_player_ships_worth where player = ?", playerId).Scan(&playerNetWorth.Ships)
	if err != nil {
		return err
	}
	err = game.db.QueryRow("select `price` from v_player_commodities_worth where player = ?", playerId).Scan(&playerNetWorth.Resources)
	if err != nil {
		return err
	}
	err = game.db.QueryRow("select `price` from v_player_total_worth where player = ?", playerId).Scan(&playerNetWorth.Total)
	if err != nil {
		return err
	}
	return nil
}
