# space_tycoon_client.LoginApi

All URIs are relative to *https://space-tycoon.garage-trip.cz/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**login_post**](LoginApi.md#login_post) | **POST** /login | 


# **login_post**
> LoginPost200Response login_post(credentials)



### Example


```python
import time
import space_tycoon_client
from space_tycoon_client.api import login_api
from space_tycoon_client.model.login_post200_response import LoginPost200Response
from space_tycoon_client.model.error import Error
from space_tycoon_client.model.credentials import Credentials
from pprint import pprint
# Defining the host is optional and defaults to https://space-tycoon.garage-trip.cz/api
# See configuration.py for a list of all supported configuration parameters.
configuration = space_tycoon_client.Configuration(
    host = "https://space-tycoon.garage-trip.cz/api"
)


# Enter a context with an instance of the API client
with space_tycoon_client.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = login_api.LoginApi(api_client)
    credentials = Credentials(
        username="username_example",
        password="password_example",
        player="player_example",
    ) # Credentials | 

    # example passing only required values which don't have defaults set
    try:
        api_response = api_instance.login_post(credentials)
        pprint(api_response)
    except space_tycoon_client.ApiException as e:
        print("Exception when calling LoginApi->login_post: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **credentials** | [**Credentials**](Credentials.md)|  |

### Return type

[**LoginPost200Response**](LoginPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**403** | Invalid name or password |  -  |
**405** | Invalid input |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

