"""
    Space Tycoon

    Space Tycoon server.  # noqa: E501

    The version of the OpenAPI document: 1.0.0
    Generated by: https://openapi-generator.tech
"""


import unittest

import space_tycoon_client
from space_tycoon_client.api.static_data_api import StaticDataApi  # noqa: E501


class TestStaticDataApi(unittest.TestCase):
    """StaticDataApi unit test stubs"""

    def setUp(self):
        self.api = StaticDataApi()  # noqa: E501

    def tearDown(self):
        pass

    def test_static_data_get(self):
        """Test case for static_data_get

        """
        pass


if __name__ == '__main__':
    unittest.main()