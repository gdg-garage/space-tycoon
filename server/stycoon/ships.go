package stycoon

import (
	"database/sql"
	"fmt"
	"strconv"
)

func (game *Game) SetShipClasses() error {
	shipClasses := make(map[string]StaticDataShipClassesValue)
	rows, err := game.db.Query("select `id`, `name`, `shipyard`, `speed`, `cargo`, `life`, `damage`, `price` from d_class")
	if err != nil {
		return fmt.Errorf("query failed %v", err)
	}
	for rows.Next() {
		var shipClass StaticDataShipClassesValue
		var id int
		var shipyard []uint8
		var price sql.NullInt64
		err = rows.Scan(&id, &shipClass.Name, &shipyard, &shipClass.Speed, &shipClass.CargoCapacity, &shipClass.Life, &shipClass.Damage, &price)
		if err != nil {
			return fmt.Errorf("row read failed %v", err)
		}
		if len(shipyard) == 1 && shipyard[0] == 'Y' {
			shipClass.Shipyard = true
		} else {
			shipClass.Shipyard = false
		}
		if price.Valid {
			shipClass.Price = price.Int64
		} else {
			shipClass.Price = -1
		}
		shipClasses[strconv.Itoa(id)] = shipClass
	}
	if err = rows.Err(); err != nil {
		return fmt.Errorf("rows read failed: %v", err)
	}
	game.ShipClasses = shipClasses
	return nil
}
