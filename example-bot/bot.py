import random
import traceback
from collections import Counter
from pprint import pprint
from typing import Dict
from typing import Optional

from space_tycoon_client import ApiClient
from space_tycoon_client import Configuration
from space_tycoon_client import GameApi
from space_tycoon_client.models.credentials import Credentials
from space_tycoon_client.models.current_tick import CurrentTick
from space_tycoon_client.models.data import Data
from space_tycoon_client.models.destination import Destination
from space_tycoon_client.models.end_turn import EndTurn
from space_tycoon_client.models.move_command import MoveCommand
from space_tycoon_client.models.player import Player
from space_tycoon_client.models.player_id import PlayerId
from space_tycoon_client.models.ship import Ship
from space_tycoon_client.models.static_data import StaticData
from space_tycoon_client.rest import ApiException


class Game:
    def __init__(self, api_client: GameApi):
        self.me: Optional[Player] = None
        self.client = api_client
        self.player_id = self.login()
        self.static_data: StaticData = self.client.static_data_get()
        self.data: Data = self.client.data_get()
        self.season = self.data.current_tick.season
        self.tick = self.data.current_tick.tick
        # this part is custom logic, feel free to edit / delete
        if self.player_id not in self.data.players:
            raise Exception("Logged as non-existent player")
        self.recreate_me()
        print(f"playing as [{self.me.name}] id: {self.player_id}")

    def recreate_me(self):
        self.me: Player = self.data.players[self.player_id]

    def game_loop(self):
        while True:
            print("-" * 30)
            try:
                print(f"tick {self.tick} season {self.season}")
                self.data: Data = self.client.data_get()
                if self.data.player_id is None:
                    raise Exception("I am not correctly logged in. Bailing out")
                self.game_logic()
                current_tick: CurrentTick = self.client.end_turn_post(EndTurn(
                    tick=self.tick,
                    season=self.season
                ))
                self.tick = current_tick.tick
                self.season = current_tick.season
            except ApiException as e:
                if e.status == 403:
                    print(f"New season started or login expired: {e}")
                    break
                else:
                    raise e
            except Exception as e:
                print(f"!!! EXCEPTION !!! Game logic error {e}")
                traceback.print_exception(e)

    def game_logic(self):
        # todo throw all this away
        self.recreate_me()
        my_ships: Dict[Ship] = {ship_id: ship for ship_id, ship in
                                self.data.ships.items() if ship.player == self.player_id}
        ship_type_cnt = Counter(
            (self.static_data.ship_classes[ship.ship_class].name for ship in my_ships.values()))
        pretty_ship_type_cnt = ', '.join(
            f"{k}:{v}" for k, v in ship_type_cnt.most_common())
        print(f"I have {len(my_ships)} ships ({pretty_ship_type_cnt})")

        commands = {}
        for ship_id, ship in my_ships.items():
            if ship.command is not None:
                continue
            random_planet_id = random.choice(list(self.data.planets.keys()))
            print(f"sending {ship_id} to {self.data.planets[random_planet_id].name}({random_planet_id})")
            commands[ship_id] = MoveCommand(type="move", destination=Destination(target=random_planet_id))

        pprint(commands) if commands else None
        try:
            self.client.commands_post(commands)
        except ApiException as e:
            if e.status == 400:
                print("some commands failed")
                print(e.body)

    def login(self) -> str:
        player, status, headers = self.client.login_post_with_http_info(Credentials(
            username="tivvit",
            password="12345",
            player="tivvit",
        ), _return_http_data_only=False)
        self.client.api_client.cookie = headers['Set-Cookie']
        player: PlayerId = player
        return player.id


def main_loop(api_client):
    game_api = GameApi(api_client=api_client)
    while True:
        try:
            game = Game(game_api)
            game.game_loop()
            print("season ended")
        except Exception as e:
            print(f"Unexpected error {e}")


def main():
    configuration = Configuration()
    # For debug
    configuration.host = "127.0.0.1"

    main_loop(ApiClient(configuration=configuration, cookie="SESSION_ID=1"))


if __name__ == '__main__':
    main()
