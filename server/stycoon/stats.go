package stycoon

import (
	"database/sql"
	"fmt"
)

type PlayerScore struct {
	Player int32 `json:"player"`
	Price  int64 `json:"price"`
	Score  int64 `json:"score"`
}

func GetPlayerScores(db *sql.DB) ([]PlayerScore, error) {
	var scores = make([]PlayerScore, 0)
	rows, err := db.Query("select * from v_player_score;")
	if err != nil {

		return scores, fmt.Errorf("query failed %v", err)
	}

	var score PlayerScore
	for rows.Next() {
		err = rows.Scan(&score.Player, &score.Price, &score.Score)
		if err != nil {
			return scores, fmt.Errorf("row read failed %v", err)
		}
		scores = append(scores, score)
	}
	if err = rows.Err(); err != nil {
		return scores, fmt.Errorf("rows read failed: %v", err)
	}
	return scores, nil
}
