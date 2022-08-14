curl \
--header "Content-Type: application/json" \
--request POST  \
--data '{
    "10": {"type": "rename", "name": "rename works"},
    "3": {"type": "construct", "ship-class": 0},
    "4": {"type": "construct"},
    "2": {"type": "move", "target": 1},
    "5": {"type": "move", "destination": {"coordinates": [0,0]}},
    "6": {"type": "move", "destination": {"target": 1}},
    "7": {"type": "move", "destination": {"target": 1, "coordinates": [0,0]}},
    "8": {"type": "move", "destination": {}}
}' http://localhost/commands