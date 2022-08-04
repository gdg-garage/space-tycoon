
# flake8: noqa

# Import all APIs into this package.
# If you have many APIs here with many many models used in each API this may
# raise a `RecursionError`.
# In order to avoid this, import only the API that you directly need like:
#
#   from space_tycoon_client.api.commands_api import CommandsApi
#
# or import this package, but before doing it, use:
#
#   import sys
#   sys.setrecursionlimit(n)

# Import APIs into API package:
from space_tycoon_client.api.commands_api import CommandsApi
from space_tycoon_client.api.current_tick_api import CurrentTickApi
from space_tycoon_client.api.data_api import DataApi
from space_tycoon_client.api.end_turn_api import EndTurnApi
from space_tycoon_client.api.login_api import LoginApi
from space_tycoon_client.api.reports_api import ReportsApi
from space_tycoon_client.api.static_data_api import StaticDataApi
