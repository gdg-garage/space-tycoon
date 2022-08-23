package stycoon

import (
	"encoding/json"
	"strconv"
)

func (game *Game) reportHistoryStaticData() error {
	_, err := game.db.Exec("replace into d_history_static (`season`, `static-data`) values (?, ?)", game.Tick.Season, game.SerializedStaticData)
	return err
}

func (game *Game) reportReportHistory() error {
	game.ReportsReady.RLock()
	defer game.ReportsReady.RUnlock()
	serializedReports, err := json.Marshal(game.Reports)
	if err != nil {
		return err
	}
	_, err = game.db.Exec("replace into d_history_reports (`season`, `reports`) values (?, ?)", game.Tick.Season, serializedReports)
	return err
}

func (game *Game) reportHistory(reportReady chan struct{}) error {
	err := game.reportDataHistory()
	if err != nil {
		return err
	}
	<-reportReady
	err = game.reportReportHistory()
	return err
}

func (game *Game) reportDataHistory() error {
	game.Ready.RLock()
	defer game.Ready.RUnlock()

	reportUserId := "-1"
	data, err := game.GetData(&reportUserId)
	if err != nil {
		return err
	}
	serializedData, err := json.Marshal(data)
	if err != nil {
		return err
	}
	_, err = game.db.Exec("replace into d_history_data (`season`, `tick`, `data`) values (?, ?, ?)", game.Tick.Season, game.Tick.Tick, serializedData)
	return err
}

func filterCommands(playerId *string, ships *map[string]Ship) {
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

func FilterReportsUpToTick(fullReports *Reports, tick int64) Reports {
	reports := Reports{}
	reports.Combat = make([]Combat, 0, len(fullReports.Combat))
	for _, combat := range fullReports.Combat {
		if combat.Tick > tick {
			break
		}
		reports.Combat = append(reports.Combat, combat)
	}
	reports.Trade = make([]Trade, 0, len(fullReports.Trade))
	for _, trade := range fullReports.Trade {
		if trade.Tick > tick {
			break
		}
		reports.Trade = append(reports.Trade, trade)
	}
	reports.Profiling = make([]Profiling, 0, len(fullReports.Profiling))
	for _, profiling := range fullReports.Profiling {
		if profiling.Tick > tick {
			break
		}
		reports.Profiling = append(reports.Profiling, profiling)
	}

	reports.Prices = make(map[string]map[string]int64, len(fullReports.Prices))
	for resourceId, prices := range fullReports.Prices {
		reports.Prices[resourceId] = make(map[string]int64, len(prices))
		for tickStr, value := range prices {
			resourceTick, err := strconv.ParseInt(tickStr, 10, 64)
			if err != nil {
				continue
			}
			if resourceTick > tick {
				continue
			}
			reports.Prices[resourceId][tickStr] = value
		}
	}

	reports.ResourceAmounts = make(map[string]map[string]int64, len(fullReports.ResourceAmounts))
	for resourceId, resources := range fullReports.ResourceAmounts {
		reports.ResourceAmounts[resourceId] = make(map[string]int64, len(resources))
		for tickStr, value := range resources {
			resourceTick, err := strconv.ParseInt(tickStr, 10, 64)
			if err != nil {
				continue
			}
			if resourceTick > tick {
				continue
			}
			reports.ResourceAmounts[resourceId][tickStr] = value
		}
	}

	reports.Scores = make(map[string]ScoreValue, len(fullReports.Scores))
	for player, score := range fullReports.Scores {
		reports.Scores[player] = ScoreValue{
			Money:     make(map[string]int64, len(score.Money)),
			Resources: make(map[string]int64, len(score.Resources)),
			Ships:     make(map[string]int64, len(score.Ships)),
			Total:     make(map[string]int64, len(score.Total)),
		}
		for tickStr, value := range score.Money {
			scoreTick, err := strconv.ParseInt(tickStr, 10, 64)
			if err != nil {
				continue
			}
			if scoreTick > tick {
				continue
			}
			reports.Scores[player].Money[tickStr] = value
		}
		for tickStr, value := range score.Resources {
			scoreTick, err := strconv.ParseInt(tickStr, 10, 64)
			if err != nil {
				continue
			}
			if scoreTick > tick {
				continue
			}
			reports.Scores[player].Resources[tickStr] = value
		}
		for tickStr, value := range score.Ships {
			scoreTick, err := strconv.ParseInt(tickStr, 10, 64)
			if err != nil {
				continue
			}
			if scoreTick > tick {
				continue
			}
			reports.Scores[player].Ships[tickStr] = value
		}
		for tickStr, value := range score.Total {
			scoreTick, err := strconv.ParseInt(tickStr, 10, 64)
			if err != nil {
				continue
			}
			if scoreTick > tick {
				continue
			}
			reports.Scores[player].Total[tickStr] = value
		}
	}

	reports.Season = fullReports.Season
	reports.Tick = tick
	return reports
}

func (game *Game) GetHistoryData(season int64, tick int64, playerId *string) (Data, error) {
	var entry Data
	var data string
	err := game.db.QueryRow("select `data` from d_history_data where `season` = ? and `tick` = ?", season, tick).Scan(&data)
	if err != nil {
		return entry, err
	}
	err = json.Unmarshal([]byte(data), &entry)
	if err != nil {
		return entry, err
	}
	entry.PlayerId = playerId
	// Do not reveal commands data to other users in the current tick
	if season == game.Tick.Season {
		filterCommands(playerId, &entry.Ships)
	}
	return entry, nil
}

func (game *Game) GetHistoricStaticData(season int) (string, error) {
	var staticData string
	err := game.db.QueryRow("select `static-data` from d_history_static where `season` = ?", season).Scan(&staticData)
	return staticData, err
}

func (game *Game) GetHistoryReports(season int64, tick int64) (Reports, error) {
	var entry Reports
	var jsonReports string
	err := game.db.QueryRow("select `reports` from d_history_reports where `season` = ?", season).Scan(&jsonReports)
	if err != nil {
		return entry, err
	}
	err = json.Unmarshal([]byte(jsonReports), &entry)
	if err != nil {
		return entry, err
	}
	entry = FilterReportsUpToTick(&entry, tick)
	return entry, nil
}
