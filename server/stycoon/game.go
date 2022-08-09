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

	resources, err := game.getCommodityAmounts()
	if err != nil {
		return data, err
	}
	err = game.setPlanetResourcePrices(&resources)
	if err != nil {
		return data, err
	}

	planets, err := game.GetPlanets(&resources)
	if err != nil {
		return data, err
	}
	data.Planets = planets

	ships, err := game.GetShips(playerId, &resources)
	if err != nil {
		return data, err
	}
	data.Ships = ships

	return data, nil
}

func (game *Game) GetPlanets(resources *map[int]map[string]*TradingResource) (map[string]PlanetsValue, error) {
	var planets = make(map[string]PlanetsValue)
	rows, err := game.db.Query("select t_object.`id`, `name`, `pos_x`, `pos_y`, `pos_x_prev`, `pos_y_prev` from t_object join t_planet tp on t_object.id = tp.id")
	if err != nil {
		return planets, fmt.Errorf("query failed %v", err)
	}
	var id int
	for rows.Next() {
		var planet PlanetsValue
		var pos = make([]int64, 2)
		var posPrev = make([]int64, 2)
		err = rows.Scan(&id, &planet.Name, &pos[0], &pos[1], &posPrev[0], &posPrev[1])
		if err != nil {
			return planets, fmt.Errorf("row read failed %v", err)
		}
		planet.Position = pos
		planet.PrevPosition = posPrev
		planet.Resources = game.getTradingResources(id, resources)
		planets[strconv.Itoa(id)] = planet
	}
	if err = rows.Err(); err != nil {
		return planets, fmt.Errorf("rows read failed: %v", err)
	}
	return planets, nil
}

func (game *Game) GetShips(playerId *int64, resources *map[int]map[string]*TradingResource) (map[string]ShipsValue, error) {
	var ships = make(map[string]ShipsValue)
	rows, err := game.db.Query("select o.`id`, o.`name`, o.`pos_x`, o.`pos_y`, o.`pos_x_prev`, o.`pos_y_prev`, s.`class`, o.`owner`, s.`life` from t_object as o join t_ship s on o.id = s.id")
	if err != nil {
		return ships, fmt.Errorf("query failed %v", err)
	}
	var id int
	var commands map[int]Command
	if playerId != nil {
		commands, err = game.getPlayerCommands(*playerId)
		if err != nil {
			return ships, err
		}
	}
	for rows.Next() {
		var ship ShipsValue
		var pos = make([]int64, 2)
		var posPrev = make([]int64, 2)
		err = rows.Scan(&id, &ship.Name, &pos[0], &pos[1], &posPrev[0], &posPrev[1], &ship.ShipClass, &ship.Player, &ship.Life)
		if err != nil {
			return ships, fmt.Errorf("row read failed %v", err)
		}
		ship.Position = pos
		ship.PrevPosition = posPrev
		ship.Resources = game.getResources(id, resources)
		if playerId != nil {
			if command, ok := commands[id]; ok {
				ship.Command = &command
			}
		}
		ships[strconv.Itoa(id)] = ship
	}
	if err = rows.Err(); err != nil {
		return ships, fmt.Errorf("rows read failed: %v", err)
	}
	return ships, nil
}

func (game *Game) getPlayerCommands(playerId int64) (map[int]Command, error) {
	commands := make(map[int]Command)
	rows, err := game.db.Query("select object.`id`, `type`, `target`, `resource`, `amount`, `class` from t_command join t_object object on t_command.ship = object.id where object.`owner` = ?", playerId)
	if err != nil {
		return commands, err
	}
	var id int
	var target, resource, amount, class sql.NullInt64
	for rows.Next() {
		var command Command
		err = rows.Scan(&id, &command.Type, &target, &resource, &amount, &class)
		if err != nil {
			return commands, fmt.Errorf("row read failed %v", err)
		}
		if target.Valid {
			command.Target = target.Int64
		}
		if resource.Valid {
			command.Resource = resource.Int64
		}
		if amount.Valid {
			command.Amount = amount.Int64
		}
		if class.Valid {
			command.ShipClass = class.Int64
		}
		commands[id] = command
	}
	if err = rows.Err(); err != nil {
		return commands, fmt.Errorf("rows read failed: %v", err)

	}
	return commands, nil
}

