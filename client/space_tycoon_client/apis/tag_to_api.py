import typing

from space_tycoon_client.apis.tags import TagValues
from space_tycoon_client.apis.tags.login_api import LoginApi
from space_tycoon_client.apis.tags.static_data_api import StaticDataApi
from space_tycoon_client.apis.tags.data_api import DataApi
from space_tycoon_client.apis.tags.commands_api import CommandsApi
from space_tycoon_client.apis.tags.current_tick_api import CurrentTickApi
from space_tycoon_client.apis.tags.end_turn_api import EndTurnApi
from space_tycoon_client.apis.tags.reports_api import ReportsApi

TagToApi = typing.TypedDict(
    'TagToApi',
    {
        TagValues.LOGIN: LoginApi,
        TagValues.STATICDATA: StaticDataApi,
        TagValues.DATA: DataApi,
        TagValues.COMMANDS: CommandsApi,
        TagValues.CURRENTTICK: CurrentTickApi,
        TagValues.ENDTURN: EndTurnApi,
        TagValues.REPORTS: ReportsApi,
    }
)

tag_to_api = TagToApi(
    {
        TagValues.LOGIN: LoginApi,
        TagValues.STATICDATA: StaticDataApi,
        TagValues.DATA: DataApi,
        TagValues.COMMANDS: CommandsApi,
        TagValues.CURRENTTICK: CurrentTickApi,
        TagValues.ENDTURN: EndTurnApi,
        TagValues.REPORTS: ReportsApi,
    }
)
