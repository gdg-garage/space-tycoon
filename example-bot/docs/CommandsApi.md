# space_tycoon_client.CommandsApi

All URIs are relative to *https://space-tycoon.garage-trip.cz/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**commands_post**](CommandsApi.md#commands_post) | **POST** /commands | 


# **commands_post**
> commands_post(commands)



### Example


```python
import time
import space_tycoon_client
from space_tycoon_client.api import commands_api
from space_tycoon_client.model.commands import Commands
from space_tycoon_client.model.error import Error
from space_tycoon_client.model.command_error import CommandError
from pprint import pprint
# Defining the host is optional and defaults to https://space-tycoon.garage-trip.cz/api
# See configuration.py for a list of all supported configuration parameters.
configuration = space_tycoon_client.Configuration(
    host = "https://space-tycoon.garage-trip.cz/api"
)


# Enter a context with an instance of the API client
with space_tycoon_client.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = commands_api.CommandsApi(api_client)
    commands = Commands(
        key=Command(None),
    ) # Commands | 

    # example passing only required values which don't have defaults set
    try:
        api_instance.commands_post(commands)
    except space_tycoon_client.ApiException as e:
        print("Exception when calling CommandsApi->commands_post: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **commands** | [**Commands**](Commands.md)|  |

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**403** | Please login again |  -  |
**405** | Invalid input |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

