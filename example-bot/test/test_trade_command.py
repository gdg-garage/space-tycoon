"""
    Space Tycoon

    Space Tycoon server.  # noqa: E501

    The version of the OpenAPI document: 1.0.0
    Generated by: https://openapi-generator.tech
"""


import sys
import unittest

import space_tycoon_client
from space_tycoon_client.model.command import Command
from space_tycoon_client.model.trade_command_all_of import TradeCommandAllOf
globals()['Command'] = Command
globals()['TradeCommandAllOf'] = TradeCommandAllOf
from space_tycoon_client.model.trade_command import TradeCommand


class TestTradeCommand(unittest.TestCase):
    """TradeCommand unit test stubs"""

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def testTradeCommand(self):
        """Test TradeCommand"""
        # FIXME: construct object with mandatory attributes with example values
        # model = TradeCommand()  # noqa: E501
        pass


if __name__ == '__main__':
    unittest.main()