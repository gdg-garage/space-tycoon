import math
from collections import Counter
from typing import Dict

from space_tycoon_client import ApiClient
from space_tycoon_client import Configuration
from space_tycoon_client import GameApi
from space_tycoon_client.models.construct_command import ConstructCommand
from space_tycoon_client.models.trade_command import TradeCommand
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
        if self.player_id not in self.data.players:
            raise Exception("Logged as non-existent player")
        self.me: Player = self.data.players[self.player_id]
        self.named_ship_classes = {ship_cls.name: ship_cls_id for ship_cls_id, ship_cls in
                                   self.static_data.ship_classes.items()}
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
                self.recreate_me()
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

    def dist(x, y):
        return math.sqrt((x[0] - y[0])**2 + (x[1] - y[1])**2)

    def game_logic(self):
        my_ships: Dict[Ship] = {ship_id: ship for ship_id, ship in
                                self.data.ships.items() if ship.player == self.player_id}
        ship_type_cnt = Counter(
            (self.static_data.ship_classes[ship.ship_class].name for ship in my_ships.values()))
        pretty_ship_type_cnt = ', '.join(
            f"{k}:{v}" for k, v in ship_type_cnt.most_common())
        print(f"I have {len(my_ships)} ships ({pretty_ship_type_cnt})")
        mothership_id = [ship_id for ship_id, ship in my_ships.items() if
                         ship.ship_class == self.named_ship_classes["mothership"]]
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
            commands[mothership_id] = ConstructCommand(
                ship_class=shipper_class_id, type="construct")

        # send shippers to buy something
        idle_shippers = [(ship_id, ship) for ship_id, ship in my_ships.items() if
                         ship.ship_class == shipper_class_id and ship.command is None]
        idle_empty_shippers = list(
            filter(lambda x: len(x[1].resources) == 0, idle_shippers))
        idle_non_empty_shippers = list(
            filter(lambda x: len(x[1].resources) > 0, idle_shippers))
        print(f"idle empty shippers: {[i for i, _ in idle_empty_shippers]}")
        print(
            f"idle non-empty shippers: {[i for i, _ in idle_non_empty_shippers]}")

        for planet_id, planet in self.data.planets.items():
            if len(idle_empty_shippers) == 0:
                break
            resources_by_price = sorted(filter(lambda x: x[1].buy_price is not None,
                                               planet.resources.items()), key=lambda x: x[1].buy_price)
            for res_id, res in resources_by_price:
                if len(idle_empty_shippers) == 0:
                    break
                shipper = idle_empty_shippers.pop()

                amount = min(current_money // res.buy_price, res.amount)
                commands[shipper[0]] = TradeCommand(
                    type="trade", amount=amount, resource=res_id, target=planet_id)
                d = Game.dist(planet.position, shipper[1].position)
                print(f"buying {amount} of {res_id}; distance {d}")

        res_to_shipper = {res_id: {sId: shipper} for sId, shipper in idle_non_empty_shippers for res_id in shipper.resources.keys()}
        for planet_id, planet in self.data.planets.items():
            if len(res_to_shipper) == 0:
                break
            for rId, r in planet.resources.items():
                if rId not in res_to_shipper:
                    continue
                for sId, s in res_to_shipper[rId].items():
                    amount = s.resources[rId]["amount"]
                    commands[sId] = TradeCommand(type="trade", amount=-amount, resource=rId, target=planet_id)
                    print(f"selling {amount} of {rId}")
                    del res_to_shipper[rId]

        # check if someone is close to mothership
        close_ships: Dict[Ship] = {ship_id: ship for ship_id, ship in
                                   self.data.ships.items() if ship.player != self.player_id and ship._position["x"] == self.data.ships[mothership_id]._position["x"] and ship._position["y"] == self.data.ships[mothership_id]._position["y"]}
        if len(close_ships) != 0:
            print("There are alien ships close to our Mothership!")

            # TODO defense

        print(commands)
        print(self.client.commands_post(commands))

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
