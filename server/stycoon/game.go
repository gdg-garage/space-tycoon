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
		Players:     game.players,
		PlayerId:    playerId,
	}

	planets, err := game.GetPlanets()
	if err != nil {
		return data, err
	}
	data.Planets = planets

	ships, err := game.GetShips(playerId)
	if err != nil {
		return data, err
	}
	data.Ships = ships

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
		err = game.setTradingResources(id, &planet.Resources)
		if err != nil {
			return planets, err
		}
		err = game.setPlanetResourcePrices(id, &planet.Resources)
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

func (game *Game) GetShips(playerId *int64) (map[string]ShipsValue, error) {
	var ships = make(map[string]ShipsValue)
	rows, err := game.db.Query("select o.`id`, o.`name`, o.`pos_x`, o.`pos_y`, o.`pos_x_prev`, o.`pos_y_prev`, s.`class`, o.`owner`, s.`life` from t_object as o join t_ship s on o.id = s.id")
	if err != nil {
		return ships, fmt.Errorf("query failed %v", err)
	}
	var id int
	var ship ShipsValue
	var pos = make([]int64, 2)
	var posPrev = make([]int64, 2)
	for rows.Next() {
		err = rows.Scan(&id, &ship.Name, &pos[0], &pos[1], &posPrev[0], &posPrev[1], &ship.ShipClass, &ship.Player, &ship.Life)
		if err != nil {
			return ships, fmt.Errorf("row read failed %v", err)
		}
		ship.Position = pos
		ship.PrevPosition = posPrev
		ship.Resources = map[string]Resource{}
		err = game.setResources(id, &ship.Resources)
		if err != nil {
			return ships, err
		}
		if playerId != nil && *playerId == ship.Player {
			ship.Command, err = game.getCommand(id)
			if err != nil {
				return ships, err
			}
		}
		ships[strconv.Itoa(id)] = ship
	}
	if err = rows.Err(); err != nil {
		return ships, fmt.Errorf("rows read failed: %v", err)
	}
	return ships, nil
}

func (game *Game) getCommand(shipId int) (Command, error) {
	var command Command
	err := game.db.QueryRow("select `type`, `target`, `resource`, `amount`, `class` from t_command where ship = ?", shipId).Scan(&command.Type, &command.Target, &command.Resource, &command.Amount, &command.ShipClass)
	if err != nil {
		return command, err
	}
	return command, nil
}

func (game *Game) setPlanetResourcePrices(planetId int, planetResources *map[string]TradingResource) error {
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
			resource, ok := (*planetResources)[strconv.Itoa(resourceId)]
			if ok {
				(*planetResources)[strconv.Itoa(resourceId)] = TradingResource{Amount: resource.Amount, BuyPrice: buy.Float64}
			} else {
				(*planetResources)[strconv.Itoa(resourceId)] = TradingResource{BuyPrice: buy.Float64}
			}
		} else if sell.Valid {
			resource, ok := (*planetResources)[strconv.Itoa(resourceId)]
			if ok {
				(*planetResources)[strconv.Itoa(resourceId)] = TradingResource{Amount: resource.Amount, SellPrice: sell.Float64}
			} else {
				(*planetResources)[strconv.Itoa(resourceId)] = TradingResource{SellPrice: sell.Float64}
			}
		}
	}
	if err = rows.Err(); err != nil {
		return fmt.Errorf("rows read failed: %v", err)
	}
	return nil
}

func (game *Game) setTradingResources(objectId int, resources *map[string]TradingResource) error {
	amounts, err := game.getCommodityAmounts(objectId)
	if err != nil {
		return nil
	}
	for key, amount := range amounts {
		(*resources)[key] = TradingResource{Amount: amount}
	}
	return nil
}

func (game *Game) setResources(objectId int, resources *map[string]Resource) error {
	amounts, err := game.getCommodityAmounts(objectId)
	if err != nil {
		return nil
	}
	for key, amount := range amounts {
		(*resources)[key] = Resource{Amount: amount}
	}
	return nil
}

func (game *Game) getCommodityAmounts(objectId int) (map[string]int64, error) {
	amounts := make(map[string]int64)
	rows, err := game.db.Query("select `resource`, `amount` from t_commodity where object = ?", objectId)
	if err != nil {
		return amounts, fmt.Errorf("query failed %v", err)
	}
	var resourceId int
	var amount int64
	for rows.Next() {
		err = rows.Scan(&resourceId, &amount)
		if err != nil {
			return amounts, fmt.Errorf("row read failed %v", err)
		}
		amounts[strconv.Itoa(resourceId)] = amount
	}
	if err = rows.Err(); err != nil {
		return amounts, fmt.Errorf("rows read failed: %v", err)
	}
	return amounts, nil
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
