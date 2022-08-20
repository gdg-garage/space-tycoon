package stycoon

import (
	"database/sql"
	"encoding/json"
)

func (game *Game) reportHistoryStaticData() error {
	_, err := game.db.Exec("replace into d_season_history (`season`, `static-data`) values (?, ?)", game.Tick.Season, game.SerializedStaticData)
	return err
}

func (game *Game) reportHistory() error {
	// TODO report report
	reportUserId := "-1"
	data, err := game.GetData(&reportUserId)
	if err != nil {
		return err
	}
	serializedData, err := json.Marshal(data)
	if err != nil {
		return err
	}
	_, err = game.db.Exec("insert into d_history (`season`, `tick`, `data`) values (?, ?, ?)", game.Tick.Season, game.Tick.Tick, serializedData)
	return err
}

func FilterCommands(playerId *string, ships *map[string]Ship) {
	for k, ship := range *ships {
		if ship.Command == nil {
			continue
		}
		if playerId != nil && *playerId == ship.Player {
			// Player is allowed to see owned ship commands
			continue
		}
		filteredShip := ship
		filteredShip.Command = nil
		(*ships)[k] = filteredShip
	}
}

func (game *Game) HistoryData(season int64, tick int64, playerId *string) (Data, error) {
	var entry Data
	// TODO add report
	var data sql.NullString
	err := game.db.QueryRow("select `data` from d_history where `season` = ? and `tick` = ?", season, tick).Scan(&data)
	if err != nil {
		return entry, err
	}
	if data.Valid {
		err = json.Unmarshal([]byte(data.String), &entry)
		if err != nil {
			return entry, err
		}
	} else {
		return entry, sql.ErrNoRows
	}
	entry.PlayerId = playerId
	// Do not reveal commands data to other users in the current tick
	if season == game.Tick.Season {
		FilterCommands(playerId, &entry.Ships)
	}
	return entry, nil
}

func (game *Game) HistoricStaticData(season int) (string, error) {
	var staticData string
	err := game.db.QueryRow("select `static-data` from d_season_history where `season` = ?", season).Scan(&staticData)
	return staticData, err
}
