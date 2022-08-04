from pprint import pprint

import space_tycoon_client
from space_tycoon_client.api import login_api
from space_tycoon_client.api import static_data_api
from space_tycoon_client.api import end_turn_api
from space_tycoon_client.model.credentials import Credentials
from space_tycoon_client.model.end_turn import EndTurn


def login(api_client):
    api_instance = login_api.LoginApi(api_client)
    credentials = Credentials(
        username="tivvit",
        password="12345",
        player="tivvit",
    )

    try:
        api_response = api_instance.login_post(credentials)
        pprint(api_response)
    except space_tycoon_client.ApiException as e:
        print("Exception when calling LoginApi->login_post: %s\n" % e)


def static_data(api_client):
    api_instance = static_data_api.StaticDataApi(api_client)

    # example, this endpoint has no required or optional parameters
    try:
        return api_instance.static_data_get()
    except space_tycoon_client.ApiException as e:
        print("Exception when calling StaticDataApi->static_data_get: %s\n" % e)


def game_loop(api_client, game_static_data):
    tick = 0
    while True:
        end_turn = end_turn_api.EndTurnApi(api_client).end_turn_post(EndTurn(
            tick=tick,
        ))
        pprint(end_turn)


def main_loop(api_client):
    while True:
        login(api_client)
        static_game_data = static_data(api_client)
        pprint(static_game_data)
        # todo handle new season
        game_loop(api_client, static_game_data)


def main():
    configuration = space_tycoon_client.Configuration(
        # host = "https://space-tycoon.garage-trip.cz/api"
        host="localhost"
    )

    with space_tycoon_client.ApiClient(configuration=configuration) as api_client:
        main_loop(api_client)


if __name__ == '__main__':
    main()
