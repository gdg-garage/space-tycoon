# coding: utf-8

"""


    Generated by: https://openapi-generator.tech
"""

import unittest
from unittest.mock import patch

import urllib3

import space_tycoon_client
from space_tycoon_client.paths.end_turn import post  # noqa: E501
from space_tycoon_client import configuration, schemas, api_client

from .. import ApiTestMixin


class TestEndTurn(ApiTestMixin, unittest.TestCase):
    """
    EndTurn unit test stubs
    """
    _configuration = configuration.Configuration()

    def setUp(self):
        used_api_client = api_client.ApiClient(configuration=self._configuration)
        self.api = post.ApiForpost(api_client=used_api_client)  # noqa: E501

    def tearDown(self):
        pass

    response_status = 200






if __name__ == '__main__':
    unittest.main()
