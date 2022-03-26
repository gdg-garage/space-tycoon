package stycoon

import (
	"database/sql"
	"github.com/rs/zerolog/log"
)

type PlayerScore struct {
	Player int     `json:"player"`
	Price  float64 `json:"price"`
	Score  int64   `json:"score"`
}

func GetPlayerScores(db *sql.DB) []PlayerScore {
	var scores = make([]PlayerScore, 0)
	rows, err := db.Query("select * from v_player_score;")
	if err != nil {
		log.Error().Err(err).Msg("Query failed")
		return scores
	}

	var score PlayerScore
	for rows.Next() {
		err = rows.Scan(&score.Player, &score.Price, &score.Score)
		if err != nil {
			log.Error().Err(err).Msg("Row read failed")
			continue
		}
		scores = append(scores, score)
	}
	if err = rows.Err(); err != nil {
		log.Error().Err(err).Msg("Rows read failed")
		return scores
	}
	return scores
}
