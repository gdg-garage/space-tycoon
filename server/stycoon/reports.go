package stycoon

import (
	"database/sql"
	"strconv"

	"github.com/rs/zerolog/log"
)

// nil tick means fetching all previous ticks
func (game *Game) fillCombats(tick *int64) error {
	var rows *sql.Rows
	var err error
	if tick == nil {
		rows, err = game.db.Query("select `tick`, `attacker`, `defender`, `killed` from t_report_combat order by `tick`")
	} else {
		rows, err = game.db.Query("select `attacker`, `defender`, `killed` from t_report_combat where tick = ?", *tick)
	}
	if err != nil {
		return err
	}
	for rows.Next() {
		var combat Combat
		var killed string
		if tick == nil {
			rows.Scan(&combat.Tick, &combat.Attacker, &combat.Defender, &killed)
		} else {
			rows.Scan(&combat.Attacker, &combat.Defender, &killed)
			combat.Tick = *tick
		}
		if killed == "Y" {
			combat.Killed = true
		} else {
			combat.Killed = false
		}
		game.Reports.Combat = append(game.Reports.Combat, combat)
	}
	return nil
}

// nil tick means fetching all previous ticks
func (game *Game) fillProfiling(tick *int64) error {
	var rows *sql.Rows
	var err error
	if tick == nil {
		rows, err = game.db.Query("select `tick`, `movement`, `attacks`, `trades`, `recipes`, `prices`, `constructions`, `report`, `total`, `overall`, `at` from t_report_timing order by `tick`")
	} else {
		rows, err = game.db.Query("select `movement`, `attacks`, `trades`, `recipes`, `prices`, `constructions`, `report`, `total`, `overall`, `at` from t_report_timing where `tick` = ?", tick)
	}
	if err != nil {
		return err
	}
	for rows.Next() {
		var profiling Profiling
		if tick == nil {
			rows.Scan(&profiling.Tick, &profiling.Movement, &profiling.Attacks, &profiling.Trades, &profiling.Recipes, &profiling.Prices, &profiling.Constructions, &profiling.Report, &profiling.Total, &profiling.Overall, &profiling.At)
		} else {
			rows.Scan(&profiling.Movement, &profiling.Attacks, &profiling.Trades, &profiling.Recipes, &profiling.Prices, &profiling.Constructions, &profiling.Report, &profiling.Total, &profiling.Overall, &profiling.At)
			profiling.Tick = *tick
		}
		game.Reports.Profiling = append(game.Reports.Profiling, profiling)
	}
	return nil
}

// nil tick means fetching all previous ticks
func (game *Game) fillPrices(tick *int64) error {
	var rows *sql.Rows
	var err error
	if tick == nil {
		rows, err = game.db.Query("select `tick`, `resource`, `price` from t_report_resource_price order by `tick`")
	} else {
		rows, err = game.db.Query("select `resource`, `price` from t_report_resource_price where tick = ?", tick)
	}
	if err != nil {
		return err
	}

	if game.Reports.Prices == nil {
		game.Reports.Prices = make(map[string]map[string]int64)
	}

	for rows.Next() {
		var fetchedTick, resource, price int64
		var strTick, strResource string
		if tick == nil {
			rows.Scan(&fetchedTick, &resource, &price)
			strTick = strconv.Itoa(int(fetchedTick))
		} else {
			rows.Scan(&resource, &price)
			strTick = strconv.Itoa(int(*tick))
		}

		strResource = strconv.Itoa(int(resource))
		priceValue, ok := game.Reports.Prices[strResource]
		if !ok {
			priceValue = map[string]int64{}
		}

		priceValue[strTick] = price
		game.Reports.Prices[strResource] = priceValue
	}
	return nil
}

// nil tick means fetching all previous ticks
func (game *Game) fillScores(tick *int64) error {
	var rows *sql.Rows
	var err error
	if tick == nil {
		rows, err = game.db.Query("select `tick`, `player`, `commodities`, `ships`, `money`, `total` from t_report_player_score order by `tick`")
	} else {
		rows, err = game.db.Query("select `player`, `commodities`, `ships`, `money`, `total` from t_report_player_score where tick = ?", tick)
	}
	if err != nil {
		return err
	}

	if game.Reports.Scores == nil {
		game.Reports.Scores = make(map[string]ScoreValue)
	}

	for rows.Next() {
		var fetchedTick, commodities, ships, money, total, player int64
		var strTick string
		if tick == nil {
			rows.Scan(&fetchedTick, &player, &commodities, &ships, &money, &total)
			strTick = strconv.Itoa(int(fetchedTick))
		} else {
			rows.Scan(&player, &commodities, &ships, &money, &total)
			strTick = strconv.Itoa(int(*tick))
		}

		scoreValue, ok := game.Reports.Scores[strconv.Itoa(int(player))]
		if !ok {
			scoreValue = ScoreValue{
				Resources: make(map[string]int64),
				Ships:     make(map[string]int64),
				Money:     make(map[string]int64),
				Total:     make(map[string]int64),
			}
		}

		scoreValue.Resources[strTick] = commodities
		scoreValue.Ships[strTick] = ships
		scoreValue.Money[strTick] = money
		scoreValue.Total[strTick] = total

		game.Reports.Scores[strconv.Itoa(int(player))] = scoreValue
	}
	return nil
}

// nil tick means fetching all previous ticks
func (game *Game) fillTrades(tick *int64) error {
	var rows *sql.Rows
	var err error
	if tick == nil {
		rows, err = game.db.Query("select `tick`, `buyer`, `seller`, `resource`, `amount`, `price` from t_report_trade order by `tick`")
	} else {
		rows, err = game.db.Query("select `buyer`, `seller`, `resource`, `amount`, `price` from t_report_trade where tick = ?", tick)
	}
	if err != nil {
		return err
	}

	var trade Trade
	for rows.Next() {
		if tick == nil {
			rows.Scan(&trade.Tick, &trade.Buyer, &trade.Seller, &trade.Resource, &trade.Amount, &trade.Price)
		} else {
			rows.Scan(&trade.Buyer, &trade.Seller, &trade.Resource, &trade.Amount, &trade.Price)
			trade.Tick = *tick
		}
		game.Reports.Trade = append(game.Reports.Trade, trade)
	}
	return nil
}

// nil tick means fetching all previous ticks
func (game *Game) getReports(previousTick *int64) {
	err := game.fillCombats(previousTick)
	if err != nil {
		log.Error().Err(err).Msg("Get reports failed - error fetching t_report_combat")
		return
	}
	err = game.fillProfiling(previousTick)
	if err != nil {
		log.Error().Err(err).Msg("Get reports failed - error fetching t_report_timing")
		return
	}
	err = game.fillPrices(previousTick)
	if err != nil {
		log.Error().Err(err).Msg("Get reports failed - error fetching t_report_resource_price")
		return
	}
	err = game.fillScores(previousTick)
	if err != nil {
		log.Error().Err(err).Msg("Get reports failed - error fetching t_report_player_score")
		return
	}
	err = game.fillTrades(previousTick)
	if err != nil {
		log.Error().Err(err).Msg("Get reports failed - error fetching t_report_trade")
		return
	}
}

func (game *Game) getReportsForPreviousTick() {
	previousTick := game.Tick.Tick - 1
	if previousTick < 0 {
		return
	}
	game.getReports(&previousTick)
}

func (game *Game) getReportsSinceSeasonStart() {
	game.getReports(nil)
}
