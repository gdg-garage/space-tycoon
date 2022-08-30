# space_tycoon_client.DevApi

All URIs are relative to *https://space-tycoon.garage-trip.cz/api/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_user_post**](DevApi.md#create_user_post) | **POST** /create-user | create user
[**reset_get**](DevApi.md#reset_get) | **GET** /reset | start new season (call this after creating the users)

# **create_user_post**
> create_user_post(body=body)

create user

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
api_instance = space_tycoon_client.DevApi(space_tycoon_client.ApiClient(configuration))
body = space_tycoon_client.Credentials() # Credentials |  (optional)

try:
    # create user
    api_instance.create_user_post(body=body)
except ApiException as e:
    print("Exception when calling DevApi->create_user_post: %s\n" % e)
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**Credentials**](Credentials.md)|  | [optional] 

### Return type

void (empty response body)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

 - **Content-Type**: */*
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **reset_get**
> reset_get()

start new season (call this after creating the users)

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
api_instance = space_tycoon_client.DevApi(space_tycoon_client.ApiClient(configuration))

try:
    # start new season (call this after creating the users)
    api_instance.reset_get()
except ApiException as e:
    print("Exception when calling DevApi->reset_get: %s\n" % e)
```

### Parameters
This endpoint does not need any parameter.

### Return type

void (empty response body)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

