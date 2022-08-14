# GameApi

All URIs are relative to *https://space-tycoon.garage-trip.cz/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**commandsPost**](GameApi.md#commandsPost) | **POST** /commands | Specify commands for your ships
[**currentTickGet**](GameApi.md#currentTickGet) | **GET** /current-tick | Returns the current tick, season and the approximate time until the next tick.
[**dataGet**](GameApi.md#dataGet) | **GET** /data | Dynamic game data (scores, prices, spaceship positions)
[**endTurnPost**](GameApi.md#endTurnPost) | **POST** /end-turn | Signal that your turn is over for the current tick. Returns the current tick and the approximate time until the next tick.
[**loginPost**](GameApi.md#loginPost) | **POST** /login | Get user session
[**reportsGet**](GameApi.md#reportsGet) | **GET** /reports | Fetch statistical data about all players.
[**staticDataGet**](GameApi.md#staticDataGet) | **GET** /static-data | Data that do not change during entire season, such as ships classes.


<a name="commandsPost"></a>
# **commandsPost**
> commandsPost(requestBody)

Specify commands for your ships

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.GameApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("https://space-tycoon.garage-trip.cz/api");

    GameApi apiInstance = new GameApi(defaultClient);
    Map<String, Command> requestBody = new HashMap(); // Map<String, Command> | 
    try {
      apiInstance.commandsPost(requestBody);
    } catch (ApiException e) {
      System.err.println("Exception when calling GameApi#commandsPost");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **requestBody** | [**Map&lt;String, Command&gt;**](Command.md)|  |

### Return type

null (empty response body)

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

<a name="currentTickGet"></a>
# **currentTickGet**
> CurrentTick currentTickGet()

Returns the current tick, season and the approximate time until the next tick.

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.GameApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("https://space-tycoon.garage-trip.cz/api");

    GameApi apiInstance = new GameApi(defaultClient);
    try {
      CurrentTick result = apiInstance.currentTickGet();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GameApi#currentTickGet");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
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

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**403** | Please login again |  -  |

<a name="dataGet"></a>
# **dataGet**
> Data dataGet()

Dynamic game data (scores, prices, spaceship positions)

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.GameApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("https://space-tycoon.garage-trip.cz/api");

    GameApi apiInstance = new GameApi(defaultClient);
    try {
      Data result = apiInstance.dataGet();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GameApi#dataGet");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
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

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**403** | Please login again |  -  |

<a name="endTurnPost"></a>
# **endTurnPost**
> CurrentTick endTurnPost(endTurn)

Signal that your turn is over for the current tick. Returns the current tick and the approximate time until the next tick.

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.GameApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("https://space-tycoon.garage-trip.cz/api");

    GameApi apiInstance = new GameApi(defaultClient);
    EndTurn endTurn = new EndTurn(); // EndTurn | 
    try {
      CurrentTick result = apiInstance.endTurnPost(endTurn);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GameApi#endTurnPost");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **endTurn** | [**EndTurn**](EndTurn.md)|  |

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

<a name="loginPost"></a>
# **loginPost**
> PlayerId loginPost(credentials)

Get user session

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.GameApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("https://space-tycoon.garage-trip.cz/api");

    GameApi apiInstance = new GameApi(defaultClient);
    Credentials credentials = new Credentials(); // Credentials | 
    try {
      PlayerId result = apiInstance.loginPost(credentials);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GameApi#loginPost");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **credentials** | [**Credentials**](Credentials.md)|  |

### Return type

[**PlayerId**](PlayerId.md)

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

<a name="reportsGet"></a>
# **reportsGet**
> Reports reportsGet()

Fetch statistical data about all players.

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.GameApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("https://space-tycoon.garage-trip.cz/api");

    GameApi apiInstance = new GameApi(defaultClient);
    try {
      Reports result = apiInstance.reportsGet();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GameApi#reportsGet");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
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

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**403** | Please login again |  -  |

<a name="staticDataGet"></a>
# **staticDataGet**
> StaticData staticDataGet()

Data that do not change during entire season, such as ships classes.

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.GameApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("https://space-tycoon.garage-trip.cz/api");

    GameApi apiInstance = new GameApi(defaultClient);
    try {
      StaticData result = apiInstance.staticDataGet();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GameApi#staticDataGet");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
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

