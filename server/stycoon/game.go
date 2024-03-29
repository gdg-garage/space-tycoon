package stycoon

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
	"strconv"
	"sync"
	"time"

	"gonum.org/v1/plot/palette"

	"github.com/gorilla/sessions"
	"github.com/rs/zerolog/log"
)

type Game struct {
	Tick                 CurrentTick
	ResourceNames        map[string]string
	ShipClasses          map[string]ShipClass
	SerializedStaticData []byte
	Ready                *sync.RWMutex
	ReportsReady         *sync.RWMutex
	TickCond             *sync.Cond
	SessionManager       sessions.Store
	Reports              Reports
	db                   *sql.DB
	lastTickEstimate     time.Time
	lastTickReal         time.Time
	lastTick             time.Time
	players              map[string]Player
}

func NewGame(db *sql.DB, sessionManager sessions.Store) (*Game, error) {
	game := Game{
		db:               db,
		lastTickEstimate: time.Now(),
		lastTickReal:     time.Now(),
		SessionManager:   sessionManager,
		TickCond:         sync.NewCond(&sync.Mutex{}),
		Ready:            &sync.RWMutex{},
		ReportsReady:     &sync.RWMutex{},
	}
	game.Ready.Lock()
	err := game.Init()
	game.Ready.Unlock()

	reportsReady := make(chan struct{}, 1)
	reportsReady <- struct{}{}
	err = game.reportHistory(reportsReady)
	if err != nil {
		return &game, err
	}

	return &game, err
}

func (game *Game) Init() error {
	game.setGameTick()
	err := game.SetShipClasses()
	if err != nil {
		return err
	}
	err = game.SetResourceNames()
	if err != nil {
		return err
	}
	staticData := StaticData{
		ShipClasses:   game.ShipClasses,
		ResourceNames: game.ResourceNames,
	}
	game.SerializedStaticData, err = json.Marshal(staticData)
	if err != nil {
		log.Warn().Err(err).Msg("Json marshall failed")
		return err
	}
	err = game.reportHistoryStaticData()
	if err != nil {
		log.Warn().Err(err).Msg("Reporting season failed")
	}
	err = game.CreatePlayersForUsers()
	if err != nil {
		log.Warn().Err(err).Msg("Creating default players failed")
	}
	game.fillAllReportsSinceSeasonStart()
	return nil
}

func (game *Game) SetResourceNames() error {
	names := make(map[string]string)
	rows, err := game.db.Query("select `id`, `name` from d_resource")
	if err != nil {
		return fmt.Errorf("query failed %v", err)
	}
	for rows.Next() {
		var id int
		var name string
		err = rows.Scan(&id, &name)
		if err != nil {
			return fmt.Errorf("row read failed %v", err)
		}
		names[strconv.Itoa(id)] = name
	}
	if err = rows.Err(); err != nil {
		return fmt.Errorf("rows read failed: %v", err)
	}
	game.ResourceNames = names
	return nil
}

func (game *Game) GetData(playerId *string) (Data, error) {
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

	wrecks, err := game.GetWrecks()
	if err != nil {
		return data, err
	}
	data.Wrecks = wrecks

	data.Reports = game.getDataReports()

	return data, nil
}

func (game *Game) GetPlanets(resources *map[int]map[string]*TradingResource) (map[string]Planet, error) {
	var planets = make(map[string]Planet)
	rows, err := game.db.Query("select t_object.`id`, `name`, `pos_x`, `pos_y`, `pos_x_prev`, `pos_y_prev` from t_object join t_planet tp on t_object.id = tp.id")
	if err != nil {
		return planets, fmt.Errorf("query failed %v", err)
	}
	for rows.Next() {
		var id int
		var planet Planet
		var pos = make([]int64, 2)
		var posPrev = make([]int64, 2)
		err = rows.Scan(&id, &planet.Name, &pos[0], &pos[1], &posPrev[0], &posPrev[1])
		if err != nil {
			return planets, fmt.Errorf("row read failed %v", err)
		}
		planet.Position = &pos
		planet.PrevPosition = &posPrev
		planet.Resources = game.getTradingResources(id, resources)
		planets[strconv.Itoa(id)] = planet
	}
	if err = rows.Err(); err != nil {
		return planets, fmt.Errorf("rows read failed: %v", err)
	}
	return planets, nil
}

