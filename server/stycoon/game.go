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

	planets, err := game.GetPlanets()
	if err != nil {
		return data, err
	}
	data.Planets = planets

	return data, nil
}

func (game *Game) GetPlanets() (map[string]PlanetsValue, error) {
	var planets = make(map[string]PlanetsValue)
	rows, err := game.db.Query("select t_object.`id`, `name`, `pos_x`, `pos_y`, `pos_x_prev`, `pos_y_prev` from t_object join t_planet tp on t_object.id = tp.id")
	if err != nil {
		return planets, fmt.Errorf("query failed %v", err)
	}
	var id int
	var planet PlanetsValue
	var pos = make([]int64, 2)
	var posPrev = make([]int64, 2)
	for rows.Next() {
		err = rows.Scan(&id, &planet.Name, &pos[0], &pos[1], &posPrev[0], &posPrev[1])
		if err != nil {
			return planets, fmt.Errorf("row read failed %v", err)
		}
		planet.Position = pos
		planet.PrevPosition = posPrev
		planet.Resources = map[string]TradingResource{}
		err = game.getPlanetResources(id, &planet.Resources)
		if err != nil {
			return planets, err
		}

		planets[strconv.Itoa(id)] = planet
	}
	if err = rows.Err(); err != nil {
		return planets, fmt.Errorf("rows read failed: %v", err)
	}
	return planets, nil
}

func (game *Game) getPlanetResources(planetId int, planetResources *map[string]TradingResource) error {
	rows, err := game.db.Query("select `resource`, `buy`, `sell`  from t_price where planet = ?", planetId)
	if err != nil {
		return fmt.Errorf("query failed %v", err)
	}
	var resourceId int
	var buy, sell sql.NullFloat64
	for rows.Next() {
		err = rows.Scan(&resourceId, &buy, &sell)
		if err != nil {
			return fmt.Errorf("row read failed %v", err)
		}
		if buy.Valid {
			resource := TradingResource{BuyPrice: buy.Float64}
			resource.Amount, err = game.getCommodityAmount(planetId, resourceId)
			if err != nil {
				return err
			}
			(*planetResources)[strconv.Itoa(resourceId)] = resource
		} else {
			(*planetResources)[strconv.Itoa(resourceId)] = TradingResource{SellPrice: sell.Float64}
		}

	}
	if err = rows.Err(); err != nil {
		return fmt.Errorf("rows read failed: %v", err)
	}
	return nil
}

func (game *Game) getCommodityAmount(objectId, resourceId int) (int64, error) {
	var amount int64
	err := game.db.QueryRow("select `amount` from t_commodity where object = ? and resource = ?", objectId, resourceId).Scan(&amount)
	if err != nil {
		return amount, fmt.Errorf("query failed %v", err)
	}
	return amount, nil
}

func (game *Game) setPlayers() error {
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
		err = game.setPlayerNetWorth(id, &player.NetWorth)
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

func (game *Game) setPlayerNetWorth(playerId int, playerNetWorth *NetWorth) error {
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
