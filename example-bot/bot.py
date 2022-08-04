from pprint import pprint

import space_tycoon_client
from space_tycoon_client.api import login_api
from space_tycoon_client.model.credentials import Credentials


def main():
    username = "tivvit"
    player = "tivvit"
    password = "12345"
    
    configuration = space_tycoon_client.Configuration(
        # host = "https://space-tycoon.garage-trip.cz/api"
        host="localhost"
    )

    with space_tycoon_client.ApiClient(configuration=configuration) as api_client:
        api_instance = login_api.LoginApi(api_client)
        credentials = Credentials(
            username=username,
            password=player,
            player=password,
        )

        try:
            api_response = api_instance.login_post(credentials)
            pprint(api_response)
        except space_tycoon_client.ApiException as e:
            print("Exception when calling LoginApi->login_post: %s\n" % e)


if __name__ == '__main__':
    main()
