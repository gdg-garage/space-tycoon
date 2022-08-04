# space_tycoon_client.EndTurnApi

All URIs are relative to *https://space-tycoon.garage-trip.cz/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**end_turn_post**](EndTurnApi.md#end_turn_post) | **POST** /end-turn | 


# **end_turn_post**
> CurrentTick end_turn_post(end_turn)



### Example


```python
import time
import space_tycoon_client
from space_tycoon_client.api import end_turn_api
from space_tycoon_client.model.error import Error
from space_tycoon_client.model.end_turn import EndTurn
from space_tycoon_client.model.current_tick import CurrentTick
from pprint import pprint
# Defining the host is optional and defaults to https://space-tycoon.garage-trip.cz/api
# See configuration.py for a list of all supported configuration parameters.
configuration = space_tycoon_client.Configuration(
    host = "https://space-tycoon.garage-trip.cz/api"
)


# Enter a context with an instance of the API client
with space_tycoon_client.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = end_turn_api.EndTurnApi(api_client)
    end_turn = EndTurn(
        tick=1,
    ) # EndTurn | 

    # example passing only required values which don't have defaults set
    try:
        api_response = api_instance.end_turn_post(end_turn)
        pprint(api_response)
    except space_tycoon_client.ApiException as e:
        print("Exception when calling EndTurnApi->end_turn_post: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **end_turn** | [**EndTurn**](EndTurn.md)|  |

### Return type

[**CurrentTick**](CurrentTick.md)

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

