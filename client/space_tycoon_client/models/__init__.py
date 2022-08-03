# coding: utf-8

# flake8: noqa

# import all models into this package
# if you have many models here with many references from one model to another this may
# raise a RecursionError
# to avoid this, import only the models that you directly need like:
# from from space_tycoon_client.model.pet import Pet
# or import this package, but before doing it, use:
# import sys
# sys.setrecursionlimit(n)

from space_tycoon_client.model.attack_command import AttackCommand
from space_tycoon_client.model.color import Color
from space_tycoon_client.model.combat import Combat
from space_tycoon_client.model.command import Command
from space_tycoon_client.model.commands import Commands
from space_tycoon_client.model.construct_command import ConstructCommand
from space_tycoon_client.model.coordinates import Coordinates
from space_tycoon_client.model.credentials import Credentials
from space_tycoon_client.model.current_tick import CurrentTick
from space_tycoon_client.model.data import Data
from space_tycoon_client.model.decommission_command import DecommissionCommand
from space_tycoon_client.model.destination import Destination
from space_tycoon_client.model.end_turn import EndTurn
from space_tycoon_client.model.error import Error
from space_tycoon_client.model.move_command import MoveCommand
from space_tycoon_client.model.planets import Planets
from space_tycoon_client.model.player_id import PlayerId
from space_tycoon_client.model.players import Players
from space_tycoon_client.model.price import Price
from space_tycoon_client.model.profiling import Profiling
from space_tycoon_client.model.rename_command import RenameCommand
from space_tycoon_client.model.reports import Reports
from space_tycoon_client.model.resource import Resource
from space_tycoon_client.model.resources import Resources
from space_tycoon_client.model.score import Score
from space_tycoon_client.model.ships import Ships
from space_tycoon_client.model.static_data import StaticData
from space_tycoon_client.model.stats import Stats
from space_tycoon_client.model.stop_command import StopCommand
from space_tycoon_client.model.trade import Trade
from space_tycoon_client.model.trade_command import TradeCommand
from space_tycoon_client.model.trading_resource import TradingResource
from space_tycoon_client.model.trading_resources import TradingResources
from space_tycoon_client.model.waypoint import Waypoint
