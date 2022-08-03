# space_tycoon_client.CommandsApi

All URIs are relative to *https://space-tycoon.garage-trip.cz/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**commands_post**](CommandsApi.md#commands_post) | **post** /commands | 

# **commands_post**
> commands_post(commands)



### Example

```python
import space_tycoon_client
from space_tycoon_client.apis.tags import commands_api
from space_tycoon_client.model.commands import Commands
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
    api_instance = commands_api.CommandsApi(api_client)

    # example passing only required values which don't have defaults set
    body = Commands(
        key=Command(None),
    )
    try:
        api_response = api_instance.commands_post(
            body=body,
        )
    except space_tycoon_client.ApiException as e:
        print("Exception when calling CommandsApi->commands_post: %s\n" % e)
```
### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
body | typing.Union[SchemaForRequestBody] | required |
content_type | str | optional, default is '*/*' | Selects the schema and serialization of the request body
accept_content_types | typing.Tuple[str] | default is ('application/json', ) | Tells the server the content type(s) that are accepted by the client
stream | bool | default is False | if True then the response.content will be streamed and loaded from a file like object. When downloading a file, set this to True to force the code to deserialize the content to a FileSchema file
timeout | typing.Optional[typing.Union[int, typing.Tuple]] | default is None | the timeout used by the rest client
skip_deserialization | bool | default is False | when True, headers and body will be unset and an instance of api_client.ApiResponseWithoutDeserialization will be returned

### body

#### SchemaForRequestBody
Type | Description  | Notes
------------- | ------------- | -------------
[**Commands**](Commands.md) |  | 


### Return Types, Responses

Code | Class | Description
------------- | ------------- | -------------
n/a | api_client.ApiResponseWithoutDeserialization | When skip_deserialization is True this response is returned
200 | ApiResponseFor200 | OK
403 | ApiResponseFor403 | Please login again
405 | ApiResponseFor405 | Invalid input

#### ApiResponseFor200
Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
response | urllib3.HTTPResponse | Raw response |
body | typing.Union[] |  |
headers | Unset | headers were not defined |

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


#### ApiResponseFor405
Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
response | urllib3.HTTPResponse | Raw response |
body | typing.Union[SchemaFor405ResponseBodyApplicationJson, ] |  |
headers | Unset | headers were not defined |

#### SchemaFor405ResponseBodyApplicationJson
Type | Description  | Notes
------------- | ------------- | -------------
[**Error**](Error.md) |  | 



void (empty response body)

### Authorization

No authorization required

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

