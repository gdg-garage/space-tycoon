from pprint import pprint

import space_tycoon_client.exceptions
# from space_tycoon_client.apis import GameApi
from space_tycoon_client.apis.tag_to_api import GameApi
from space_tycoon_client.models import Credentials
from space_tycoon_client.models import CurrentTick
from space_tycoon_client.models import Data
from space_tycoon_client.models import EndTurn
from space_tycoon_client.models import PlayerId
from space_tycoon_client.models import StaticData


class Game:
    def __init__(self, api_client: GameApi):
        self.client = api_client
        self.player_id = self.login()
        self.static_data: StaticData = self.client.static_data_get()
        self.data: Data = self.client.data_get()
        self.tick = self.data.current_tick.tick
        self.season = self.data.current_tick.season
        if str(self.player_id) not in self.data.players:
            raise Exception("Logged as non-existent player")
        print(f"playing as [{self.data.players[str(self.player_id)].name}] id: {self.player_id}")

    def game_loop(self):
        while True:
            try:
                print(f"tick {self.tick} season {self.season}")
                self.data: Data = self.client.data_get()
                self.game_logic()
                current_tick: CurrentTick = self.client.end_turn_post(EndTurn(
                    tick=self.tick,
                ))
                self.tick = current_tick.tick
            except space_tycoon_client.exceptions.ForbiddenException as e:
                print(f"New season started or login expired: {e}")
                break
            except space_tycoon_client.ApiException as e:
                print(f"Api exception {e}")
            except Exception as e:
                print(f"Game logic error {e}")

    def game_logic(self):
        # k = ['__class__',
        #      '__contains__',
        #      '__copy__',
        #      '__deepcopy__',
        #      '__delattr__',
        #      '__dict__',
        #      '__dir__',
        #      '__doc__',
        #      '__eq__',
        #      '__format__',
        #      '__ge__',
        #      '__getattr__',
        #      '__getattribute__',
        #      '__getitem__',
        #      '__gt__',
        #      '__hash__',
        #      '__init__',
        #      '__init_subclass__',
        #      '__le__',
        #      '__lt__',
        #      '__module__',
        #      '__ne__',
        #      '__new__',
        #      '__reduce__',
        #      '__reduce_ex__',
        #      '__repr__',
        #      '__setattr__',
        #      '__setitem__',
        #      '__sizeof__',
        #      '__str__',
        #      '__subclasshook__',
        #      '__weakref__',
        #      '_check_type',
        #      '_composed_schemas',
        #      '_configuration',
        #      '_data_store',
        #      '_from_openapi_data',
        #      '_new_from_openapi_data',
        #      '_nullable',
        #      '_path_to_item',
        #      '_spec_property_naming',
        #      '_visited_composed_classes',
        #      'additional_properties_type',
        #      'allowed_values',
        #      'attribute_map',
        #      'discriminator',
        #      'get',
        #      'openapi_types',
        #      'read_only_vars',
        #      'required_properties',
        #      'set_attribute',
        #      'to_dict',
        #      'to_str',
        #      'validations']
        #
        # for i in k:
        #     if i.startswith("__"):
        #         continue
        #     try:
        #         prop = getattr(self.data.ships, i)
        #         print("-----------")
        #         pprint(i)
        #         print("-----------")
        #         if callable(prop):
        #             pprint(prop())
        #         else:
        #             pprint(prop)
        #     except Exception as e:
        #         print("KO ", i, e)
        my_ships = {ship_id: ship for ship_id, ship in self.data.ships.to_dict().keys().items()} # if ship.player == self.player_id}
        # pprint(my_ships)
        pprint(my_ships["3332"])
        pprint(type(my_ships["3332"]))


    def login(self) -> int:
        try:
            # user: PlayerId = self.client.login_post(Credentials(
            #     username="tivvit",
            #     password="12345",
            #     player="tivvit",
            # ))
            user: PlayerId = self.client.login_post(Credentials(
                username="tivvit",
                password="12345",
                player="tivvit",
            ))
            return user.id
        except space_tycoon_client.exceptions.ForbiddenException as e:
            print("Exception when calling LoginApi->login_post: %s\n" % e)
        except space_tycoon_client.ApiException as e:
            print("Exception when calling LoginApi->login_post: %s\n" % e)


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
    configuration = space_tycoon_client.Configuration(
        # host = "https://space-tycoon.garage-trip.cz/api"
        host="localhost"
    )

    with space_tycoon_client.ApiClient(configuration=configuration) as api_client:
        main_loop(api_client)


if __name__ == '__main__':
    main()
