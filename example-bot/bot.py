import math
from collections import Counter
from typing import Dict

from space_tycoon_client import ApiClient
from space_tycoon_client import Configuration
from space_tycoon_client import GameApi
from space_tycoon_client.models.construct_command import ConstructCommand
from space_tycoon_client.models.credentials import Credentials
from space_tycoon_client.models.current_tick import CurrentTick
from space_tycoon_client.models.data import Data
from space_tycoon_client.models.end_turn import EndTurn
from space_tycoon_client.models.player import Player
from space_tycoon_client.models.player_id import PlayerId
from space_tycoon_client.models.ship import Ship
from space_tycoon_client.models.static_data import StaticData
from space_tycoon_client.rest import ApiException


class Game:
    def __init__(self, api_client: GameApi):
        self.client = api_client
        self.player_id = self.login()
        self.static_data: StaticData = self.client.static_data_get()
        self.data: Data = self.client.data_get()
        self.tick = self.data.current_tick.tick
        self.season = self.data.current_tick.season

        # this part is custom logic, feel free to edit / delete
        if str(self.player_id) not in self.data.players:
            raise Exception("Logged as non-existent player")
        self.me: Player = self.data.players[str(self.player_id)]
        self.named_ship_classes = {ship_cls.name: ship_cls_id for ship_cls_id, ship_cls in
                                   self.static_data.ship_classes.items()}
        print(f"playing as [{self.me.name}] id: {self.player_id}")

    def game_loop(self):
        while True:
            try:
                print(f"tick {self.tick} season {self.season}")
                self.data: Data = self.client.data_get()
                print(f"I am {self.data.player_id}")
                self.game_logic()
                current_tick: CurrentTick = self.client.end_turn_post(EndTurn(
                    tick=self.tick,
                ))
                self.tick = current_tick.tick
            except ApiException as e:
                if e.status == 403:
                    print(f"New season started or login expired: {e}")
                    break
                else:
                    raise e
            except Exception as e:
                print(f"Game logic error {e}")

    def game_logic(self):
        my_ships: Dict[Ship] = {ship_id: ship for ship_id, ship in
                                self.data.ships.items() if ship.player == self.player_id}
        ship_type_cnt = Counter(
            (self.static_data.ship_classes[str(ship.ship_class)].name for ship in my_ships.values()))
        pretty_ship_type_cnt = ', '.join(f"{k}:{v}" for k, v in ship_type_cnt.most_common())
        print(f"I have {len(my_ships)} ships ({pretty_ship_type_cnt})")
        mothership_id = [ship_id for ship_id, ship in my_ships.items() if
                         str(ship.ship_class) == self.named_ship_classes["mothership"]]
        if len(mothership_id) != 1:
            print("mothership is gone :(")
            return
        mothership_id = mothership_id[0]
        shipper_class_id = self.named_ship_classes["shipper"]
        commands = {}
        buffer = 200000
        current_money = self.me.net_worth.money
        print(f"I have {current_money}$")
        current_money_without_buffer = current_money - buffer
        if current_money_without_buffer > self.static_data.ship_classes[shipper_class_id].price:
            num_shippers_to_buy = math.floor(current_money_without_buffer / self.static_data.ship_classes[
                shipper_class_id].price)
            print(f"I may buy {num_shippers_to_buy} shipper(s)")
            commands[mothership_id] = ConstructCommand(ship_class=int(shipper_class_id), type="construct")
        print(self.client.commands_post(commands))
        # todo send shippers to buy something

    def login(self) -> int:
        user, status, headers = self.client.login_post_with_http_info(Credentials(
            username="tivvit",
            password="12345",
            player="tivvit",
        ), _return_http_data_only=False)
        self.client.api_client.cookie = headers['Set-Cookie']
        user: PlayerId = user
        return user.id


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
