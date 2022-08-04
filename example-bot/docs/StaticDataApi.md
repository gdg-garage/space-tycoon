# space_tycoon_client.StaticDataApi

All URIs are relative to *https://space-tycoon.garage-trip.cz/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**static_data_get**](StaticDataApi.md#static_data_get) | **GET** /static-data | 


# **static_data_get**
> StaticData static_data_get()



### Example


```python
import time
import space_tycoon_client
from space_tycoon_client.api import static_data_api
from space_tycoon_client.model.static_data import StaticData
from space_tycoon_client.model.error import Error
from pprint import pprint
# Defining the host is optional and defaults to https://space-tycoon.garage-trip.cz/api
# See configuration.py for a list of all supported configuration parameters.
configuration = space_tycoon_client.Configuration(
    host = "https://space-tycoon.garage-trip.cz/api"
)


# Enter a context with an instance of the API client
with space_tycoon_client.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = static_data_api.StaticDataApi(api_client)

    # example, this endpoint has no required or optional parameters
    try:
        api_response = api_instance.static_data_get()
        pprint(api_response)
    except space_tycoon_client.ApiException as e:
        print("Exception when calling StaticDataApi->static_data_get: %s\n" % e)
```


### Parameters
This endpoint does not need any parameter.

### Return type

[**StaticData**](StaticData.md)

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

