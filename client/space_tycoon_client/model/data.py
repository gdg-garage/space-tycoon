# coding: utf-8

"""
    Space Tycoon

    Space Tycoon server.  # noqa: E501

    The version of the OpenAPI document: 1.0.0
    Generated by: https://openapi-generator.tech
"""

import re  # noqa: F401
import sys  # noqa: F401
import typing  # noqa: F401
import functools  # noqa: F401

from frozendict import frozendict  # noqa: F401

import decimal  # noqa: F401
from datetime import date, datetime  # noqa: F401
from frozendict import frozendict  # noqa: F401

from space_tycoon_client.schemas import (  # noqa: F401
    AnyTypeSchema,
    ComposedSchema,
    DictSchema,
    ListSchema,
    StrSchema,
    IntSchema,
    Int32Schema,
    Int64Schema,
    Float32Schema,
    Float64Schema,
    NumberSchema,
    UUIDSchema,
    DateSchema,
    DateTimeSchema,
    DecimalSchema,
    BoolSchema,
    BinarySchema,
    NoneSchema,
    none_type,
    Configuration,
    Unset,
    unset,
    ComposedBase,
    ListBase,
    DictBase,
    NoneBase,
    StrBase,
    IntBase,
    Int32Base,
    Int64Base,
    Float32Base,
    Float64Base,
    NumberBase,
    UUIDBase,
    DateBase,
    DateTimeBase,
    BoolBase,
    BinaryBase,
    Schema,
    NoneClass,
    BoolClass,
    _SchemaValidator,
    _SchemaTypeChecker,
    _SchemaEnumMaker
)


class Data(
    DictSchema
):
    """NOTE: This class is auto generated by OpenAPI Generator.
    Ref: https://openapi-generator.tech

    Do not edit the class manually.
    """

    @classmethod
    @property
    def current-tick(cls) -> typing.Type['CurrentTick']:
        return CurrentTick

    @classmethod
    @property
    def planets(cls) -> typing.Type['Planets']:
        return Planets

    @classmethod
    @property
    def player(cls) -> typing.Type['PlayerId']:
        return PlayerId

    @classmethod
    @property
    def players(cls) -> typing.Type['Players']:
        return Players

    @classmethod
    @property
    def ships(cls) -> typing.Type['Ships']:
        return Ships


    def __new__(
        cls,
        *args: typing.Union[dict, frozendict, ],
        planets: typing.Union['Planets', Unset] = unset,
        player: typing.Union['PlayerId', Unset] = unset,
        players: typing.Union['Players', Unset] = unset,
        ships: typing.Union['Ships', Unset] = unset,
        _configuration: typing.Optional[Configuration] = None,
        **kwargs: typing.Type[Schema],
    ) -> 'Data':
        return super().__new__(
            cls,
            *args,
            planets=planets,
            player=player,
            players=players,
            ships=ships,
            _configuration=_configuration,
            **kwargs,
        )

from space_tycoon_client.model.current_tick import CurrentTick
from space_tycoon_client.model.planets import Planets
from space_tycoon_client.model.player_id import PlayerId
from space_tycoon_client.model.players import Players
from space_tycoon_client.model.ships import Ships
