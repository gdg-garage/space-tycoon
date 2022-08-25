import math
import traceback
from collections import Counter
from pprint import pprint
from typing import Dict
from typing import List
from typing import Optional
from typing import Tuple

from space_tycoon_client import ApiClient
from space_tycoon_client import Configuration
from space_tycoon_client import GameApi
from space_tycoon_client.models.attack_command import AttackCommand
from space_tycoon_client.models.construct_command import ConstructCommand
from space_tycoon_client.models.credentials import Credentials
from space_tycoon_client.models.current_tick import CurrentTick
from space_tycoon_client.models.data import Data
from space_tycoon_client.models.end_turn import EndTurn
from space_tycoon_client.models.player import Player
from space_tycoon_client.models.player_id import PlayerId
from space_tycoon_client.models.ship import Ship
from space_tycoon_client.models.static_data import StaticData
from space_tycoon_client.models.trade_command import TradeCommand
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
        self.named_ship_classes = {}
        self.stuck_ships_id = set()
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

    @staticmethod
    def dist(a, b):
        return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

    def game_logic(self):
        # todo throw all this away
        self.recreate_me()
        my_ships: Dict[Ship] = {ship_id: ship for ship_id, ship in
                                self.data.ships.items() if ship.player == self.player_id}
        self.stuck_ships_id = {ship_id for ship_id, ship in my_ships.items() if ship.command is not None and
                               ship.command.type == "trade" and ship.position == ship.prev_position}
        ship_type_cnt = Counter(
            (self.static_data.ship_classes[ship.shipClass].name for ship in my_ships.values()))
        pretty_ship_type_cnt = ', '.join(
            f"{k}:{v}" for k, v in ship_type_cnt.most_common())
        print(f"I have {len(my_ships)} ships ({pretty_ship_type_cnt})")
        mothership_id = [ship_id for ship_id, ship in my_ships.items() if
                         ship.shipClass == self.named_ship_classes["mothership"]]
        if len(mothership_id) != 1:
            print("mothership is gone :(")
            return
        mothership_id = mothership_id[0]
        shipper_class_id = self.named_ship_classes["shipper"]
        fighter_class_id = self.named_ship_classes["fighter"]
        bomber_class_id = self.named_ship_classes["bomber"]
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
                ship_class=shipper_class_id)

        # move example
        # commands[ship_id] = MoveCommand(type="move", destination=Destination(target=1))
        # commands[mothership_id] = MoveCommand(type="move", destination=Destination(coordinates=[0, 0]))

        ongoing_trades = {(ship.command.resource, ship.command.target) for ship_id, ship in my_ships.items() if
                          ship.shipClass == shipper_class_id and
                          ship.command is not None and ship.command.type == "trade" and ship.command.amount > 0}

        # send shippers to buy something
        idle_shippers: List[Tuple[str, Ship]] = [(ship_id, ship) for ship_id, ship in my_ships.items() if
                                                 ship.shipClass == shipper_class_id and (
                                                         ship.command is None or ship_id in self.stuck_ships_id)]
        # some shippers may be stuck because of some precondition
        idle_empty_shippers = list(
            filter(lambda x: len(x[1].resources) == 0, idle_shippers))
        idle_non_empty_shippers = list(
            filter(lambda x: len(x[1].resources) > 0, idle_shippers))
        print(f"idle empty shippers: {[i for i, _ in idle_empty_shippers]}")
        print(
            f"idle non-empty shippers: {[i for i, _ in idle_non_empty_shippers]}")

        buy_resources = {}
        sell_resources = {}
        if len(idle_empty_shippers) > 0 or len(idle_non_empty_shippers) > 0:
            for planet_id, planet in self.data.planets.items():
                for resource_id, resource in planet.resources.items():
                    # possible to buy?
                    if resource.buyPrice is not None and resource.amount > 0:
                        if resource_id not in buy_resources:
                            buy_resources[resource_id] = []
                        buy_resources[resource_id].append((planet_id, planet, resource))
                    if resource.sellPrice is not None:
                        if resource_id not in sell_resources:
                            sell_resources[resource_id] = []
                        sell_resources[resource_id].append((planet_id, planet, resource))

        # buy
        if len(idle_empty_shippers) > 0:
            possible_trades = []
            for res_id in (res_id for res_id in buy_resources if res_id in sell_resources):
                for buy_planet_id, buy_planet, buy_resource in buy_resources[res_id]:
                    for sell_planet_id, sell_planet, sell_resource in sell_resources[res_id]:
                        # optimized for shippers
                        possible_trades.append({"resource_id": res_id,
                                                "buy_planet_id": buy_planet_id,
                                                "amount": buy_resource.amount,
                                                "profit": (sell_resource.sellPrice - buy_resource.buyPrice) *
                                                          min(self.static_data.ship_classes[
                                                                  shipper_class_id].cargo_capacity,
                                                              buy_resource.amount),
                                                "distance": self.dist(buy_planet.position, sell_planet.position)})

            best_trades = sorted(possible_trades, key=lambda x: (x["profit"], x["distance"]), reverse=True)
            # pprint(best_trades[:20])

            for ship_id, ship in idle_empty_shippers:
                # do not travel far coefficient
                ship_best_trades = sorted(possible_trades, key=lambda x: (x["profit"] * (1 - (
                        self.dist(ship.position, self.data.planets[x["buy_planet_id"]].position) / 2000))),
                                          reverse=True)
                best_trade_idx = 0
                trade = ship_best_trades[best_trade_idx]

                amount = min(trade["amount"], self.static_data.ship_classes[ship.ship_class].cargo_capacity)
                trade_id = (trade["resource_id"], trade["buy_planet_id"])
                while trade_id in ongoing_trades:
                    best_trade_idx += 1
                    if best_trade_idx >= len(ship_best_trades):
                        break
                    trade = ship_best_trades[best_trade_idx]
                    trade_id = (trade["resource_id"], trade["buy_planet_id"])
                # tried everything
                if trade_id in ongoing_trades:
                    break

                commands[ship_id] = TradeCommand(
                    amount=amount,
                    resource=trade["resource_id"], target=trade["buy_planet_id"])
                print(
                    f"buying {amount} of {self.static_data.resource_names[trade['resource_id']]}, distance {trade['distance']}, expected profit {trade['profit']}")
                ongoing_trades.add(trade_id)

        # sell
        if len(idle_non_empty_shippers) > 0:
            for ship_id, ship in idle_non_empty_shippers:
                # expect only one type is transferred
                resource_id = list(ship.resources.keys())[0]
                if resource_id not in sell_resources:
                    continue
                sell_planet_id, sell_planet, sell_resource = max(sell_resources[resource_id],
                                                                 key=lambda x: x[2].sellPrice * (1 - (self.dist(
                                                                     ship.position,
                                                                     self.data.planets[x[0]].position) / 2000)))
                amount = ship.resources[resource_id]["amount"]
                print(amount)
                commands[ship_id] = TradeCommand(amount=-amount, resource=resource_id,
                                                 target=sell_planet_id)
                print(
                    f"selling {amount} of [{self.static_data.resource_names[resource_id]}] distance {self.dist(ship.position, sell_planet.position)}")

        # be aggressive
        # use swarming (all attack to one)
        idle_attack_ships: List[Tuple[str, Ship]] = [(ship_id, ship) for ship_id, ship in my_ships.items() if
                                                     ship.shipClass in {fighter_class_id, bomber_class_id} and (
                                                             ship.command is None or ship_id in self.stuck_ships_id)]

        enemy_ships = []
        if len(idle_attack_ships) > 0:
            enemy_ships = sorted(((ship_id, ship) for ship_id, ship in
                                  self.data.ships.items() if ship.player != self.player_id), key=lambda x:
            self.dist(x[1].position, idle_attack_ships[0][1].position))
        if len(idle_attack_ships) > 0 and len(enemy_ships) > 0:
            target_id = enemy_ships[0][0]

            for ship_id, ship in idle_attack_ships:
                # attack on self should fail
                commands[ship_id] = AttackCommand(target=target_id)

        # defense
        # check if someone is close to our mothership
        close_ships: Dict[Ship] = {ship_id: ship for ship_id, ship in
                                   self.data.ships.items() if ship.player != self.player_id and
                                   self.dist(ship.position, self.data.ships[mothership_id].position) <= 1}
        # mothership defends itself
        if len(close_ships) > 0:
            print(f"There are {len(close_ships)} alien ships close to our Mothership!")
            commands[mothership_id] = AttackCommand(target=list(close_ships.keys())[0])

        pprint(commands) if commands else None
        try:
            commands_result = self.client.commands_post(commands)
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
