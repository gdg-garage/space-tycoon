# space_tycoon_client.LogoutApi

All URIs are relative to *https://space-tycoon.garage-trip.cz/api/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**logout_get**](LogoutApi.md#logout_get) | **GET** /logout | 

# **logout_get**
> logout_get()



### Example
```python
from __future__ import print_function
import time
import space_tycoon_client
from space_tycoon_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = space_tycoon_client.LogoutApi()

try:
    api_instance.logout_get()
except ApiException as e:
    print("Exception when calling LogoutApi->logout_get: %s\n" % e)
```

### Parameters
This endpoint does not need any parameter.

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

