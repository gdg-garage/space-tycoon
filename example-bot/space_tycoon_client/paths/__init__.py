# do not import all endpoints into this module because that uses a lot of memory and stack frames
# if you need the ability to import all endpoints from this module, import them with
# from space_tycoon_client.apis.path_to_api import path_to_api

import enum


class PathValues(str, enum.Enum):
    LOGIN = "/login"
    STATICDATA = "/static-data"
    DATA = "/data"
    COMMANDS = "/commands"
    ENDTURN = "/end-turn"
    CURRENTTICK = "/current-tick"
    REPORTS = "/reports"
