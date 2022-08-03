# space_tycoon_client.StaticDataApi

All URIs are relative to *https://space-tycoon.garage-trip.cz/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**static_data_get**](StaticDataApi.md#static_data_get) | **get** /static-data | 

# **static_data_get**
> StaticData static_data_get()



### Example

```python
import space_tycoon_client
from space_tycoon_client.apis.tags import static_data_api
from space_tycoon_client.model.static_data import StaticData
from space_tycoon_client.model.error import Error
from pprint import pprint
# Defining the host is optional and defaults to https://space-tycoon.garage-trip.cz/api
# See configuration.py for a list of all supported configuration parameters.
configuration = space_tycoon_client.Configuration(
    host = "https://space-tycoon.garage-trip.cz/api"
)

# Enter a context with an instance of the API client
with space_tycoon_client.ApiClient(configuration) as api_client:
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

### Return Types, Responses

Code | Class | Description
------------- | ------------- | -------------
n/a | api_client.ApiResponseWithoutDeserialization | When skip_deserialization is True this response is returned
200 | ApiResponseFor200 | OK
403 | ApiResponseFor403 | Please login again

#### ApiResponseFor200
Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
response | urllib3.HTTPResponse | Raw response |
body | typing.Union[SchemaFor200ResponseBodyApplicationJson, ] |  |
headers | Unset | headers were not defined |

#### SchemaFor200ResponseBodyApplicationJson
Type | Description  | Notes
------------- | ------------- | -------------
[**StaticData**](StaticData.md) |  | 


#### ApiResponseFor403
Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
response | urllib3.HTTPResponse | Raw response |
body | typing.Union[SchemaFor403ResponseBodyApplicationJson, ] |  |
headers | Unset | headers were not defined |

#### SchemaFor403ResponseBodyApplicationJson
Type | Description  | Notes
------------- | ------------- | -------------
[**Error**](Error.md) |  | 



[**StaticData**](StaticData.md)

### Authorization

No authorization required

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