func (game *Game) GetShips(playerId *string, resources *map[int]map[string]*TradingResource) (map[string]Ship, error) {
	var ships = make(map[string]Ship)
	rows, err := game.db.Query("select o.`id`, o.`name`, o.`pos_x`, o.`pos_y`, o.`pos_x_prev`, o.`pos_y_prev`, s.`class`, o.`owner`, s.`life` from t_object as o join t_ship s on o.id = s.id")
	if err != nil {
		return ships, fmt.Errorf("query failed %v", err)
	}
	var commands map[int]Command
	if playerId != nil {
		commands, err = game.getPlayerCommands(*playerId)
		if err != nil {
			return ships, err
		}
	}
	for rows.Next() {
		var id int
		var ship Ship
		var pos = make([]int64, 2)
		var posPrev = make([]int64, 2)
		err = rows.Scan(&id, &ship.Name, &pos[0], &pos[1], &posPrev[0], &posPrev[1], &ship.ShipClass, &ship.Player, &ship.Life)
		if err != nil {
			return ships, fmt.Errorf("row read failed %v", err)
		}
		ship.Position = &pos
		ship.PrevPosition = &posPrev
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

func (game *Game) GetWrecks() (map[string]Wreck, error) {
	var wrecks = make(map[string]Wreck)
	rows, err := game.db.Query("select o.`id`, o.`name`, o.`pos_x`, o.`pos_y`, w.`class`, o.`owner`, w.`kill_tick` from t_object as o join t_wreck w on o.id = w.id")
	if err != nil {
		return wrecks, fmt.Errorf("query failed %v", err)
	}
	var id int
	for rows.Next() {
		var wreck Wreck
		var pos = make([]int64, 2)
		err = rows.Scan(&id, &wreck.Name, &pos[0], &pos[1], &wreck.ShipClass, &wreck.Player, &wreck.KillTick)
		if err != nil {
			return wrecks, fmt.Errorf("row read failed %v", err)
		}
		wreck.Position = &pos
		wrecks[strconv.Itoa(id)] = wreck
	}
	if err = rows.Err(); err != nil {
		return wrecks, fmt.Errorf("rows read failed: %v", err)
	}
	return wrecks, nil
}

func (game *Game) getPlayerCommands(playerId string) (map[int]Command, error) {
	commands := make(map[int]Command)
	var err error
	if err != nil {
		return commands, err
	}
	var rows *sql.Rows
	// return all commands for history report
	allCommandsQuery := "select object.`id`, `type`, `target`, `resource`, `amount`, `class` from t_command join t_object object on t_command.ship = object.id"
	if playerId == "-1" {
		rows, err = game.db.Query(allCommandsQuery)
	} else {
		rows, err = game.db.Query(allCommandsQuery+" where object.`owner` = ?", playerId)
	}
	if err != nil {
		return commands, err
	}
	for rows.Next() {
		var id int
		var target, resource, class sql.NullString
		var amount sql.NullInt64
		var command Command
		err = rows.Scan(&id, &command.Type, &target, &resource, &amount, &class)
		if err != nil {
			return commands, fmt.Errorf("row read failed %v", err)
		}
		if target.Valid {
			command.Target = &target.String
		}
		if resource.Valid {
			command.Resource = &resource.String
		}
		if amount.Valid {
			command.Amount = &amount.Int64
		}
		if class.Valid {
			command.ShipClass = &class.String
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
	for rows.Next() {
		var planetId, resourceId int
		var buy, sell sql.NullFloat64
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
	for rows.Next() {
		var objectId, resourceId int
		var amount int64
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
	var players = make(map[string]Player)
	rows, err := game.db.Query("select t_player.`id`, d_user.`name`, `color`, t_player.`money`, score.`commodities`, score.`ships`, score.`total` from t_player join d_user on t_player.id = d_user.id left join t_report_player_score as score on t_player.id = score.player and score.tick = ?", game.Tick.Tick-1)
	if err != nil {
		return fmt.Errorf("query failed %v", err)
	}
	for rows.Next() {
		var id int
		var player Player
		var color string
		var commodities, ships, total sql.NullInt64
		err = rows.Scan(&id, &player.Name, &color, &player.NetWorth.Money, &commodities, &ships, &total)
		if err != nil {
			return fmt.Errorf("row read failed %v", err)
		}
		err = json.Unmarshal([]byte(color), &player.Color)
		if err != nil {
			return err
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

func (game *Game) getPlayersNr() (int, error) {
	var playerNr int
	err := game.db.QueryRow("select count(*) from d_user left join t_player as tp on d_user.id = tp.id where tp.`id` is null").Scan(&playerNr)
	if err != nil {
		return 0, err
	}
	return playerNr, nil
}

func (game *Game) generatePlayerPositions(playerNr int) [][]float64 {
	var playerPositions [][]float64

	if playerNr == 0 {
		return playerPositions
	}

	segmentSize := 2 * math.Pi / float64(playerNr)
	currDist := rand.Float64() * rand.Float64() * 360
	for i := 0; i < playerNr; i++ {
		diameter := (1-rand.Float64()*rand.Float64())*1000 + 250
		x := math.Cos(currDist) * diameter
		y := math.Sin(currDist) * diameter
		playerPositions = append(playerPositions, []float64{x, y})
		currDist += segmentSize
	}
	rand.Shuffle(len(playerPositions), func(i, j int) { playerPositions[i], playerPositions[j] = playerPositions[j], playerPositions[i] })
	return playerPositions
}

func (game *Game) generatePlayerColors(playerNr int) ([][]byte, error) {
	var colors [][]byte
	// The pallete.Rainbow returns first and last color identical, that's why we use playerNr + 1
	p := palette.Rainbow(playerNr+1, 0, 1, 1.0 /*saturation*/, 1.0 /*value*/, 1.0 /*alpha*/)
	for i := range p.Colors() {
		r, g, b, _ := p.Colors()[i].RGBA()
		// RGBA() method returns colors shifted to 32-bit range (r << 8), so we need to reverse the operation
		color, err := json.Marshal([]uint32{r >> 8, g >> 8, b >> 8})
		if err != nil {
			return colors, err
		}
		colors = append(colors, color)
	}
	return colors, nil
}

func (game *Game) CreatePlayersForUsers() error {
	rows, err := game.db.Query("select d_user.`id`, d_user.`name`, tp.`id` from d_user left join t_player as tp on d_user.id = tp.id")
	if err != nil {
		if err == sql.ErrNoRows {
			log.Info().Msg("No players to create")
			return nil
		}
		return fmt.Errorf("query failed %v", err)
	}
	playerNr, err := game.getPlayersNr()
	if err != nil {
		return fmt.Errorf("query failed %v", err)
	}
	playerPositions := game.generatePlayerPositions(playerNr)
	playerColors, err := game.generatePlayerColors(playerNr)
	if err != nil {
		return fmt.Errorf("color generation failed %v", err)
	}

	counter := 0
	for rows.Next() {
		var id int
		var name string
		var playerId sql.NullInt64
		err = rows.Scan(&id, &name, &playerId)
		if err != nil {
			return fmt.Errorf("row read failed %v", err)
		}
		if playerId.Valid {
			// Player already exists for this user
			continue
		}
		pos := playerPositions[counter]
		color := playerColors[counter]
		log.Info().Str("user", name).Msg("Creating player for user")
		_, err = game.db.Exec("call p_create_player(?, ?, ?, ?)", id, pos[0], pos[1], color)
		if err != nil {
			return err
		}
		counter++
	}
	if err = rows.Err(); err != nil {
		return fmt.Errorf("rows read failed: %v", err)
	}
	return nil
}
