package stycoon

import (
	"database/sql"
	log "github.com/sirupsen/logrus"
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
		log.Errorf("Query failed %v", err)
		return scores
	}

	var score PlayerScore
	for rows.Next() {
		err = rows.Scan(&score.Player, &score.Price, &score.Score)
		if err != nil {
			log.Warningf("Row read failed %v", err)
			continue
		}
		scores = append(scores, score)
	}
	if err = rows.Err(); err != nil {
		log.Warningf("Rows read failed %v", err)
		return scores
	}
	return scores
}