func (game *Game) setPlanetResourcePrices(resources *map[int]map[string]*TradingResource) error {
	rows, err := game.db.Query("select `planet`, `resource`, `buy`, `sell`  from t_price")
	if err != nil {
		return fmt.Errorf("query failed %v", err)
	}
	var planetId, resourceId int
	var buy, sell sql.NullFloat64
	for rows.Next() {
		err = rows.Scan(&planetId, &resourceId, &buy, &sell)
		if err != nil {
			return fmt.Errorf("row read failed %v", err)
		}
		resourceIdStr := strconv.Itoa(resourceId)
		if _, ok := (*resources)[planetId]; !ok {
			(*resources)[planetId] = make(map[string]*TradingResource)
		}
		if _, ok := (*resources)[planetId][resourceIdStr]; !ok {
			(*resources)[planetId][resourceIdStr] = &TradingResource{}
		}
		if buy.Valid {
			(*resources)[planetId][resourceIdStr].BuyPrice = buy.Float64
		}
		if sell.Valid {
			(*resources)[planetId][resourceIdStr].SellPrice = sell.Float64
		}
	}
	if err = rows.Err(); err != nil {
		return fmt.Errorf("rows read failed: %v", err)
	}
	return nil
}

func (game *Game) getTradingResources(objectId int, resources *map[int]map[string]*TradingResource) map[string]TradingResource {
	planetResources := make(map[string]TradingResource)
	for key, resource := range (*resources)[objectId] {
		planetResources[key] = *resource
	}
	return planetResources
}

func (game *Game) getResources(objectId int, resources *map[int]map[string]*TradingResource) map[string]Resource {
	shipResources := make(map[string]Resource)
	for key, resource := range (*resources)[objectId] {
		shipResources[key] = Resource{Amount: resource.Amount}
	}
	return shipResources
}

func (game *Game) getCommodityAmounts() (map[int]map[string]*TradingResource, error) {
	amounts := make(map[int]map[string]*TradingResource)
	rows, err := game.db.Query("select `object`, `resource`, `amount` from t_commodity")
	if err != nil {
		return amounts, fmt.Errorf("query failed %v", err)
	}
	var objectId, resourceId int
	var amount int64
	for rows.Next() {
		err = rows.Scan(&objectId, &resourceId, &amount)
		if err != nil {
			return amounts, fmt.Errorf("row read failed %v", err)
		}
		if _, ok := amounts[objectId]; !ok {
			amounts[objectId] = make(map[string]*TradingResource)
		}
		amounts[objectId][strconv.Itoa(resourceId)] = &TradingResource{Amount: amount}
	}
	if err = rows.Err(); err != nil {
		return amounts, fmt.Errorf("rows read failed: %v", err)
	}
	return amounts, nil
}

func (game *Game) setPlayers() error {
	var players = make(map[string]PlayersValue)
	rows, err := game.db.Query("select `id`, `name`, `color`, t_player.`money`, score.`commodities`, score.`ships`, score.`total` from t_player left join t_report_player_score score on t_player.id = score.player where score.tick  = ?", game.Tick.Tick-1)
	if err != nil {
		return fmt.Errorf("query failed %v", err)
	}
	var id int
	var player PlayersValue
	var color sql.NullString
	var commodities, ships, total sql.NullInt64
	for rows.Next() {
		err = rows.Scan(&id, &player.Name, &color, &player.NetWorth.Money, &commodities, &ships, &total)
		if err != nil {
			return fmt.Errorf("row read failed %v", err)
		}
		if color.Valid {
			err = json.Unmarshal([]byte(color.String), &player.Color)
			if err != nil {
				return err
			}
		}
		if commodities.Valid {
			player.NetWorth.Resources = commodities.Int64
		}
		if ships.Valid {
			player.NetWorth.Ships = ships.Int64
		}
		if total.Valid {
			player.NetWorth.Total = total.Int64
		}
		players[strconv.Itoa(id)] = player
	}
	if err = rows.Err(); err != nil {
		return fmt.Errorf("rows read failed: %v", err)
	}
	game.players = players
	return nil
}
