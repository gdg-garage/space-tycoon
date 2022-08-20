# space_tycoon_client.DataApi

All URIs are relative to *https://space-tycoon.garage-trip.cz/api/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**data_get**](DataApi.md#data_get) | **GET** /data | Dynamic game data (scores, prices, spaceship positions)

# **data_get**
> Data data_get(season=season, tick=tick)

Dynamic game data (scores, prices, spaceship positions)

### Example
```python
from __future__ import print_function
import time
import space_tycoon_client
from space_tycoon_client.rest import ApiException
from pprint import pprint

# Configure API key authorization: cookieAuth
configuration = space_tycoon_client.Configuration()
configuration.api_key['SESSION_ID'] = 'YOUR_API_KEY'
# Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
# configuration.api_key_prefix['SESSION_ID'] = 'Bearer'

# create an instance of the API class
api_instance = space_tycoon_client.DataApi(space_tycoon_client.ApiClient(configuration))
season = 56 # int |  (optional)
tick = 56 # int |  (optional)

try:
    # Dynamic game data (scores, prices, spaceship positions)
    api_response = api_instance.data_get(season=season, tick=tick)
    pprint(api_response)
except ApiException as e:
    print("Exception when calling DataApi->data_get: %s\n" % e)
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **season** | **int**|  | [optional] 
 **tick** | **int**|  | [optional] 

### Return type

[**Data**](Data.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

