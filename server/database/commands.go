package database

import (
	"database/sql"

	"github.com/rs/zerolog/log"
)

func ReplaceMoveCommand(db *sql.DB, id int64, commandType string, target int64) error {
	log.Info().Msgf("replace into t_command (ship, type, target) values (%d, %s, %d)", id, commandType, target)
	_, err := db.Exec(`replace into t_command (ship, type, target) values (?, ?, ?)`, id, commandType, target)
	return err
}

func ReplaceConstructCommand(db *sql.DB, id int64, commandType string, class int64) error {
	log.Info().Msgf("replace into t_command (ship, type, class) values (%d, %s, %d)", id, commandType, class)
	_, err := db.Exec(`replace into t_command (ship, type, class) values (?, ?, ?)`, id, commandType, class)
	return err
}

func ReplaceAttackCommand(db *sql.DB, id int64, commandType string, target int64) error {
	log.Info().Msgf("replace into t_command (ship, type, target) values (%d, %s, %d)", id, commandType, target)
	_, err := db.Exec(`replace into t_command (ship, type, target) values (?, ?, ?)`, id, commandType, target)
	return err
}

func ReplaceTradeCommand(db *sql.DB, id int64, commandType string, target int64, resource int64, amount int64) error {
	log.Info().Msgf("replace into t_command (ship, type, target, resource, amount) values (%d, %s, %d, %d, %d)", id, commandType, target, resource, amount)
	_, err := db.Exec(`replace into t_command (ship, type, target, resource, amount) values (?, ?, ?, ?, ?)`, id, commandType, target, resource, amount)
	return err
}

func ReplaceDecommissionCommand(db *sql.DB, id int64, commandType string) error {
	log.Info().Msgf("replace into t_command (ship, type) values (%d, %s)", id, commandType)
	_, err := db.Exec(`replace into t_command (ship, type) values (?, ?)`, id, commandType)
	return err
}

func StopCommand(db *sql.DB, id int64) error {
	log.Info().Msgf("delete from t_command where ship = %d", id)
	_, err := db.Exec(`delete from t_command where ship = ?`, id)
	return err
}

func ProcessRename(db *sql.DB, id int64, name string) error {
	log.Info().Msgf("update t_object set name = ? where id = %d", id)
	_, err := db.Exec(`update t_object set name = ? where id = ?;`, name, id)
	return err
}

func InsertObject(db *sql.DB, x int64, y int64) (int64, error) {
	log.Info().Msgf("insert into t_object (pos_x, pos_y) values (%d, %d)", x, y)
	res, err := db.Exec(`insert into t_object (pos_x, pos_y) values (?, ?)`, x, y)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}
