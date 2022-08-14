package stycoon

import (
	"strconv"

	"github.com/rs/zerolog/log"
)

func (game *Game) fillCombatsForTick(tick int64) error {
	rows, err := game.db.Query("select `attacker`, `defender`, `killed` from t_report_combat where tick = ?", tick)
	if err != nil {
		return err
	}
	var combat Combat
	var killed string
	for rows.Next() {
		rows.Scan(&combat.Attacker, &combat.Defender, &killed)
		if killed == "Y" {
			combat.Killed = true
		} else {
			combat.Killed = false
		}
		combat.Tick = tick
		game.Reports.Combat = append(game.Reports.Combat, combat)
	}
	return nil
}

func (game *Game) fillProfilingForTick(tick int64) error {
	rows, err := game.db.Query("select `movement`, `attacks`, `trades`, `recipes`, `prices`, `constructions`, `report`, `total`, `overall`, `at` from t_report_timing where tick = ?", tick)
	if err != nil {
		return err
	}
	var profiling Profiling
	for rows.Next() {
		rows.Scan(&profiling.Movement, &profiling.Attacks, &profiling.Trades, &profiling.Recipes, &profiling.Prices, &profiling.Constructions, &profiling.Report, &profiling.Total, &profiling.Overall, &profiling.At)
		profiling.Tick = tick
		game.Reports.Profiling = append(game.Reports.Profiling, profiling)
	}
	return nil
}

func (game *Game) fillPricesForTick(tick int64) error {
	rows, err := game.db.Query("select `resource`, `price` from t_report_resource_price where tick = ?", tick)
	if err != nil {
		return err
	}

	if game.Reports.Prices == nil {
		game.Reports.Prices = make(map[string]map[string]int64)
	}

	var resource, price int64
	for rows.Next() {
		rows.Scan(&resource, &price)

		strResource := strconv.Itoa(int(resource))
		priceValue, ok := game.Reports.Prices[strResource]
		if !ok {
			priceValue = map[string]int64{}
		}

		strTick := strconv.Itoa(int(tick))
		priceValue[strTick] = price

		game.Reports.Prices[strResource] = priceValue
	}
	return nil
}

func (game *Game) fillScoresForTick(tick int64) error {
	rows, err := game.db.Query("select `player`, `commodities`, `ships`, `money`, `total` from t_report_player_score where tick = ?", tick)
	if err != nil {
		return err
	}

	if game.Reports.Scores == nil {
		game.Reports.Scores = make(map[string]ScoreValue)
	}

	var commodities, ships, money, total, player int64
	for rows.Next() {

		rows.Scan(&player, &commodities, &ships, &money, &total)

		scoreValue, ok := game.Reports.Scores[strconv.Itoa(int(player))]
		if !ok {
			scoreValue = ScoreValue{
				Resources: make(map[string]int64),
				Ships:     make(map[string]int64),
				Money:     make(map[string]int64),
				Total:     make(map[string]int64),
			}
		}

		strTick := strconv.Itoa(int(tick))

		scoreValue.Resources[strTick] = commodities
		scoreValue.Ships[strTick] = ships
		scoreValue.Money[strTick] = money
		scoreValue.Total[strTick] = total

		game.Reports.Scores[strconv.Itoa(int(player))] = scoreValue
	}
	return nil
}

func (game *Game) fillTradesForTick(tick int64) error {
	rows, err := game.db.Query("select `buyer`, `seller`, `resource`, `amount`, `price` from t_report_trade where tick = ?", tick)
	if err != nil {
		return err
	}

	var trade Trade
	for rows.Next() {
		rows.Scan(&trade.Buyer, &trade.Seller, &trade.Resource, &trade.Amount, &trade.Price)
		trade.Tick = tick
		game.Reports.Trade = append(game.Reports.Trade, trade)
	}
	return nil
}

func (game *Game) getReportsForPreviousTick() {
	previousTick := game.Tick.Tick - 1
	if previousTick < 0 {
		return
	}
	err := game.fillCombatsForTick(previousTick)
	if err != nil {
		log.Error().Err(err).Msg("Get reports failed - error fetching t_report_combat")
		return
	}
	err = game.fillProfilingForTick(previousTick)
	if err != nil {
		log.Error().Err(err).Msg("Get reports failed - error fetching t_report_timing")
		return
	}
	err = game.fillPricesForTick(previousTick)
	if err != nil {
		log.Error().Err(err).Msg("Get reports failed - error fetching t_report_resource_price")
		return
	}
	err = game.fillScoresForTick(previousTick)
	if err != nil {
		log.Error().Err(err).Msg("Get reports failed - error fetching t_report_player_score")
		return
	}
	err = game.fillTradesForTick(previousTick)
	if err != nil {
		log.Error().Err(err).Msg("Get reports failed - error fetching t_report_trade")
		return
	}
}
