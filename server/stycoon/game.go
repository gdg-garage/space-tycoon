package stycoon

import (
	"database/sql"
	"fmt"
	"strconv"
	"time"
)

type Game struct {
	Tick     CurrentTick
	db       *sql.DB
	lastTick time.Time
}

func NewGame(db *sql.DB) *Game {
	game := Game{
		db:       db,
		lastTick: time.Now(),
	}
	game.getGameTick()
	return &game
}

func (game *Game) GetData(playerId *int64) (Data, error) {
	data := Data{
		CurrentTick: game.Tick,
		PlayerId:    playerId,
	}

	// TODO this may be cached on the game object
	players, err := game.GetPlayers()
	if err != nil {
		return data, err
	}
	data.Players = players

	return data, nil
}

func (game *Game) GetPlayers() (map[string]PlayersValue, error) {
	var players = make(map[string]PlayersValue)
	rows, err := game.db.Query("select `id`, `name`, `money` from t_player")
	//rows, err := game.db.Query("select `id`, `name`, `color`, `money` from t_player")
	if err != nil {
		return players, fmt.Errorf("query failed %v", err)
	}
	var id int
	var player PlayersValue
	for rows.Next() {
		err = rows.Scan(&id, &player.Name, &player.NetWorth.Money)
		//err = rows.Scan(&id, &player.Name, &player.Color, &player.NetWorth.Money)
		if err != nil {
			return players, fmt.Errorf("row read failed %v", err)
		}
		err = game.SetPlayerNetWorth(id, &player.NetWorth)
		if err != nil {
			return players, err
		}
		players[strconv.Itoa(id)] = player
	}
	if err = rows.Err(); err != nil {
		return players, fmt.Errorf("rows read failed: %v", err)
	}
	return players, nil
}

func (game *Game) SetPlayerNetWorth(playerId int, playerNetWorth *NetWorth) error {
	var value float64
	err := game.db.QueryRow("select `price` from v_player_ships_worth where player = ?", playerId).Scan(&value)
	if err != nil {
		return err
	}
	playerNetWorth.Ships = int64(value)
	err = game.db.QueryRow("select `price` from v_player_commodities_worth where player = ?", playerId).Scan(&value)
	if err != nil {
		return err
	}
	playerNetWorth.Resources = int64(value)
	err = game.db.QueryRow("select `price` from v_player_total_worth where player = ?", playerId).Scan(&value)
	if err != nil {
		return err
	}
	playerNetWorth.Total = int64(value)
	return nil
}
