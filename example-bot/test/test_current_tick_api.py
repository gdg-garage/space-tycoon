"""
    Space Tycoon

    Space Tycoon server.  # noqa: E501

    The version of the OpenAPI document: 1.0.0
    Generated by: https://openapi-generator.tech
"""


import unittest

import space_tycoon_client
from space_tycoon_client.api.current_tick_api import CurrentTickApi  # noqa: E501


class TestCurrentTickApi(unittest.TestCase):
    """CurrentTickApi unit test stubs"""

    def setUp(self):
        self.api = CurrentTickApi()  # noqa: E501

    def tearDown(self):
        pass

    def test_current_tick_get(self):
        """Test case for current_tick_get

        """
        pass


if __name__ == '__main__':
    unittest.main()