# space_tycoon_client.GameApi

All URIs are relative to *https://space-tycoon.garage-trip.cz/api/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**commands_post**](GameApi.md#commands_post) | **POST** /commands | Specify commands for your ships
[**current_tick_get**](GameApi.md#current_tick_get) | **GET** /current-tick | Returns the current tick, season and the approximate time until the next tick.
[**data_get**](GameApi.md#data_get) | **GET** /data | Dynamic game data (scores, prices, spaceship positions)
[**end_turn_post**](GameApi.md#end_turn_post) | **POST** /end-turn | Signal that your turn is over for the current tick. Returns the current tick and the approximate time until the next tick.
[**login_post**](GameApi.md#login_post) | **POST** /login | Get user session
[**reports_get**](GameApi.md#reports_get) | **GET** /reports | Fetch statistical data about all players.
[**static_data_get**](GameApi.md#static_data_get) | **GET** /static-data | Data that do not change during entire season, such as ships classes.

# **commands_post**
> commands_post(body)

Specify commands for your ships

### Example
```python
from __future__ import print_function
import time
import space_tycoon_client
from space_tycoon_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = space_tycoon_client.GameApi()
body = NULL # dict(str, Command) | 

try:
    # Specify commands for your ships
    api_instance.commands_post(body)
except ApiException as e:
    print("Exception when calling GameApi->commands_post: %s\n" % e)
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**dict(str, Command)**](dict.md)|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: */*
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **current_tick_get**
> CurrentTick current_tick_get()

Returns the current tick, season and the approximate time until the next tick.

### Example
```python
from __future__ import print_function
import time
import space_tycoon_client
from space_tycoon_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = space_tycoon_client.GameApi()

try:
    # Returns the current tick, season and the approximate time until the next tick.
    api_response = api_instance.current_tick_get()
    pprint(api_response)
except ApiException as e:
    print("Exception when calling GameApi->current_tick_get: %s\n" % e)
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**CurrentTick**](CurrentTick.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **data_get**
> Data data_get()

Dynamic game data (scores, prices, spaceship positions)

### Example
```python
from __future__ import print_function
import time
import space_tycoon_client
from space_tycoon_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = space_tycoon_client.GameApi()

try:
    # Dynamic game data (scores, prices, spaceship positions)
    api_response = api_instance.data_get()
    pprint(api_response)
except ApiException as e:
    print("Exception when calling GameApi->data_get: %s\n" % e)
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**Data**](Data.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **end_turn_post**
> CurrentTick end_turn_post(body)

Signal that your turn is over for the current tick. Returns the current tick and the approximate time until the next tick.

### Example
```python
from __future__ import print_function
import time
import space_tycoon_client
from space_tycoon_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = space_tycoon_client.GameApi()
body = space_tycoon_client.EndTurn() # EndTurn | 

try:
    # Signal that your turn is over for the current tick. Returns the current tick and the approximate time until the next tick.
    api_response = api_instance.end_turn_post(body)
    pprint(api_response)
except ApiException as e:
    print("Exception when calling GameApi->end_turn_post: %s\n" % e)
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**EndTurn**](EndTurn.md)|  | 

### Return type

[**CurrentTick**](CurrentTick.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: */*
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **login_post**
> PlayerId login_post(body)

Get user session

### Example
```python
from __future__ import print_function
import time
import space_tycoon_client
from space_tycoon_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = space_tycoon_client.GameApi()
body = space_tycoon_client.Credentials() # Credentials | 

try:
    # Get user session
    api_response = api_instance.login_post(body)
    pprint(api_response)
except ApiException as e:
    print("Exception when calling GameApi->login_post: %s\n" % e)
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**Credentials**](Credentials.md)|  | 

### Return type

[**PlayerId**](PlayerId.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: */*
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **reports_get**
> Reports reports_get()

Fetch statistical data about all players.

### Example
```python
from __future__ import print_function
import time
import space_tycoon_client
from space_tycoon_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = space_tycoon_client.GameApi()

try:
    # Fetch statistical data about all players.
    api_response = api_instance.reports_get()
    pprint(api_response)
except ApiException as e:
    print("Exception when calling GameApi->reports_get: %s\n" % e)
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**Reports**](Reports.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **static_data_get**
> StaticData static_data_get()

Data that do not change during entire season, such as ships classes.

### Example
```python
from __future__ import print_function
import time
import space_tycoon_client
from space_tycoon_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = space_tycoon_client.GameApi()

try:
    # Data that do not change during entire season, such as ships classes.
    api_response = api_instance.static_data_get()
    pprint(api_response)
except ApiException as e:
    print("Exception when calling GameApi->static_data_get: %s\n" % e)
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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
