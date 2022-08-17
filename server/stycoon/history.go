package stycoon

import (
	"database/sql"
	"encoding/json"
)

func (game *Game) reportStaticData() error {
	_, err := game.db.Exec("insert into d_static_history (`season`, `static-data`) values (?, ?)", game.Tick.Season, game.SerializedStaticData)
	return err
}

func (game *Game) report() error {
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

func FilterCommands(playerId *string, ships *map[string]ShipsValue) {
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

func (game *Game) History(id HistoryIdentifier, playerId *string) (HistoryEntry, error) {
	var entry HistoryEntry
	var staticData sql.NullString
	err := game.db.QueryRow("select `static-data` from d_static_history where `season` = ?", id.Season).Scan(&staticData)
	if err != nil {
		return entry, err
	}
	if staticData.Valid {
		err = json.Unmarshal([]byte(staticData.String), &entry.StaticData)
		if err != nil {
			return entry, err
		}
	} else {
		return entry, sql.ErrNoRows
	}
	// TODO add report
	var data sql.NullString
	err = game.db.QueryRow("select `data` from d_history where `season` = ? and `tick` = ?", id.Season, id.Tick).Scan(&data)
	if err != nil {
		return entry, err
	}
	if data.Valid {
		err = json.Unmarshal([]byte(data.String), &entry.Data)
		if err != nil {
			return entry, err
		}
	} else {
		return entry, sql.ErrNoRows
	}
	entry.Data.PlayerId = playerId
	// Do not reveal commands data to other users in the current tick
	if id.Season == game.Tick.Season {
		FilterCommands(playerId, &entry.Data.Ships)
	}
	return entry, nil
}
