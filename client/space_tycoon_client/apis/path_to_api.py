import typing

from space_tycoon_client.paths import PathValues
from space_tycoon_client.apis.paths.login import Login
from space_tycoon_client.apis.paths.static_data import StaticData
from space_tycoon_client.apis.paths.data import Data
from space_tycoon_client.apis.paths.commands import Commands
from space_tycoon_client.apis.paths.end_turn import EndTurn
from space_tycoon_client.apis.paths.current_tick import CurrentTick
from space_tycoon_client.apis.paths.reports import Reports

PathToApi = typing.TypedDict(
    'PathToApi',
    {
        PathValues.LOGIN: Login,
        PathValues.STATICDATA: StaticData,
        PathValues.DATA: Data,
        PathValues.COMMANDS: Commands,
        PathValues.ENDTURN: EndTurn,
        PathValues.CURRENTTICK: CurrentTick,
        PathValues.REPORTS: Reports,
    }
)

path_to_api = PathToApi(
    {
        PathValues.LOGIN: Login,
        PathValues.STATICDATA: StaticData,
        PathValues.DATA: Data,
        PathValues.COMMANDS: Commands,
        PathValues.ENDTURN: EndTurn,
        PathValues.CURRENTTICK: CurrentTick,
        PathValues.REPORTS: Reports,
    }
)
