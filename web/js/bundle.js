(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _superagent = _interopRequireDefault(require("superagent"));

var _querystring = _interopRequireDefault(require("querystring"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
* @module ApiClient
* @version 1.0.0
*/

/**
* Manages low level client-server communications, parameter marshalling, etc. There should not be any need for an
* application to use this class directly - the *Api and model classes provide the public API for the service. The
* contents of this file should be regarded as internal but are documented for completeness.
* @alias module:ApiClient
* @class
*/
var ApiClient = /*#__PURE__*/function () {
  /**
   * The base URL against which to resolve every API call's (relative) path.
   * Overrides the default value set in spec file if present
   * @param {String} basePath
   */
  function ApiClient() {
    var basePath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'https://space-tycoon.garage-trip.cz/api';

    _classCallCheck(this, ApiClient);

    /**
     * The base URL against which to resolve every API call's (relative) path.
     * @type {String}
     * @default https://space-tycoon.garage-trip.cz/api
     */
    this.basePath = basePath.replace(/\/+$/, '');
    /**
     * The authentication methods to be included for all API calls.
     * @type {Array.<String>}
     */

    this.authentications = {
      'cookieAuth': {
        type: 'apiKey',
        'in': 'query',
        name: 'SESSION_ID'
      }
    };
    /**
     * The default HTTP headers to be included for all API calls.
     * @type {Array.<String>}
     * @default {}
     */

    this.defaultHeaders = {
      'User-Agent': 'OpenAPI-Generator/1.0.0/Javascript'
    };
    /**
     * The default HTTP timeout for all API calls.
     * @type {Number}
     * @default 60000
     */

    this.timeout = 60000;
    /**
     * If set to false an additional timestamp parameter is added to all API GET calls to
     * prevent browser caching
     * @type {Boolean}
     * @default true
     */

    this.cache = true;
    /**
     * If set to true, the client will save the cookies from each server
     * response, and return them in the next request.
     * @default false
     */

    this.enableCookies = false;
    /*
     * Used to save and return cookies in a node.js (non-browser) setting,
     * if this.enableCookies is set to true.
     */

    if (typeof window === 'undefined') {
      this.agent = new _superagent["default"].agent();
    }
    /*
     * Allow user to override superagent agent
     */


    this.requestAgent = null;
    /*
     * Allow user to add superagent plugins
     */

    this.plugins = null;
  }
  /**
  * Returns a string representation for an actual parameter.
  * @param param The actual parameter.
  * @returns {String} The string representation of <code>param</code>.
  */


  _createClass(ApiClient, [{
    key: "paramToString",
    value: function paramToString(param) {
      if (param == undefined || param == null) {
        return '';
      }

      if (param instanceof Date) {
        return param.toJSON();
      }

      if (ApiClient.canBeJsonified(param)) {
        return JSON.stringify(param);
      }

      return param.toString();
    }
    /**
    * Returns a boolean indicating if the parameter could be JSON.stringified
    * @param param The actual parameter
    * @returns {Boolean} Flag indicating if <code>param</code> can be JSON.stringified
    */

  }, {
    key: "buildUrl",
    value:
    /**
     * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
     * NOTE: query parameters are not handled here.
     * @param {String} path The path to append to the base URL.
     * @param {Object} pathParams The parameter values to append.
     * @param {String} apiBasePath Base path defined in the path, operation level to override the default one
     * @returns {String} The encoded path with parameter values substituted.
     */
    function buildUrl(path, pathParams, apiBasePath) {
      var _this = this;

      if (!path.match(/^\//)) {
        path = '/' + path;
      }

      var url = this.basePath + path; // use API (operation, path) base path if defined

      if (apiBasePath !== null && apiBasePath !== undefined) {
        url = apiBasePath + path;
      }

      url = url.replace(/\{([\w-\.]+)\}/g, function (fullMatch, key) {
        var value;

        if (pathParams.hasOwnProperty(key)) {
          value = _this.paramToString(pathParams[key]);
        } else {
          value = fullMatch;
        }

        return encodeURIComponent(value);
      });
      return url;
    }
    /**
    * Checks whether the given content type represents JSON.<br>
    * JSON content type examples:<br>
    * <ul>
    * <li>application/json</li>
    * <li>application/json; charset=UTF8</li>
    * <li>APPLICATION/JSON</li>
    * </ul>
    * @param {String} contentType The MIME content type to check.
    * @returns {Boolean} <code>true</code> if <code>contentType</code> represents JSON, otherwise <code>false</code>.
    */

  }, {
    key: "isJsonMime",
    value: function isJsonMime(contentType) {
      return Boolean(contentType != null && contentType.match(/^application\/json(;.*)?$/i));
    }
    /**
    * Chooses a content type from the given array, with JSON preferred; i.e. return JSON if included, otherwise return the first.
    * @param {Array.<String>} contentTypes
    * @returns {String} The chosen content type, preferring JSON.
    */

  }, {
    key: "jsonPreferredMime",
    value: function jsonPreferredMime(contentTypes) {
      for (var i = 0; i < contentTypes.length; i++) {
        if (this.isJsonMime(contentTypes[i])) {
          return contentTypes[i];
        }
      }

      return contentTypes[0];
    }
    /**
    * Checks whether the given parameter value represents file-like content.
    * @param param The parameter to check.
    * @returns {Boolean} <code>true</code> if <code>param</code> represents a file.
    */

  }, {
    key: "isFileParam",
    value: function isFileParam(param) {
      // fs.ReadStream in Node.js and Electron (but not in runtime like browserify)
      if (typeof require === 'function') {
        var fs;

        try {
          fs = require('fs');
        } catch (err) {}

        if (fs && fs.ReadStream && param instanceof fs.ReadStream) {
          return true;
        }
      } // Buffer in Node.js


      if (typeof Buffer === 'function' && param instanceof Buffer) {
        return true;
      } // Blob in browser


      if (typeof Blob === 'function' && param instanceof Blob) {
        return true;
      } // File in browser (it seems File object is also instance of Blob, but keep this for safe)


      if (typeof File === 'function' && param instanceof File) {
        return true;
      }

      return false;
    }
    /**
    * Normalizes parameter values:
    * <ul>
    * <li>remove nils</li>
    * <li>keep files and arrays</li>
    * <li>format to string with `paramToString` for other cases</li>
    * </ul>
    * @param {Object.<String, Object>} params The parameters as object properties.
    * @returns {Object.<String, Object>} normalized parameters.
    */

  }, {
    key: "normalizeParams",
    value: function normalizeParams(params) {
      var newParams = {};

      for (var key in params) {
        if (params.hasOwnProperty(key) && params[key] != undefined && params[key] != null) {
          var value = params[key];

          if (this.isFileParam(value) || Array.isArray(value)) {
            newParams[key] = value;
          } else {
            newParams[key] = this.paramToString(value);
          }
        }
      }

      return newParams;
    }
    /**
    * Builds a string representation of an array-type actual parameter, according to the given collection format.
    * @param {Array} param An array parameter.
    * @param {module:ApiClient.CollectionFormatEnum} collectionFormat The array element separator strategy.
    * @returns {String|Array} A string representation of the supplied collection, using the specified delimiter. Returns
    * <code>param</code> as is if <code>collectionFormat</code> is <code>multi</code>.
    */

  }, {
    key: "buildCollectionParam",
    value: function buildCollectionParam(param, collectionFormat) {
      if (param == null) {
        return null;
      }

      switch (collectionFormat) {
        case 'csv':
          return param.map(this.paramToString, this).join(',');

        case 'ssv':
          return param.map(this.paramToString, this).join(' ');

        case 'tsv':
          return param.map(this.paramToString, this).join('\t');

        case 'pipes':
          return param.map(this.paramToString, this).join('|');

        case 'multi':
          //return the array directly as SuperAgent will handle it as expected
          return param.map(this.paramToString, this);

        case 'passthrough':
          return param;

        default:
          throw new Error('Unknown collection format: ' + collectionFormat);
      }
    }
    /**
    * Applies authentication headers to the request.
    * @param {Object} request The request object created by a <code>superagent()</code> call.
    * @param {Array.<String>} authNames An array of authentication method names.
    */

  }, {
    key: "applyAuthToRequest",
    value: function applyAuthToRequest(request, authNames) {
      var _this2 = this;

      authNames.forEach(function (authName) {
        var auth = _this2.authentications[authName];

        switch (auth.type) {
          case 'basic':
            if (auth.username || auth.password) {
              request.auth(auth.username || '', auth.password || '');
            }

            break;

          case 'bearer':
            if (auth.accessToken) {
              var localVarBearerToken = typeof auth.accessToken === 'function' ? auth.accessToken() : auth.accessToken;
              request.set({
                'Authorization': 'Bearer ' + localVarBearerToken
              });
            }

            break;

          case 'apiKey':
            if (auth.apiKey) {
              var data = {};

              if (auth.apiKeyPrefix) {
                data[auth.name] = auth.apiKeyPrefix + ' ' + auth.apiKey;
              } else {
                data[auth.name] = auth.apiKey;
              }

              if (auth['in'] === 'header') {
                request.set(data);
              } else {
                request.query(data);
              }
            }

            break;

          case 'oauth2':
            if (auth.accessToken) {
              request.set({
                'Authorization': 'Bearer ' + auth.accessToken
              });
            }

            break;

          default:
            throw new Error('Unknown authentication type: ' + auth.type);
        }
      });
    }
    /**
     * Deserializes an HTTP response body into a value of the specified type.
     * @param {Object} response A SuperAgent response object.
     * @param {(String|Array.<String>|Object.<String, Object>|Function)} returnType The type to return. Pass a string for simple types
     * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
     * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
     * all properties on <code>data<code> will be converted to this type.
     * @returns A value of the specified type.
     */

  }, {
    key: "deserialize",
    value: function deserialize(response, returnType) {
      if (response == null || returnType == null || response.status == 204) {
        return null;
      } // Rely on SuperAgent for parsing response body.
      // See http://visionmedia.github.io/superagent/#parsing-response-bodies


      var data = response.body;

      if (data == null || _typeof(data) === 'object' && typeof data.length === 'undefined' && !Object.keys(data).length) {
        // SuperAgent does not always produce a body; use the unparsed response as a fallback
        data = response.text;
      }

      return ApiClient.convertToType(data, returnType);
    }
    /**
     * Callback function to receive the result of the operation.
     * @callback module:ApiClient~callApiCallback
     * @param {String} error Error message, if any.
     * @param data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Invokes the REST service using the supplied settings and parameters.
     * @param {String} path The base URL to invoke.
     * @param {String} httpMethod The HTTP method to use.
     * @param {Object.<String, String>} pathParams A map of path parameters and their values.
     * @param {Object.<String, Object>} queryParams A map of query parameters and their values.
     * @param {Object.<String, Object>} headerParams A map of header parameters and their values.
     * @param {Object.<String, Object>} formParams A map of form parameters and their values.
     * @param {Object} bodyParam The value to pass as the request body.
     * @param {Array.<String>} authNames An array of authentication type names.
     * @param {Array.<String>} contentTypes An array of request MIME types.
     * @param {Array.<String>} accepts An array of acceptable response MIME types.
     * @param {(String|Array|ObjectFunction)} returnType The required type to return; can be a string for simple types or the
     * constructor for a complex type.
     * @param {String} apiBasePath base path defined in the operation/path level to override the default one
     * @param {module:ApiClient~callApiCallback} callback The callback function.
     * @returns {Object} The SuperAgent request object.
     */

  }, {
    key: "callApi",
    value: function callApi(path, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts, returnType, apiBasePath, callback) {
      var _this3 = this;

      var url = this.buildUrl(path, pathParams, apiBasePath);
      var request = (0, _superagent["default"])(httpMethod, url);

      if (this.plugins !== null) {
        for (var index in this.plugins) {
          if (this.plugins.hasOwnProperty(index)) {
            request.use(this.plugins[index]);
          }
        }
      } // apply authentications


      this.applyAuthToRequest(request, authNames); // set query parameters

      if (httpMethod.toUpperCase() === 'GET' && this.cache === false) {
        queryParams['_'] = new Date().getTime();
      }

      request.query(this.normalizeParams(queryParams)); // set header parameters

      request.set(this.defaultHeaders).set(this.normalizeParams(headerParams)); // set requestAgent if it is set by user

      if (this.requestAgent) {
        request.agent(this.requestAgent);
      } // set request timeout


      request.timeout(this.timeout);
      var contentType = this.jsonPreferredMime(contentTypes);

      if (contentType) {
        // Issue with superagent and multipart/form-data (https://github.com/visionmedia/superagent/issues/746)
        if (contentType != 'multipart/form-data') {
          request.type(contentType);
        }
      }

      if (contentType === 'application/x-www-form-urlencoded') {
        request.send(_querystring["default"].stringify(this.normalizeParams(formParams)));
      } else if (contentType == 'multipart/form-data') {
        var _formParams = this.normalizeParams(formParams);

        for (var key in _formParams) {
          if (_formParams.hasOwnProperty(key)) {
            var _formParamsValue = _formParams[key];

            if (this.isFileParam(_formParamsValue)) {
              // file field
              request.attach(key, _formParamsValue);
            } else if (Array.isArray(_formParamsValue) && _formParamsValue.length && this.isFileParam(_formParamsValue[0])) {
              // multiple files
              _formParamsValue.forEach(function (file) {
                return request.attach(key, file);
              });
            } else {
              request.field(key, _formParamsValue);
            }
          }
        }
      } else if (bodyParam !== null && bodyParam !== undefined) {
        if (!request.header['Content-Type']) {
          request.type('application/json');
        }

        request.send(bodyParam);
      }

      var accept = this.jsonPreferredMime(accepts);

      if (accept) {
        request.accept(accept);
      }

      if (returnType === 'Blob') {
        request.responseType('blob');
      } else if (returnType === 'String') {
        request.responseType('text');
      } // Attach previously saved cookies, if enabled


      if (this.enableCookies) {
        if (typeof window === 'undefined') {
          this.agent._attachCookies(request);
        } else {
          request.withCredentials();
        }
      }

      request.end(function (error, response) {
        if (callback) {
          var data = null;

          if (!error) {
            try {
              data = _this3.deserialize(response, returnType);

              if (_this3.enableCookies && typeof window === 'undefined') {
                _this3.agent._saveCookies(response);
              }
            } catch (err) {
              error = err;
            }
          }

          callback(error, data, response);
        }
      });
      return request;
    }
    /**
    * Parses an ISO-8601 string representation or epoch representation of a date value.
    * @param {String} str The date value as a string.
    * @returns {Date} The parsed date object.
    */

  }, {
    key: "hostSettings",
    value:
    /**
      * Gets an array of host settings
      * @returns An array of host settings
      */
    function hostSettings() {
      return [{
        'url': "https://space-tycoon.garage-trip.cz/api",
        'description': "No description provided"
      }];
    }
  }, {
    key: "getBasePathFromSettings",
    value: function getBasePathFromSettings(index) {
      var variables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var servers = this.hostSettings(); // check array index out of bound

      if (index < 0 || index >= servers.length) {
        throw new Error("Invalid index " + index + " when selecting the host settings. Must be less than " + servers.length);
      }

      var server = servers[index];
      var url = server['url']; // go through variable and assign a value

      for (var variable_name in server['variables']) {
        if (variable_name in variables) {
          var variable = server['variables'][variable_name];

          if (!('enum_values' in variable) || variable['enum_values'].includes(variables[variable_name])) {
            url = url.replace("{" + variable_name + "}", variables[variable_name]);
          } else {
            throw new Error("The variable `" + variable_name + "` in the host URL has invalid value " + variables[variable_name] + ". Must be " + server['variables'][variable_name]['enum_values'] + ".");
          }
        } else {
          // use default value
          url = url.replace("{" + variable_name + "}", server['variables'][variable_name]['default_value']);
        }
      }

      return url;
    }
    /**
    * Constructs a new map or array model from REST data.
    * @param data {Object|Array} The REST data.
    * @param obj {Object|Array} The target object or array.
    */

  }], [{
    key: "canBeJsonified",
    value: function canBeJsonified(str) {
      if (typeof str !== 'string' && _typeof(str) !== 'object') return false;

      try {
        var type = str.toString();
        return type === '[object Object]' || type === '[object Array]';
      } catch (err) {
        return false;
      }
    }
  }, {
    key: "parseDate",
    value: function parseDate(str) {
      if (isNaN(str)) {
        return new Date(str.replace(/(\d)(T)(\d)/i, '$1 $3'));
      }

      return new Date(+str);
    }
    /**
    * Converts a value to the specified type.
    * @param {(String|Object)} data The data to convert, as a string or object.
    * @param {(String|Array.<String>|Object.<String, Object>|Function)} type The type to return. Pass a string for simple types
    * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
    * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
    * all properties on <code>data<code> will be converted to this type.
    * @returns An instance of the specified type or null or undefined if data is null or undefined.
    */

  }, {
    key: "convertToType",
    value: function convertToType(data, type) {
      if (data === null || data === undefined) return data;

      switch (type) {
        case 'Boolean':
          return Boolean(data);

        case 'Integer':
          return parseInt(data, 10);

        case 'Number':
          return parseFloat(data);

        case 'String':
          return String(data);

        case 'Date':
          return ApiClient.parseDate(String(data));

        case 'Blob':
          return data;

        default:
          if (type === Object) {
            // generic object, return directly
            return data;
          } else if (typeof type.constructFromObject === 'function') {
            // for model type like User and enum class
            return type.constructFromObject(data);
          } else if (Array.isArray(type)) {
            // for array type like: ['String']
            var itemType = type[0];
            return data.map(function (item) {
              return ApiClient.convertToType(item, itemType);
            });
          } else if (_typeof(type) === 'object') {
            // for plain object type like: {'String': 'Integer'}
            var keyType, valueType;

            for (var k in type) {
              if (type.hasOwnProperty(k)) {
                keyType = k;
                valueType = type[k];
                break;
              }
            }

            var result = {};

            for (var k in data) {
              if (data.hasOwnProperty(k)) {
                var key = ApiClient.convertToType(k, keyType);
                var value = ApiClient.convertToType(data[k], valueType);
                result[key] = value;
              }
            }

            return result;
          } else {
            // for unknown type, return the data directly
            return data;
          }

      }
    }
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj, itemType) {
      if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          if (data.hasOwnProperty(i)) obj[i] = ApiClient.convertToType(data[i], itemType);
        }
      } else {
        for (var k in data) {
          if (data.hasOwnProperty(k)) obj[k] = ApiClient.convertToType(data[k], itemType);
        }
      }
    }
  }]);

  return ApiClient;
}();
/**
 * Enumeration of collection format separator strategies.
 * @enum {String}
 * @readonly
 */


ApiClient.CollectionFormatEnum = {
  /**
   * Comma-separated values. Value: <code>csv</code>
   * @const
   */
  CSV: ',',

  /**
   * Space-separated values. Value: <code>ssv</code>
   * @const
   */
  SSV: ' ',

  /**
   * Tab-separated values. Value: <code>tsv</code>
   * @const
   */
  TSV: '\t',

  /**
   * Pipe(|)-separated values. Value: <code>pipes</code>
   * @const
   */
  PIPES: '|',

  /**
   * Native array. Value: <code>multi</code>
   * @const
   */
  MULTI: 'multi'
};
/**
* The default API client implementation.
* @type {module:ApiClient}
*/

ApiClient.instance = new ApiClient();
var _default = ApiClient;
exports["default"] = _default;
}).call(this)}).call(this,require("buffer").Buffer)
},{"buffer":46,"fs":45,"querystring":51,"superagent":38}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Command = _interopRequireDefault(require("../model/Command"));

var _Credentials = _interopRequireDefault(require("../model/Credentials"));

var _CurrentTick = _interopRequireDefault(require("../model/CurrentTick"));

var _Data = _interopRequireDefault(require("../model/Data"));

var _EndTurn = _interopRequireDefault(require("../model/EndTurn"));

var _Error = _interopRequireDefault(require("../model/Error"));

var _PlayerId = _interopRequireDefault(require("../model/PlayerId"));

var _Reports = _interopRequireDefault(require("../model/Reports"));

var _StaticData = _interopRequireDefault(require("../model/StaticData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
* Game service.
* @module api/GameApi
* @version 1.0.0
*/
var GameApi = /*#__PURE__*/function () {
  /**
  * Constructs a new GameApi. 
  * @alias module:api/GameApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function GameApi(apiClient) {
    _classCallCheck(this, GameApi);

    this.apiClient = apiClient || _ApiClient["default"].instance;
  }
  /**
   * Callback function to receive the result of the commandsPost operation.
   * @callback module:api/GameApi~commandsPostCallback
   * @param {String} error Error message, if any.
   * @param data This operation does not return a value.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Specify commands for your ships
   * @param {Object.<String, module:model/{String: Command}>} requestBody 
   * @param {module:api/GameApi~commandsPostCallback} callback The callback function, accepting three arguments: error, data, response
   */


  _createClass(GameApi, [{
    key: "commandsPost",
    value: function commandsPost(requestBody, callback) {
      var postBody = requestBody; // verify the required parameter 'requestBody' is set

      if (requestBody === undefined || requestBody === null) {
        throw new _Error["default"]("Missing the required parameter 'requestBody' when calling commandsPost");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = ['cookieAuth'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;
      return this.apiClient.callApi('/commands', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the currentTickGet operation.
     * @callback module:api/GameApi~currentTickGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CurrentTick} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Returns the current tick, season and the approximate time until the next tick.
     * @param {module:api/GameApi~currentTickGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CurrentTick}
     */

  }, {
    key: "currentTickGet",
    value: function currentTickGet(callback) {
      var postBody = null;
      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = ['cookieAuth'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = _CurrentTick["default"];
      return this.apiClient.callApi('/current-tick', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the dataGet operation.
     * @callback module:api/GameApi~dataGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Data} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Dynamic game data (scores, prices, spaceship positions)
     * @param {Object} opts Optional parameters
     * @param {Number} opts.season 
     * @param {Number} opts.tick 
     * @param {module:api/GameApi~dataGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Data}
     */

  }, {
    key: "dataGet",
    value: function dataGet(opts, callback) {
      opts = opts || {};
      var postBody = null;
      var pathParams = {};
      var queryParams = {
        'season': opts['season'],
        'tick': opts['tick']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = ['cookieAuth'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = _Data["default"];
      return this.apiClient.callApi('/data', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the endTurnPost operation.
     * @callback module:api/GameApi~endTurnPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CurrentTick} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Signal that your turn is over for the current tick. Returns the current tick and the approximate time until the next tick.
     * @param {module:model/EndTurn} endTurn 
     * @param {module:api/GameApi~endTurnPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CurrentTick}
     */

  }, {
    key: "endTurnPost",
    value: function endTurnPost(endTurn, callback) {
      var postBody = endTurn; // verify the required parameter 'endTurn' is set

      if (endTurn === undefined || endTurn === null) {
        throw new _Error["default"]("Missing the required parameter 'endTurn' when calling endTurnPost");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = ['cookieAuth'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = _CurrentTick["default"];
      return this.apiClient.callApi('/end-turn', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the loginPost operation.
     * @callback module:api/GameApi~loginPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PlayerId} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get user session
     * @param {module:model/Credentials} credentials 
     * @param {module:api/GameApi~loginPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PlayerId}
     */

  }, {
    key: "loginPost",
    value: function loginPost(credentials, callback) {
      var postBody = credentials; // verify the required parameter 'credentials' is set

      if (credentials === undefined || credentials === null) {
        throw new _Error["default"]("Missing the required parameter 'credentials' when calling loginPost");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = ['cookieAuth'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = _PlayerId["default"];
      return this.apiClient.callApi('/login', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the logoutGet operation.
     * @callback module:api/GameApi~logoutGetCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/GameApi~logoutGetCallback} callback The callback function, accepting three arguments: error, data, response
     */

  }, {
    key: "logoutGet",
    value: function logoutGet(callback) {
      var postBody = null;
      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = ['cookieAuth'];
      var contentTypes = [];
      var accepts = [];
      var returnType = null;
      return this.apiClient.callApi('/logout', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the reportsGet operation.
     * @callback module:api/GameApi~reportsGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Reports} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Fetch statistical data about all players.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.season 
     * @param {Number} opts.tick 
     * @param {module:api/GameApi~reportsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Reports}
     */

  }, {
    key: "reportsGet",
    value: function reportsGet(opts, callback) {
      opts = opts || {};
      var postBody = null;
      var pathParams = {};
      var queryParams = {
        'season': opts['season'],
        'tick': opts['tick']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = ['cookieAuth'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = _Reports["default"];
      return this.apiClient.callApi('/reports', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the staticDataGet operation.
     * @callback module:api/GameApi~staticDataGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/StaticData} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Data that do not change during entire season, such as ships classes.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.season 
     * @param {module:api/GameApi~staticDataGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/StaticData}
     */

  }, {
    key: "staticDataGet",
    value: function staticDataGet(opts, callback) {
      opts = opts || {};
      var postBody = null;
      var pathParams = {};
      var queryParams = {
        'season': opts['season']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = ['cookieAuth'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = _StaticData["default"];
      return this.apiClient.callApi('/static-data', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);

  return GameApi;
}();

exports["default"] = GameApi;
},{"../ApiClient":1,"../model/Command":6,"../model/Credentials":8,"../model/CurrentTick":9,"../model/Data":10,"../model/EndTurn":14,"../model/Error":15,"../model/PlayerId":20,"../model/Reports":24,"../model/StaticData":29}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ApiClient", {
  enumerable: true,
  get: function get() {
    return _ApiClient["default"];
  }
});
Object.defineProperty(exports, "AttackCommand", {
  enumerable: true,
  get: function get() {
    return _AttackCommand["default"];
  }
});
Object.defineProperty(exports, "Combat", {
  enumerable: true,
  get: function get() {
    return _Combat["default"];
  }
});
Object.defineProperty(exports, "Command", {
  enumerable: true,
  get: function get() {
    return _Command["default"];
  }
});
Object.defineProperty(exports, "ConstructCommand", {
  enumerable: true,
  get: function get() {
    return _ConstructCommand["default"];
  }
});
Object.defineProperty(exports, "Credentials", {
  enumerable: true,
  get: function get() {
    return _Credentials["default"];
  }
});
Object.defineProperty(exports, "CurrentTick", {
  enumerable: true,
  get: function get() {
    return _CurrentTick["default"];
  }
});
Object.defineProperty(exports, "Data", {
  enumerable: true,
  get: function get() {
    return _Data["default"];
  }
});
Object.defineProperty(exports, "DataReports", {
  enumerable: true,
  get: function get() {
    return _DataReports["default"];
  }
});
Object.defineProperty(exports, "DecommissionCommand", {
  enumerable: true,
  get: function get() {
    return _DecommissionCommand["default"];
  }
});
Object.defineProperty(exports, "Destination", {
  enumerable: true,
  get: function get() {
    return _Destination["default"];
  }
});
Object.defineProperty(exports, "EndTurn", {
  enumerable: true,
  get: function get() {
    return _EndTurn["default"];
  }
});
Object.defineProperty(exports, "Error", {
  enumerable: true,
  get: function get() {
    return _Error["default"];
  }
});
Object.defineProperty(exports, "GameApi", {
  enumerable: true,
  get: function get() {
    return _GameApi["default"];
  }
});
Object.defineProperty(exports, "MoveCommand", {
  enumerable: true,
  get: function get() {
    return _MoveCommand["default"];
  }
});
Object.defineProperty(exports, "NetWorth", {
  enumerable: true,
  get: function get() {
    return _NetWorth["default"];
  }
});
Object.defineProperty(exports, "Planet", {
  enumerable: true,
  get: function get() {
    return _Planet["default"];
  }
});
Object.defineProperty(exports, "Player", {
  enumerable: true,
  get: function get() {
    return _Player["default"];
  }
});
Object.defineProperty(exports, "PlayerId", {
  enumerable: true,
  get: function get() {
    return _PlayerId["default"];
  }
});
Object.defineProperty(exports, "Profiling", {
  enumerable: true,
  get: function get() {
    return _Profiling["default"];
  }
});
Object.defineProperty(exports, "RenameCommand", {
  enumerable: true,
  get: function get() {
    return _RenameCommand["default"];
  }
});
Object.defineProperty(exports, "RepairCommand", {
  enumerable: true,
  get: function get() {
    return _RepairCommand["default"];
  }
});
Object.defineProperty(exports, "Reports", {
  enumerable: true,
  get: function get() {
    return _Reports["default"];
  }
});
Object.defineProperty(exports, "Resource", {
  enumerable: true,
  get: function get() {
    return _Resource["default"];
  }
});
Object.defineProperty(exports, "ScoreValue", {
  enumerable: true,
  get: function get() {
    return _ScoreValue["default"];
  }
});
Object.defineProperty(exports, "Ship", {
  enumerable: true,
  get: function get() {
    return _Ship["default"];
  }
});
Object.defineProperty(exports, "ShipClass", {
  enumerable: true,
  get: function get() {
    return _ShipClass["default"];
  }
});
Object.defineProperty(exports, "StaticData", {
  enumerable: true,
  get: function get() {
    return _StaticData["default"];
  }
});
Object.defineProperty(exports, "Trade", {
  enumerable: true,
  get: function get() {
    return _Trade["default"];
  }
});
Object.defineProperty(exports, "TradeCommand", {
  enumerable: true,
  get: function get() {
    return _TradeCommand["default"];
  }
});
Object.defineProperty(exports, "TradingResource", {
  enumerable: true,
  get: function get() {
    return _TradingResource["default"];
  }
});
Object.defineProperty(exports, "TradingResourceAllOf", {
  enumerable: true,
  get: function get() {
    return _TradingResourceAllOf["default"];
  }
});
Object.defineProperty(exports, "Wreck", {
  enumerable: true,
  get: function get() {
    return _Wreck["default"];
  }
});

var _ApiClient = _interopRequireDefault(require("./ApiClient"));

var _AttackCommand = _interopRequireDefault(require("./model/AttackCommand"));

var _Combat = _interopRequireDefault(require("./model/Combat"));

var _Command = _interopRequireDefault(require("./model/Command"));

var _ConstructCommand = _interopRequireDefault(require("./model/ConstructCommand"));

var _Credentials = _interopRequireDefault(require("./model/Credentials"));

var _CurrentTick = _interopRequireDefault(require("./model/CurrentTick"));

var _Data = _interopRequireDefault(require("./model/Data"));

var _DataReports = _interopRequireDefault(require("./model/DataReports"));

var _DecommissionCommand = _interopRequireDefault(require("./model/DecommissionCommand"));

var _Destination = _interopRequireDefault(require("./model/Destination"));

var _EndTurn = _interopRequireDefault(require("./model/EndTurn"));

var _Error = _interopRequireDefault(require("./model/Error"));

var _MoveCommand = _interopRequireDefault(require("./model/MoveCommand"));

var _NetWorth = _interopRequireDefault(require("./model/NetWorth"));

var _Planet = _interopRequireDefault(require("./model/Planet"));

var _Player = _interopRequireDefault(require("./model/Player"));

var _PlayerId = _interopRequireDefault(require("./model/PlayerId"));

var _Profiling = _interopRequireDefault(require("./model/Profiling"));

var _RenameCommand = _interopRequireDefault(require("./model/RenameCommand"));

var _RepairCommand = _interopRequireDefault(require("./model/RepairCommand"));

var _Reports = _interopRequireDefault(require("./model/Reports"));

var _Resource = _interopRequireDefault(require("./model/Resource"));

var _ScoreValue = _interopRequireDefault(require("./model/ScoreValue"));

var _Ship = _interopRequireDefault(require("./model/Ship"));

var _ShipClass = _interopRequireDefault(require("./model/ShipClass"));

var _StaticData = _interopRequireDefault(require("./model/StaticData"));

var _Trade = _interopRequireDefault(require("./model/Trade"));

var _TradeCommand = _interopRequireDefault(require("./model/TradeCommand"));

var _TradingResource = _interopRequireDefault(require("./model/TradingResource"));

var _TradingResourceAllOf = _interopRequireDefault(require("./model/TradingResourceAllOf"));

var _Wreck = _interopRequireDefault(require("./model/Wreck"));

var _GameApi = _interopRequireDefault(require("./api/GameApi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
},{"./ApiClient":1,"./api/GameApi":2,"./model/AttackCommand":4,"./model/Combat":5,"./model/Command":6,"./model/ConstructCommand":7,"./model/Credentials":8,"./model/CurrentTick":9,"./model/Data":10,"./model/DataReports":11,"./model/DecommissionCommand":12,"./model/Destination":13,"./model/EndTurn":14,"./model/Error":15,"./model/MoveCommand":16,"./model/NetWorth":17,"./model/Planet":18,"./model/Player":19,"./model/PlayerId":20,"./model/Profiling":21,"./model/RenameCommand":22,"./model/RepairCommand":23,"./model/Reports":24,"./model/Resource":25,"./model/ScoreValue":26,"./model/Ship":27,"./model/ShipClass":28,"./model/StaticData":29,"./model/Trade":30,"./model/TradeCommand":31,"./model/TradingResource":32,"./model/TradingResourceAllOf":33,"./model/Wreck":34}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The AttackCommand model module.
 * @module model/AttackCommand
 * @version 1.0.0
 */
var AttackCommand = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>AttackCommand</code>.
   * @alias module:model/AttackCommand
   * @param target {String} 
   */
  function AttackCommand(target) {
    _classCallCheck(this, AttackCommand);

    AttackCommand.initialize(this, target);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(AttackCommand, null, [{
    key: "initialize",
    value: function initialize(obj, target) {
      obj['target'] = target;
    }
    /**
     * Constructs a <code>AttackCommand</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/AttackCommand} obj Optional instance to populate.
     * @return {module:model/AttackCommand} The populated <code>AttackCommand</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new AttackCommand();

        if (data.hasOwnProperty('target')) {
          obj['target'] = _ApiClient["default"].convertToType(data['target'], 'String');
        }

        if (data.hasOwnProperty('type')) {
          obj['type'] = _ApiClient["default"].convertToType(data['type'], 'String');
        }
      }

      return obj;
    }
  }]);

  return AttackCommand;
}();
/**
 * @member {String} target
 */


AttackCommand.prototype['target'] = undefined;
/**
 * @member {String} type
 * @default 'attack'
 */

AttackCommand.prototype['type'] = 'attack';
var _default = AttackCommand;
exports["default"] = _default;
},{"../ApiClient":1}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The Combat model module.
 * @module model/Combat
 * @version 1.0.0
 */
var Combat = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Combat</code>.
   * @alias module:model/Combat
   */
  function Combat() {
    _classCallCheck(this, Combat);

    Combat.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Combat, null, [{
    key: "initialize",
    value: function initialize(obj) {}
    /**
     * Constructs a <code>Combat</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Combat} obj Optional instance to populate.
     * @return {module:model/Combat} The populated <code>Combat</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Combat();

        if (data.hasOwnProperty('tick')) {
          obj['tick'] = _ApiClient["default"].convertToType(data['tick'], 'Number');
        }

        if (data.hasOwnProperty('attacker')) {
          obj['attacker'] = _ApiClient["default"].convertToType(data['attacker'], 'String');
        }

        if (data.hasOwnProperty('defender')) {
          obj['defender'] = _ApiClient["default"].convertToType(data['defender'], 'String');
        }

        if (data.hasOwnProperty('killed')) {
          obj['killed'] = _ApiClient["default"].convertToType(data['killed'], 'Boolean');
        }
      }

      return obj;
    }
  }]);

  return Combat;
}();
/**
 * @member {Number} tick
 */


Combat.prototype['tick'] = undefined;
/**
 * @member {String} attacker
 */

Combat.prototype['attacker'] = undefined;
/**
 * @member {String} defender
 */

Combat.prototype['defender'] = undefined;
/**
 * @member {Boolean} killed
 */

Combat.prototype['killed'] = undefined;
var _default = Combat;
exports["default"] = _default;
},{"../ApiClient":1}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Destination = _interopRequireDefault(require("./Destination"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The Command model module.
 * @module model/Command
 * @version 1.0.0
 */
var Command = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Command</code>.
   * @alias module:model/Command
   * @param type {String} 
   */
  function Command(type) {
    _classCallCheck(this, Command);

    Command.initialize(this, type);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Command, null, [{
    key: "initialize",
    value: function initialize(obj, type) {
      obj['type'] = type;
    }
    /**
     * Constructs a <code>Command</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Command} obj Optional instance to populate.
     * @return {module:model/Command} The populated <code>Command</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Command();

        if (data.hasOwnProperty('type')) {
          obj['type'] = _ApiClient["default"].convertToType(data['type'], 'String');
        }

        if (data.hasOwnProperty('target')) {
          obj['target'] = _ApiClient["default"].convertToType(data['target'], 'String');
        }

        if (data.hasOwnProperty('destination')) {
          obj['destination'] = _Destination["default"].constructFromObject(data['destination']);
        }

        if (data.hasOwnProperty('resource')) {
          obj['resource'] = _ApiClient["default"].convertToType(data['resource'], 'String');
        }

        if (data.hasOwnProperty('amount')) {
          obj['amount'] = _ApiClient["default"].convertToType(data['amount'], 'Number');
        }

        if (data.hasOwnProperty('shipClass')) {
          obj['shipClass'] = _ApiClient["default"].convertToType(data['shipClass'], 'String');
        }

        if (data.hasOwnProperty('name')) {
          obj['name'] = _ApiClient["default"].convertToType(data['name'], 'String');
        }
      }

      return obj;
    }
  }]);

  return Command;
}();
/**
 * @member {String} type
 */


Command.prototype['type'] = undefined;
/**
 * @member {String} target
 */

Command.prototype['target'] = undefined;
/**
 * @member {module:model/Destination} destination
 */

Command.prototype['destination'] = undefined;
/**
 * @member {String} resource
 */

Command.prototype['resource'] = undefined;
/**
 * @member {Number} amount
 */

Command.prototype['amount'] = undefined;
/**
 * @member {String} shipClass
 */

Command.prototype['shipClass'] = undefined;
/**
 * @member {String} name
 */

Command.prototype['name'] = undefined;
var _default = Command;
exports["default"] = _default;
},{"../ApiClient":1,"./Destination":13}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The ConstructCommand model module.
 * @module model/ConstructCommand
 * @version 1.0.0
 */
var ConstructCommand = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>ConstructCommand</code>.
   * @alias module:model/ConstructCommand
   * @param shipClass {String} 
   */
  function ConstructCommand(shipClass) {
    _classCallCheck(this, ConstructCommand);

    ConstructCommand.initialize(this, shipClass);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(ConstructCommand, null, [{
    key: "initialize",
    value: function initialize(obj, shipClass) {
      obj['shipClass'] = shipClass;
    }
    /**
     * Constructs a <code>ConstructCommand</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ConstructCommand} obj Optional instance to populate.
     * @return {module:model/ConstructCommand} The populated <code>ConstructCommand</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ConstructCommand();

        if (data.hasOwnProperty('shipClass')) {
          obj['shipClass'] = _ApiClient["default"].convertToType(data['shipClass'], 'String');
        }

        if (data.hasOwnProperty('type')) {
          obj['type'] = _ApiClient["default"].convertToType(data['type'], 'String');
        }
      }

      return obj;
    }
  }]);

  return ConstructCommand;
}();
/**
 * @member {String} shipClass
 */


ConstructCommand.prototype['shipClass'] = undefined;
/**
 * @member {String} type
 * @default 'construct'
 */

ConstructCommand.prototype['type'] = 'construct';
var _default = ConstructCommand;
exports["default"] = _default;
},{"../ApiClient":1}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The Credentials model module.
 * @module model/Credentials
 * @version 1.0.0
 */
var Credentials = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Credentials</code>.
   * @alias module:model/Credentials
   * @param username {String} 
   * @param password {String} 
   */
  function Credentials(username, password) {
    _classCallCheck(this, Credentials);

    Credentials.initialize(this, username, password);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Credentials, null, [{
    key: "initialize",
    value: function initialize(obj, username, password) {
      obj['username'] = username;
      obj['password'] = password;
    }
    /**
     * Constructs a <code>Credentials</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Credentials} obj Optional instance to populate.
     * @return {module:model/Credentials} The populated <code>Credentials</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Credentials();

        if (data.hasOwnProperty('username')) {
          obj['username'] = _ApiClient["default"].convertToType(data['username'], 'String');
        }

        if (data.hasOwnProperty('password')) {
          obj['password'] = _ApiClient["default"].convertToType(data['password'], 'String');
        }
      }

      return obj;
    }
  }]);

  return Credentials;
}();
/**
 * @member {String} username
 */


Credentials.prototype['username'] = undefined;
/**
 * @member {String} password
 */

Credentials.prototype['password'] = undefined;
var _default = Credentials;
exports["default"] = _default;
},{"../ApiClient":1}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The CurrentTick model module.
 * @module model/CurrentTick
 * @version 1.0.0
 */
var CurrentTick = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>CurrentTick</code>.
   * @alias module:model/CurrentTick
   * @param tick {Number} 
   * @param minTimeLeftMs {Number} 
   * @param season {Number} 
   */
  function CurrentTick(tick, minTimeLeftMs, season) {
    _classCallCheck(this, CurrentTick);

    CurrentTick.initialize(this, tick, minTimeLeftMs, season);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(CurrentTick, null, [{
    key: "initialize",
    value: function initialize(obj, tick, minTimeLeftMs, season) {
      obj['tick'] = tick;
      obj['minTimeLeftMs'] = minTimeLeftMs;
      obj['season'] = season;
    }
    /**
     * Constructs a <code>CurrentTick</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/CurrentTick} obj Optional instance to populate.
     * @return {module:model/CurrentTick} The populated <code>CurrentTick</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new CurrentTick();

        if (data.hasOwnProperty('tick')) {
          obj['tick'] = _ApiClient["default"].convertToType(data['tick'], 'Number');
        }

        if (data.hasOwnProperty('minTimeLeftMs')) {
          obj['minTimeLeftMs'] = _ApiClient["default"].convertToType(data['minTimeLeftMs'], 'Number');
        }

        if (data.hasOwnProperty('season')) {
          obj['season'] = _ApiClient["default"].convertToType(data['season'], 'Number');
        }
      }

      return obj;
    }
  }]);

  return CurrentTick;
}();
/**
 * @member {Number} tick
 */


CurrentTick.prototype['tick'] = undefined;
/**
 * @member {Number} minTimeLeftMs
 */

CurrentTick.prototype['minTimeLeftMs'] = undefined;
/**
 * @member {Number} season
 */

CurrentTick.prototype['season'] = undefined;
var _default = CurrentTick;
exports["default"] = _default;
},{"../ApiClient":1}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _CurrentTick = _interopRequireDefault(require("./CurrentTick"));

var _DataReports = _interopRequireDefault(require("./DataReports"));

var _Planet = _interopRequireDefault(require("./Planet"));

var _Player = _interopRequireDefault(require("./Player"));

var _Ship = _interopRequireDefault(require("./Ship"));

var _Wreck = _interopRequireDefault(require("./Wreck"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The Data model module.
 * @module model/Data
 * @version 1.0.0
 */
var Data = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Data</code>.
   * @alias module:model/Data
   * @param currentTick {module:model/CurrentTick} 
   * @param planets {Object.<String, module:model/Planet>} 
   * @param players {Object.<String, module:model/Player>} 
   * @param ships {Object.<String, module:model/Ship>} 
   */
  function Data(currentTick, planets, players, ships) {
    _classCallCheck(this, Data);

    Data.initialize(this, currentTick, planets, players, ships);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Data, null, [{
    key: "initialize",
    value: function initialize(obj, currentTick, planets, players, ships) {
      obj['currentTick'] = currentTick;
      obj['planets'] = planets;
      obj['players'] = players;
      obj['ships'] = ships;
    }
    /**
     * Constructs a <code>Data</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Data} obj Optional instance to populate.
     * @return {module:model/Data} The populated <code>Data</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Data();

        if (data.hasOwnProperty('currentTick')) {
          obj['currentTick'] = _CurrentTick["default"].constructFromObject(data['currentTick']);
        }

        if (data.hasOwnProperty('planets')) {
          obj['planets'] = _ApiClient["default"].convertToType(data['planets'], {
            'String': _Planet["default"]
          });
        }

        if (data.hasOwnProperty('playerId')) {
          obj['playerId'] = _ApiClient["default"].convertToType(data['playerId'], 'String');
        }

        if (data.hasOwnProperty('players')) {
          obj['players'] = _ApiClient["default"].convertToType(data['players'], {
            'String': _Player["default"]
          });
        }

        if (data.hasOwnProperty('ships')) {
          obj['ships'] = _ApiClient["default"].convertToType(data['ships'], {
            'String': _Ship["default"]
          });
        }

        if (data.hasOwnProperty('wrecks')) {
          obj['wrecks'] = _ApiClient["default"].convertToType(data['wrecks'], {
            'String': _Wreck["default"]
          });
        }

        if (data.hasOwnProperty('reports')) {
          obj['reports'] = _DataReports["default"].constructFromObject(data['reports']);
        }
      }

      return obj;
    }
  }]);

  return Data;
}();
/**
 * @member {module:model/CurrentTick} currentTick
 */


Data.prototype['currentTick'] = undefined;
/**
 * @member {Object.<String, module:model/Planet>} planets
 */

Data.prototype['planets'] = undefined;
/**
 * @member {String} playerId
 */

Data.prototype['playerId'] = undefined;
/**
 * @member {Object.<String, module:model/Player>} players
 */

Data.prototype['players'] = undefined;
/**
 * @member {Object.<String, module:model/Ship>} ships
 */

Data.prototype['ships'] = undefined;
/**
 * @member {Object.<String, module:model/Wreck>} wrecks
 */

Data.prototype['wrecks'] = undefined;
/**
 * @member {module:model/DataReports} reports
 */

Data.prototype['reports'] = undefined;
var _default = Data;
exports["default"] = _default;
},{"../ApiClient":1,"./CurrentTick":9,"./DataReports":11,"./Planet":18,"./Player":19,"./Ship":27,"./Wreck":34}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Combat = _interopRequireDefault(require("./Combat"));

var _Trade = _interopRequireDefault(require("./Trade"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The DataReports model module.
 * @module model/DataReports
 * @version 1.0.0
 */
var DataReports = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>DataReports</code>.
   * @alias module:model/DataReports
   */
  function DataReports() {
    _classCallCheck(this, DataReports);

    DataReports.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(DataReports, null, [{
    key: "initialize",
    value: function initialize(obj) {}
    /**
     * Constructs a <code>DataReports</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/DataReports} obj Optional instance to populate.
     * @return {module:model/DataReports} The populated <code>DataReports</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new DataReports();

        if (data.hasOwnProperty('combat')) {
          obj['combat'] = _ApiClient["default"].convertToType(data['combat'], [_Combat["default"]]);
        }

        if (data.hasOwnProperty('trade')) {
          obj['trade'] = _ApiClient["default"].convertToType(data['trade'], [_Trade["default"]]);
        }
      }

      return obj;
    }
  }]);

  return DataReports;
}();
/**
 * @member {Array.<module:model/Combat>} combat
 */


DataReports.prototype['combat'] = undefined;
/**
 * @member {Array.<module:model/Trade>} trade
 */

DataReports.prototype['trade'] = undefined;
var _default = DataReports;
exports["default"] = _default;
},{"../ApiClient":1,"./Combat":5,"./Trade":30}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The DecommissionCommand model module.
 * @module model/DecommissionCommand
 * @version 1.0.0
 */
var DecommissionCommand = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>DecommissionCommand</code>.
   * @alias module:model/DecommissionCommand
   */
  function DecommissionCommand() {
    _classCallCheck(this, DecommissionCommand);

    DecommissionCommand.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(DecommissionCommand, null, [{
    key: "initialize",
    value: function initialize(obj) {}
    /**
     * Constructs a <code>DecommissionCommand</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/DecommissionCommand} obj Optional instance to populate.
     * @return {module:model/DecommissionCommand} The populated <code>DecommissionCommand</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new DecommissionCommand();

        if (data.hasOwnProperty('type')) {
          obj['type'] = _ApiClient["default"].convertToType(data['type'], 'String');
        }
      }

      return obj;
    }
  }]);

  return DecommissionCommand;
}();
/**
 * @member {String} type
 * @default 'decommission'
 */


DecommissionCommand.prototype['type'] = 'decommission';
var _default = DecommissionCommand;
exports["default"] = _default;
},{"../ApiClient":1}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The Destination model module.
 * @module model/Destination
 * @version 1.0.0
 */
var Destination = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Destination</code>.
   * @alias module:model/Destination
   */
  function Destination() {
    _classCallCheck(this, Destination);

    Destination.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Destination, null, [{
    key: "initialize",
    value: function initialize(obj) {}
    /**
     * Constructs a <code>Destination</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Destination} obj Optional instance to populate.
     * @return {module:model/Destination} The populated <code>Destination</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Destination();

        if (data.hasOwnProperty('coordinates')) {
          obj['coordinates'] = _ApiClient["default"].convertToType(data['coordinates'], ['Number']);
        }

        if (data.hasOwnProperty('target')) {
          obj['target'] = _ApiClient["default"].convertToType(data['target'], 'String');
        }
      }

      return obj;
    }
  }]);

  return Destination;
}();
/**
 * @member {Array.<Number>} coordinates
 */


Destination.prototype['coordinates'] = undefined;
/**
 * @member {String} target
 */

Destination.prototype['target'] = undefined;
var _default = Destination;
exports["default"] = _default;
},{"../ApiClient":1}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The EndTurn model module.
 * @module model/EndTurn
 * @version 1.0.0
 */
var EndTurn = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>EndTurn</code>.
   * @alias module:model/EndTurn
   * @param tick {Number} 
   * @param season {Number} 
   */
  function EndTurn(tick, season) {
    _classCallCheck(this, EndTurn);

    EndTurn.initialize(this, tick, season);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(EndTurn, null, [{
    key: "initialize",
    value: function initialize(obj, tick, season) {
      obj['tick'] = tick;
      obj['season'] = season;
    }
    /**
     * Constructs a <code>EndTurn</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/EndTurn} obj Optional instance to populate.
     * @return {module:model/EndTurn} The populated <code>EndTurn</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new EndTurn();

        if (data.hasOwnProperty('tick')) {
          obj['tick'] = _ApiClient["default"].convertToType(data['tick'], 'Number');
        }

        if (data.hasOwnProperty('season')) {
          obj['season'] = _ApiClient["default"].convertToType(data['season'], 'Number');
        }
      }

      return obj;
    }
  }]);

  return EndTurn;
}();
/**
 * @member {Number} tick
 */


EndTurn.prototype['tick'] = undefined;
/**
 * @member {Number} season
 */

EndTurn.prototype['season'] = undefined;
var _default = EndTurn;
exports["default"] = _default;
},{"../ApiClient":1}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The Error model module.
 * @module model/Error
 * @version 1.0.0
 */
var Error = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Error</code>.
   * @alias module:model/Error
   * @param message {String} 
   */
  function Error(message) {
    _classCallCheck(this, Error);

    Error.initialize(this, message);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Error, null, [{
    key: "initialize",
    value: function initialize(obj, message) {
      obj['message'] = message;
    }
    /**
     * Constructs a <code>Error</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Error} obj Optional instance to populate.
     * @return {module:model/Error} The populated <code>Error</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Error();

        if (data.hasOwnProperty('message')) {
          obj['message'] = _ApiClient["default"].convertToType(data['message'], 'String');
        }
      }

      return obj;
    }
  }]);

  return Error;
}();
/**
 * @member {String} message
 */


Error.prototype['message'] = undefined;
var _default = Error;
exports["default"] = _default;
},{"../ApiClient":1}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Destination = _interopRequireDefault(require("./Destination"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The MoveCommand model module.
 * @module model/MoveCommand
 * @version 1.0.0
 */
var MoveCommand = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>MoveCommand</code>.
   * @alias module:model/MoveCommand
   * @param destination {module:model/Destination} 
   */
  function MoveCommand(destination) {
    _classCallCheck(this, MoveCommand);

    MoveCommand.initialize(this, destination);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(MoveCommand, null, [{
    key: "initialize",
    value: function initialize(obj, destination) {
      obj['destination'] = destination;
    }
    /**
     * Constructs a <code>MoveCommand</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/MoveCommand} obj Optional instance to populate.
     * @return {module:model/MoveCommand} The populated <code>MoveCommand</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new MoveCommand();

        if (data.hasOwnProperty('destination')) {
          obj['destination'] = _Destination["default"].constructFromObject(data['destination']);
        }

        if (data.hasOwnProperty('type')) {
          obj['type'] = _ApiClient["default"].convertToType(data['type'], 'String');
        }
      }

      return obj;
    }
  }]);

  return MoveCommand;
}();
/**
 * @member {module:model/Destination} destination
 */


MoveCommand.prototype['destination'] = undefined;
/**
 * @member {String} type
 * @default 'move'
 */

MoveCommand.prototype['type'] = 'move';
var _default = MoveCommand;
exports["default"] = _default;
},{"../ApiClient":1,"./Destination":13}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The NetWorth model module.
 * @module model/NetWorth
 * @version 1.0.0
 */
var NetWorth = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>NetWorth</code>.
   * @alias module:model/NetWorth
   * @param money {Number} 
   * @param resources {Number} 
   * @param ships {Number} 
   * @param total {Number} 
   */
  function NetWorth(money, resources, ships, total) {
    _classCallCheck(this, NetWorth);

    NetWorth.initialize(this, money, resources, ships, total);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(NetWorth, null, [{
    key: "initialize",
    value: function initialize(obj, money, resources, ships, total) {
      obj['money'] = money;
      obj['resources'] = resources;
      obj['ships'] = ships;
      obj['total'] = total;
    }
    /**
     * Constructs a <code>NetWorth</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/NetWorth} obj Optional instance to populate.
     * @return {module:model/NetWorth} The populated <code>NetWorth</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new NetWorth();

        if (data.hasOwnProperty('money')) {
          obj['money'] = _ApiClient["default"].convertToType(data['money'], 'Number');
        }

        if (data.hasOwnProperty('resources')) {
          obj['resources'] = _ApiClient["default"].convertToType(data['resources'], 'Number');
        }

        if (data.hasOwnProperty('ships')) {
          obj['ships'] = _ApiClient["default"].convertToType(data['ships'], 'Number');
        }

        if (data.hasOwnProperty('total')) {
          obj['total'] = _ApiClient["default"].convertToType(data['total'], 'Number');
        }
      }

      return obj;
    }
  }]);

  return NetWorth;
}();
/**
 * @member {Number} money
 */


NetWorth.prototype['money'] = undefined;
/**
 * @member {Number} resources
 */

NetWorth.prototype['resources'] = undefined;
/**
 * @member {Number} ships
 */

NetWorth.prototype['ships'] = undefined;
/**
 * @member {Number} total
 */

NetWorth.prototype['total'] = undefined;
var _default = NetWorth;
exports["default"] = _default;
},{"../ApiClient":1}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _TradingResource = _interopRequireDefault(require("./TradingResource"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The Planet model module.
 * @module model/Planet
 * @version 1.0.0
 */
var Planet = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Planet</code>.
   * @alias module:model/Planet
   * @param name {String} 
   * @param resources {Object.<String, module:model/TradingResource>} 
   * @param position {Array.<Number>} 
   * @param prevPosition {Array.<Number>} 
   */
  function Planet(name, resources, position, prevPosition) {
    _classCallCheck(this, Planet);

    Planet.initialize(this, name, resources, position, prevPosition);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Planet, null, [{
    key: "initialize",
    value: function initialize(obj, name, resources, position, prevPosition) {
      obj['name'] = name;
      obj['resources'] = resources;
      obj['position'] = position;
      obj['prevPosition'] = prevPosition;
    }
    /**
     * Constructs a <code>Planet</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Planet} obj Optional instance to populate.
     * @return {module:model/Planet} The populated <code>Planet</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Planet();

        if (data.hasOwnProperty('name')) {
          obj['name'] = _ApiClient["default"].convertToType(data['name'], 'String');
        }

        if (data.hasOwnProperty('resources')) {
          obj['resources'] = _ApiClient["default"].convertToType(data['resources'], {
            'String': _TradingResource["default"]
          });
        }

        if (data.hasOwnProperty('position')) {
          obj['position'] = _ApiClient["default"].convertToType(data['position'], ['Number']);
        }

        if (data.hasOwnProperty('prevPosition')) {
          obj['prevPosition'] = _ApiClient["default"].convertToType(data['prevPosition'], ['Number']);
        }
      }

      return obj;
    }
  }]);

  return Planet;
}();
/**
 * @member {String} name
 */


Planet.prototype['name'] = undefined;
/**
 * @member {Object.<String, module:model/TradingResource>} resources
 */

Planet.prototype['resources'] = undefined;
/**
 * @member {Array.<Number>} position
 */

Planet.prototype['position'] = undefined;
/**
 * @member {Array.<Number>} prevPosition
 */

Planet.prototype['prevPosition'] = undefined;
var _default = Planet;
exports["default"] = _default;
},{"../ApiClient":1,"./TradingResource":32}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _NetWorth = _interopRequireDefault(require("./NetWorth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The Player model module.
 * @module model/Player
 * @version 1.0.0
 */
var Player = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Player</code>.
   * @alias module:model/Player
   * @param name {String} 
   * @param color {Array.<Number>} 
   * @param netWorth {module:model/NetWorth} 
   */
  function Player(name, color, netWorth) {
    _classCallCheck(this, Player);

    Player.initialize(this, name, color, netWorth);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Player, null, [{
    key: "initialize",
    value: function initialize(obj, name, color, netWorth) {
      obj['name'] = name;
      obj['color'] = color;
      obj['netWorth'] = netWorth;
    }
    /**
     * Constructs a <code>Player</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Player} obj Optional instance to populate.
     * @return {module:model/Player} The populated <code>Player</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Player();

        if (data.hasOwnProperty('name')) {
          obj['name'] = _ApiClient["default"].convertToType(data['name'], 'String');
        }

        if (data.hasOwnProperty('color')) {
          obj['color'] = _ApiClient["default"].convertToType(data['color'], ['Number']);
        }

        if (data.hasOwnProperty('netWorth')) {
          obj['netWorth'] = _NetWorth["default"].constructFromObject(data['netWorth']);
        }
      }

      return obj;
    }
  }]);

  return Player;
}();
/**
 * @member {String} name
 */


Player.prototype['name'] = undefined;
/**
 * @member {Array.<Number>} color
 */

Player.prototype['color'] = undefined;
/**
 * @member {module:model/NetWorth} netWorth
 */

Player.prototype['netWorth'] = undefined;
var _default = Player;
exports["default"] = _default;
},{"../ApiClient":1,"./NetWorth":17}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The PlayerId model module.
 * @module model/PlayerId
 * @version 1.0.0
 */
var PlayerId = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>PlayerId</code>.
   * @alias module:model/PlayerId
   */
  function PlayerId() {
    _classCallCheck(this, PlayerId);

    PlayerId.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(PlayerId, null, [{
    key: "initialize",
    value: function initialize(obj) {}
    /**
     * Constructs a <code>PlayerId</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/PlayerId} obj Optional instance to populate.
     * @return {module:model/PlayerId} The populated <code>PlayerId</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new PlayerId();

        if (data.hasOwnProperty('id')) {
          obj['id'] = _ApiClient["default"].convertToType(data['id'], 'String');
        }
      }

      return obj;
    }
  }]);

  return PlayerId;
}();
/**
 * @member {String} id
 */


PlayerId.prototype['id'] = undefined;
var _default = PlayerId;
exports["default"] = _default;
},{"../ApiClient":1}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The Profiling model module.
 * @module model/Profiling
 * @version 1.0.0
 */
var Profiling = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Profiling</code>.
   * @alias module:model/Profiling
   */
  function Profiling() {
    _classCallCheck(this, Profiling);

    Profiling.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Profiling, null, [{
    key: "initialize",
    value: function initialize(obj) {}
    /**
     * Constructs a <code>Profiling</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Profiling} obj Optional instance to populate.
     * @return {module:model/Profiling} The populated <code>Profiling</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Profiling();

        if (data.hasOwnProperty('tick')) {
          obj['tick'] = _ApiClient["default"].convertToType(data['tick'], 'Number');
        }

        if (data.hasOwnProperty('movement')) {
          obj['movement'] = _ApiClient["default"].convertToType(data['movement'], 'Number');
        }

        if (data.hasOwnProperty('attacks')) {
          obj['attacks'] = _ApiClient["default"].convertToType(data['attacks'], 'Number');
        }

        if (data.hasOwnProperty('trades')) {
          obj['trades'] = _ApiClient["default"].convertToType(data['trades'], 'Number');
        }

        if (data.hasOwnProperty('recipes')) {
          obj['recipes'] = _ApiClient["default"].convertToType(data['recipes'], 'Number');
        }

        if (data.hasOwnProperty('prices')) {
          obj['prices'] = _ApiClient["default"].convertToType(data['prices'], 'Number');
        }

        if (data.hasOwnProperty('constructions')) {
          obj['constructions'] = _ApiClient["default"].convertToType(data['constructions'], 'Number');
        }

        if (data.hasOwnProperty('report')) {
          obj['report'] = _ApiClient["default"].convertToType(data['report'], 'Number');
        }

        if (data.hasOwnProperty('total')) {
          obj['total'] = _ApiClient["default"].convertToType(data['total'], 'Number');
        }

        if (data.hasOwnProperty('overall')) {
          obj['overall'] = _ApiClient["default"].convertToType(data['overall'], 'Number');
        }

        if (data.hasOwnProperty('at')) {
          obj['at'] = _ApiClient["default"].convertToType(data['at'], 'Number');
        }
      }

      return obj;
    }
  }]);

  return Profiling;
}();
/**
 * @member {Number} tick
 */


Profiling.prototype['tick'] = undefined;
/**
 * @member {Number} movement
 */

Profiling.prototype['movement'] = undefined;
/**
 * @member {Number} attacks
 */

Profiling.prototype['attacks'] = undefined;
/**
 * @member {Number} trades
 */

Profiling.prototype['trades'] = undefined;
/**
 * @member {Number} recipes
 */

Profiling.prototype['recipes'] = undefined;
/**
 * @member {Number} prices
 */

Profiling.prototype['prices'] = undefined;
/**
 * @member {Number} constructions
 */

Profiling.prototype['constructions'] = undefined;
/**
 * @member {Number} report
 */

Profiling.prototype['report'] = undefined;
/**
 * @member {Number} total
 */

Profiling.prototype['total'] = undefined;
/**
 * @member {Number} overall
 */

Profiling.prototype['overall'] = undefined;
/**
 * @member {Number} at
 */

Profiling.prototype['at'] = undefined;
var _default = Profiling;
exports["default"] = _default;
},{"../ApiClient":1}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The RenameCommand model module.
 * @module model/RenameCommand
 * @version 1.0.0
 */
var RenameCommand = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>RenameCommand</code>.
   * @alias module:model/RenameCommand
   * @param name {String} 
   */
  function RenameCommand(name) {
    _classCallCheck(this, RenameCommand);

    RenameCommand.initialize(this, name);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(RenameCommand, null, [{
    key: "initialize",
    value: function initialize(obj, name) {
      obj['name'] = name;
    }
    /**
     * Constructs a <code>RenameCommand</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/RenameCommand} obj Optional instance to populate.
     * @return {module:model/RenameCommand} The populated <code>RenameCommand</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new RenameCommand();

        if (data.hasOwnProperty('name')) {
          obj['name'] = _ApiClient["default"].convertToType(data['name'], 'String');
        }

        if (data.hasOwnProperty('type')) {
          obj['type'] = _ApiClient["default"].convertToType(data['type'], 'String');
        }
      }

      return obj;
    }
  }]);

  return RenameCommand;
}();
/**
 * @member {String} name
 */


RenameCommand.prototype['name'] = undefined;
/**
 * @member {String} type
 * @default 'rename'
 */

RenameCommand.prototype['type'] = 'rename';
var _default = RenameCommand;
exports["default"] = _default;
},{"../ApiClient":1}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The RepairCommand model module.
 * @module model/RepairCommand
 * @version 1.0.0
 */
var RepairCommand = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>RepairCommand</code>.
   * @alias module:model/RepairCommand
   */
  function RepairCommand() {
    _classCallCheck(this, RepairCommand);

    RepairCommand.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(RepairCommand, null, [{
    key: "initialize",
    value: function initialize(obj) {}
    /**
     * Constructs a <code>RepairCommand</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/RepairCommand} obj Optional instance to populate.
     * @return {module:model/RepairCommand} The populated <code>RepairCommand</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new RepairCommand();

        if (data.hasOwnProperty('type')) {
          obj['type'] = _ApiClient["default"].convertToType(data['type'], 'String');
        }
      }

      return obj;
    }
  }]);

  return RepairCommand;
}();
/**
 * @member {String} type
 * @default 'repair'
 */


RepairCommand.prototype['type'] = 'repair';
var _default = RepairCommand;
exports["default"] = _default;
},{"../ApiClient":1}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Combat = _interopRequireDefault(require("./Combat"));

var _Profiling = _interopRequireDefault(require("./Profiling"));

var _ScoreValue = _interopRequireDefault(require("./ScoreValue"));

var _Trade = _interopRequireDefault(require("./Trade"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The Reports model module.
 * @module model/Reports
 * @version 1.0.0
 */
var Reports = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Reports</code>.
   * @alias module:model/Reports
   * @param combat {Array.<module:model/Combat>} 
   * @param trade {Array.<module:model/Trade>} 
   * @param profiling {Array.<module:model/Profiling>} Profiling information about the game. Used by the visualization website.
   * @param prices {Object.<String, Object.<String, Number>>} Prices are average across all planets.
   * @param resourceAmounts {Object.<String, Object.<String, Number>>} 
   * @param scores {Object.<String, module:model/ScoreValue>} 
   * @param season {Number} requested / last season
   * @param tick {Number} requested / last tick in the season
   */
  function Reports(combat, trade, profiling, prices, resourceAmounts, scores, season, tick) {
    _classCallCheck(this, Reports);

    Reports.initialize(this, combat, trade, profiling, prices, resourceAmounts, scores, season, tick);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Reports, null, [{
    key: "initialize",
    value: function initialize(obj, combat, trade, profiling, prices, resourceAmounts, scores, season, tick) {
      obj['combat'] = combat;
      obj['trade'] = trade;
      obj['profiling'] = profiling;
      obj['prices'] = prices;
      obj['resourceAmounts'] = resourceAmounts;
      obj['scores'] = scores;
      obj['season'] = season;
      obj['tick'] = tick;
    }
    /**
     * Constructs a <code>Reports</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Reports} obj Optional instance to populate.
     * @return {module:model/Reports} The populated <code>Reports</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Reports();

        if (data.hasOwnProperty('combat')) {
          obj['combat'] = _ApiClient["default"].convertToType(data['combat'], [_Combat["default"]]);
        }

        if (data.hasOwnProperty('trade')) {
          obj['trade'] = _ApiClient["default"].convertToType(data['trade'], [_Trade["default"]]);
        }

        if (data.hasOwnProperty('profiling')) {
          obj['profiling'] = _ApiClient["default"].convertToType(data['profiling'], [_Profiling["default"]]);
        }

        if (data.hasOwnProperty('prices')) {
          obj['prices'] = _ApiClient["default"].convertToType(data['prices'], {
            'String': {
              'String': 'Number'
            }
          });
        }

        if (data.hasOwnProperty('resourceAmounts')) {
          obj['resourceAmounts'] = _ApiClient["default"].convertToType(data['resourceAmounts'], {
            'String': Object
          });
        }

        if (data.hasOwnProperty('scores')) {
          obj['scores'] = _ApiClient["default"].convertToType(data['scores'], {
            'String': _ScoreValue["default"]
          });
        }

        if (data.hasOwnProperty('seasonScores')) {
          obj['seasonScores'] = _ApiClient["default"].convertToType(data['seasonScores'], {
            'String': {
              'String': 'Number'
            }
          });
        }

        if (data.hasOwnProperty('season')) {
          obj['season'] = _ApiClient["default"].convertToType(data['season'], 'Number');
        }

        if (data.hasOwnProperty('tick')) {
          obj['tick'] = _ApiClient["default"].convertToType(data['tick'], 'Number');
        }
      }

      return obj;
    }
  }]);

  return Reports;
}();
/**
 * @member {Array.<module:model/Combat>} combat
 */


Reports.prototype['combat'] = undefined;
/**
 * @member {Array.<module:model/Trade>} trade
 */

Reports.prototype['trade'] = undefined;
/**
 * Profiling information about the game. Used by the visualization website.
 * @member {Array.<module:model/Profiling>} profiling
 */

Reports.prototype['profiling'] = undefined;
/**
 * Prices are average across all planets.
 * @member {Object.<String, Object.<String, Number>>} prices
 */

Reports.prototype['prices'] = undefined;
/**
 * @member {Object.<String, Object.<String, Number>>} resourceAmounts
 */

Reports.prototype['resourceAmounts'] = undefined;
/**
 * @member {Object.<String, module:model/ScoreValue>} scores
 */

Reports.prototype['scores'] = undefined;
/**
 * user
 * @member {Object.<String, Object.<String, Number>>} seasonScores
 */

Reports.prototype['seasonScores'] = undefined;
/**
 * requested / last season
 * @member {Number} season
 */

Reports.prototype['season'] = undefined;
/**
 * requested / last tick in the season
 * @member {Number} tick
 */

Reports.prototype['tick'] = undefined;
var _default = Reports;
exports["default"] = _default;
},{"../ApiClient":1,"./Combat":5,"./Profiling":21,"./ScoreValue":26,"./Trade":30}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The Resource model module.
 * @module model/Resource
 * @version 1.0.0
 */
var Resource = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Resource</code>.
   * @alias module:model/Resource
   * @param amount {Number} 
   */
  function Resource(amount) {
    _classCallCheck(this, Resource);

    Resource.initialize(this, amount);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Resource, null, [{
    key: "initialize",
    value: function initialize(obj, amount) {
      obj['amount'] = amount;
    }
    /**
     * Constructs a <code>Resource</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Resource} obj Optional instance to populate.
     * @return {module:model/Resource} The populated <code>Resource</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Resource();

        if (data.hasOwnProperty('amount')) {
          obj['amount'] = _ApiClient["default"].convertToType(data['amount'], 'Number');
        }
      }

      return obj;
    }
  }]);

  return Resource;
}();
/**
 * @member {Number} amount
 */


Resource.prototype['amount'] = undefined;
var _default = Resource;
exports["default"] = _default;
},{"../ApiClient":1}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The ScoreValue model module.
 * @module model/ScoreValue
 * @version 1.0.0
 */
var ScoreValue = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>ScoreValue</code>.
   * @alias module:model/ScoreValue
   */
  function ScoreValue() {
    _classCallCheck(this, ScoreValue);

    ScoreValue.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(ScoreValue, null, [{
    key: "initialize",
    value: function initialize(obj) {}
    /**
     * Constructs a <code>ScoreValue</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ScoreValue} obj Optional instance to populate.
     * @return {module:model/ScoreValue} The populated <code>ScoreValue</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ScoreValue();

        if (data.hasOwnProperty('money')) {
          obj['money'] = _ApiClient["default"].convertToType(data['money'], {
            'String': 'Number'
          });
        }

        if (data.hasOwnProperty('resources')) {
          obj['resources'] = _ApiClient["default"].convertToType(data['resources'], {
            'String': 'Number'
          });
        }

        if (data.hasOwnProperty('ships')) {
          obj['ships'] = _ApiClient["default"].convertToType(data['ships'], {
            'String': 'Number'
          });
        }

        if (data.hasOwnProperty('total')) {
          obj['total'] = _ApiClient["default"].convertToType(data['total'], {
            'String': 'Number'
          });
        }
      }

      return obj;
    }
  }]);

  return ScoreValue;
}();
/**
 * @member {Object.<String, Number>} money
 */


ScoreValue.prototype['money'] = undefined;
/**
 * @member {Object.<String, Number>} resources
 */

ScoreValue.prototype['resources'] = undefined;
/**
 * @member {Object.<String, Number>} ships
 */

ScoreValue.prototype['ships'] = undefined;
/**
 * @member {Object.<String, Number>} total
 */

ScoreValue.prototype['total'] = undefined;
var _default = ScoreValue;
exports["default"] = _default;
},{"../ApiClient":1}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Command = _interopRequireDefault(require("./Command"));

var _Resource = _interopRequireDefault(require("./Resource"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The Ship model module.
 * @module model/Ship
 * @version 1.0.0
 */
var Ship = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Ship</code>.
   * @alias module:model/Ship
   * @param shipClass {String} 
   * @param life {Number} 
   * @param name {String} 
   * @param player {String} 
   * @param position {Array.<Number>} 
   * @param prevPosition {Array.<Number>} 
   * @param resources {Object.<String, module:model/Resource>} 
   */
  function Ship(shipClass, life, name, player, position, prevPosition, resources) {
    _classCallCheck(this, Ship);

    Ship.initialize(this, shipClass, life, name, player, position, prevPosition, resources);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Ship, null, [{
    key: "initialize",
    value: function initialize(obj, shipClass, life, name, player, position, prevPosition, resources) {
      obj['shipClass'] = shipClass;
      obj['life'] = life;
      obj['name'] = name;
      obj['player'] = player;
      obj['position'] = position;
      obj['prevPosition'] = prevPosition;
      obj['resources'] = resources;
    }
    /**
     * Constructs a <code>Ship</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Ship} obj Optional instance to populate.
     * @return {module:model/Ship} The populated <code>Ship</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Ship();

        if (data.hasOwnProperty('shipClass')) {
          obj['shipClass'] = _ApiClient["default"].convertToType(data['shipClass'], 'String');
        }

        if (data.hasOwnProperty('life')) {
          obj['life'] = _ApiClient["default"].convertToType(data['life'], 'Number');
        }

        if (data.hasOwnProperty('name')) {
          obj['name'] = _ApiClient["default"].convertToType(data['name'], 'String');
        }

        if (data.hasOwnProperty('player')) {
          obj['player'] = _ApiClient["default"].convertToType(data['player'], 'String');
        }

        if (data.hasOwnProperty('position')) {
          obj['position'] = _ApiClient["default"].convertToType(data['position'], ['Number']);
        }

        if (data.hasOwnProperty('prevPosition')) {
          obj['prevPosition'] = _ApiClient["default"].convertToType(data['prevPosition'], ['Number']);
        }

        if (data.hasOwnProperty('resources')) {
          obj['resources'] = _ApiClient["default"].convertToType(data['resources'], {
            'String': _Resource["default"]
          });
        }

        if (data.hasOwnProperty('command')) {
          obj['command'] = _Command["default"].constructFromObject(data['command']);
        }
      }

      return obj;
    }
  }]);

  return Ship;
}();
/**
 * @member {String} shipClass
 */


Ship.prototype['shipClass'] = undefined;
/**
 * @member {Number} life
 */

Ship.prototype['life'] = undefined;
/**
 * @member {String} name
 */

Ship.prototype['name'] = undefined;
/**
 * @member {String} player
 */

Ship.prototype['player'] = undefined;
/**
 * @member {Array.<Number>} position
 */

Ship.prototype['position'] = undefined;
/**
 * @member {Array.<Number>} prevPosition
 */

Ship.prototype['prevPosition'] = undefined;
/**
 * @member {Object.<String, module:model/Resource>} resources
 */

Ship.prototype['resources'] = undefined;
/**
 * @member {module:model/Command} command
 */

Ship.prototype['command'] = undefined;
var _default = Ship;
exports["default"] = _default;
},{"../ApiClient":1,"./Command":6,"./Resource":25}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The ShipClass model module.
 * @module model/ShipClass
 * @version 1.0.0
 */
var ShipClass = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>ShipClass</code>.
   * @alias module:model/ShipClass
   * @param name {String} 
   * @param shipyard {Boolean} whether ships of this class are allowed to construct new ships
   * @param speed {Number} 
   * @param cargoCapacity {Number} maximum number of resources the ship can carry - sum over all types of resources
   * @param life {Number} 
   * @param damage {Number} 
   * @param price {Number} 
   * @param regen {Number} passive regeneration per tick
   * @param repairPrice {Number} price for healing repairLife per tick (for repair command)
   * @param repairLife {Number} how much is repaired per tick (for repair command)
   */
  function ShipClass(name, shipyard, speed, cargoCapacity, life, damage, price, regen, repairPrice, repairLife) {
    _classCallCheck(this, ShipClass);

    ShipClass.initialize(this, name, shipyard, speed, cargoCapacity, life, damage, price, regen, repairPrice, repairLife);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(ShipClass, null, [{
    key: "initialize",
    value: function initialize(obj, name, shipyard, speed, cargoCapacity, life, damage, price, regen, repairPrice, repairLife) {
      obj['name'] = name;
      obj['shipyard'] = shipyard;
      obj['speed'] = speed;
      obj['cargoCapacity'] = cargoCapacity;
      obj['life'] = life;
      obj['damage'] = damage;
      obj['price'] = price;
      obj['regen'] = regen;
      obj['repairPrice'] = repairPrice;
      obj['repairLife'] = repairLife;
    }
    /**
     * Constructs a <code>ShipClass</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ShipClass} obj Optional instance to populate.
     * @return {module:model/ShipClass} The populated <code>ShipClass</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ShipClass();

        if (data.hasOwnProperty('name')) {
          obj['name'] = _ApiClient["default"].convertToType(data['name'], 'String');
        }

        if (data.hasOwnProperty('shipyard')) {
          obj['shipyard'] = _ApiClient["default"].convertToType(data['shipyard'], 'Boolean');
        }

        if (data.hasOwnProperty('speed')) {
          obj['speed'] = _ApiClient["default"].convertToType(data['speed'], 'Number');
        }

        if (data.hasOwnProperty('cargoCapacity')) {
          obj['cargoCapacity'] = _ApiClient["default"].convertToType(data['cargoCapacity'], 'Number');
        }

        if (data.hasOwnProperty('life')) {
          obj['life'] = _ApiClient["default"].convertToType(data['life'], 'Number');
        }

        if (data.hasOwnProperty('damage')) {
          obj['damage'] = _ApiClient["default"].convertToType(data['damage'], 'Number');
        }

        if (data.hasOwnProperty('price')) {
          obj['price'] = _ApiClient["default"].convertToType(data['price'], 'Number');
        }

        if (data.hasOwnProperty('regen')) {
          obj['regen'] = _ApiClient["default"].convertToType(data['regen'], 'Number');
        }

        if (data.hasOwnProperty('repairPrice')) {
          obj['repairPrice'] = _ApiClient["default"].convertToType(data['repairPrice'], 'Number');
        }

        if (data.hasOwnProperty('repairLife')) {
          obj['repairLife'] = _ApiClient["default"].convertToType(data['repairLife'], 'Number');
        }
      }

      return obj;
    }
  }]);

  return ShipClass;
}();
/**
 * @member {String} name
 */


ShipClass.prototype['name'] = undefined;
/**
 * whether ships of this class are allowed to construct new ships
 * @member {Boolean} shipyard
 */

ShipClass.prototype['shipyard'] = undefined;
/**
 * @member {Number} speed
 */

ShipClass.prototype['speed'] = undefined;
/**
 * maximum number of resources the ship can carry - sum over all types of resources
 * @member {Number} cargoCapacity
 */

ShipClass.prototype['cargoCapacity'] = undefined;
/**
 * @member {Number} life
 */

ShipClass.prototype['life'] = undefined;
/**
 * @member {Number} damage
 */

ShipClass.prototype['damage'] = undefined;
/**
 * @member {Number} price
 */

ShipClass.prototype['price'] = undefined;
/**
 * passive regeneration per tick
 * @member {Number} regen
 */

ShipClass.prototype['regen'] = undefined;
/**
 * price for healing repairLife per tick (for repair command)
 * @member {Number} repairPrice
 */

ShipClass.prototype['repairPrice'] = undefined;
/**
 * how much is repaired per tick (for repair command)
 * @member {Number} repairLife
 */

ShipClass.prototype['repairLife'] = undefined;
var _default = ShipClass;
exports["default"] = _default;
},{"../ApiClient":1}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _ShipClass = _interopRequireDefault(require("./ShipClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The StaticData model module.
 * @module model/StaticData
 * @version 1.0.0
 */
var StaticData = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>StaticData</code>.
   * @alias module:model/StaticData
   */
  function StaticData() {
    _classCallCheck(this, StaticData);

    StaticData.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(StaticData, null, [{
    key: "initialize",
    value: function initialize(obj) {}
    /**
     * Constructs a <code>StaticData</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/StaticData} obj Optional instance to populate.
     * @return {module:model/StaticData} The populated <code>StaticData</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new StaticData();

        if (data.hasOwnProperty('shipClasses')) {
          obj['shipClasses'] = _ApiClient["default"].convertToType(data['shipClasses'], {
            'String': _ShipClass["default"]
          });
        }

        if (data.hasOwnProperty('resourceNames')) {
          obj['resourceNames'] = _ApiClient["default"].convertToType(data['resourceNames'], {
            'String': 'String'
          });
        }
      }

      return obj;
    }
  }]);

  return StaticData;
}();
/**
 * @member {Object.<String, module:model/ShipClass>} shipClasses
 */


StaticData.prototype['shipClasses'] = undefined;
/**
 * @member {Object.<String, String>} resourceNames
 */

StaticData.prototype['resourceNames'] = undefined;
var _default = StaticData;
exports["default"] = _default;
},{"../ApiClient":1,"./ShipClass":28}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The Trade model module.
 * @module model/Trade
 * @version 1.0.0
 */
var Trade = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Trade</code>.
   * @alias module:model/Trade
   */
  function Trade() {
    _classCallCheck(this, Trade);

    Trade.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Trade, null, [{
    key: "initialize",
    value: function initialize(obj) {}
    /**
     * Constructs a <code>Trade</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Trade} obj Optional instance to populate.
     * @return {module:model/Trade} The populated <code>Trade</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Trade();

        if (data.hasOwnProperty('tick')) {
          obj['tick'] = _ApiClient["default"].convertToType(data['tick'], 'Number');
        }

        if (data.hasOwnProperty('buyer')) {
          obj['buyer'] = _ApiClient["default"].convertToType(data['buyer'], 'String');
        }

        if (data.hasOwnProperty('seller')) {
          obj['seller'] = _ApiClient["default"].convertToType(data['seller'], 'String');
        }

        if (data.hasOwnProperty('resource')) {
          obj['resource'] = _ApiClient["default"].convertToType(data['resource'], 'String');
        }

        if (data.hasOwnProperty('amount')) {
          obj['amount'] = _ApiClient["default"].convertToType(data['amount'], 'Number');
        }

        if (data.hasOwnProperty('price')) {
          obj['price'] = _ApiClient["default"].convertToType(data['price'], 'Number');
        }
      }

      return obj;
    }
  }]);

  return Trade;
}();
/**
 * @member {Number} tick
 */


Trade.prototype['tick'] = undefined;
/**
 * @member {String} buyer
 */

Trade.prototype['buyer'] = undefined;
/**
 * @member {String} seller
 */

Trade.prototype['seller'] = undefined;
/**
 * @member {String} resource
 */

Trade.prototype['resource'] = undefined;
/**
 * @member {Number} amount
 */

Trade.prototype['amount'] = undefined;
/**
 * @member {Number} price
 */

Trade.prototype['price'] = undefined;
var _default = Trade;
exports["default"] = _default;
},{"../ApiClient":1}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The TradeCommand model module.
 * @module model/TradeCommand
 * @version 1.0.0
 */
var TradeCommand = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>TradeCommand</code>.
   * @alias module:model/TradeCommand
   * @param amount {Number} Positive value means buy, negative sell.
   * @param resource {String} 
   * @param target {String} Any planet or own ship.
   */
  function TradeCommand(amount, resource, target) {
    _classCallCheck(this, TradeCommand);

    TradeCommand.initialize(this, amount, resource, target);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(TradeCommand, null, [{
    key: "initialize",
    value: function initialize(obj, amount, resource, target) {
      obj['amount'] = amount;
      obj['resource'] = resource;
      obj['target'] = target;
    }
    /**
     * Constructs a <code>TradeCommand</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/TradeCommand} obj Optional instance to populate.
     * @return {module:model/TradeCommand} The populated <code>TradeCommand</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new TradeCommand();

        if (data.hasOwnProperty('amount')) {
          obj['amount'] = _ApiClient["default"].convertToType(data['amount'], 'Number');
        }

        if (data.hasOwnProperty('resource')) {
          obj['resource'] = _ApiClient["default"].convertToType(data['resource'], 'String');
        }

        if (data.hasOwnProperty('target')) {
          obj['target'] = _ApiClient["default"].convertToType(data['target'], 'String');
        }

        if (data.hasOwnProperty('type')) {
          obj['type'] = _ApiClient["default"].convertToType(data['type'], 'String');
        }
      }

      return obj;
    }
  }]);

  return TradeCommand;
}();
/**
 * Positive value means buy, negative sell.
 * @member {Number} amount
 */


TradeCommand.prototype['amount'] = undefined;
/**
 * @member {String} resource
 */

TradeCommand.prototype['resource'] = undefined;
/**
 * Any planet or own ship.
 * @member {String} target
 */

TradeCommand.prototype['target'] = undefined;
/**
 * @member {String} type
 * @default 'trade'
 */

TradeCommand.prototype['type'] = 'trade';
var _default = TradeCommand;
exports["default"] = _default;
},{"../ApiClient":1}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Resource = _interopRequireDefault(require("./Resource"));

var _TradingResourceAllOf = _interopRequireDefault(require("./TradingResourceAllOf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The TradingResource model module.
 * @module model/TradingResource
 * @version 1.0.0
 */
var TradingResource = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>TradingResource</code>.
   * @alias module:model/TradingResource
   * @implements module:model/Resource
   * @implements module:model/TradingResourceAllOf
   * @param amount {Number} 
   */
  function TradingResource(amount) {
    _classCallCheck(this, TradingResource);

    _Resource["default"].initialize(this, amount);

    _TradingResourceAllOf["default"].initialize(this);

    TradingResource.initialize(this, amount);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(TradingResource, null, [{
    key: "initialize",
    value: function initialize(obj, amount) {
      obj['amount'] = amount;
    }
    /**
     * Constructs a <code>TradingResource</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/TradingResource} obj Optional instance to populate.
     * @return {module:model/TradingResource} The populated <code>TradingResource</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new TradingResource();

        _Resource["default"].constructFromObject(data, obj);

        _TradingResourceAllOf["default"].constructFromObject(data, obj);

        if (data.hasOwnProperty('amount')) {
          obj['amount'] = _ApiClient["default"].convertToType(data['amount'], 'Number');
        }

        if (data.hasOwnProperty('buyPrice')) {
          obj['buyPrice'] = _ApiClient["default"].convertToType(data['buyPrice'], 'Number');
        }

        if (data.hasOwnProperty('sellPrice')) {
          obj['sellPrice'] = _ApiClient["default"].convertToType(data['sellPrice'], 'Number');
        }
      }

      return obj;
    }
  }]);

  return TradingResource;
}();
/**
 * @member {Number} amount
 */


TradingResource.prototype['amount'] = undefined;
/**
 * @member {Number} buyPrice
 */

TradingResource.prototype['buyPrice'] = undefined;
/**
 * @member {Number} sellPrice
 */

TradingResource.prototype['sellPrice'] = undefined; // Implement Resource interface:

/**
 * @member {Number} amount
 */

_Resource["default"].prototype['amount'] = undefined; // Implement TradingResourceAllOf interface:

/**
 * @member {Number} buyPrice
 */

_TradingResourceAllOf["default"].prototype['buyPrice'] = undefined;
/**
 * @member {Number} sellPrice
 */

_TradingResourceAllOf["default"].prototype['sellPrice'] = undefined;
var _default = TradingResource;
exports["default"] = _default;
},{"../ApiClient":1,"./Resource":25,"./TradingResourceAllOf":33}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The TradingResourceAllOf model module.
 * @module model/TradingResourceAllOf
 * @version 1.0.0
 */
var TradingResourceAllOf = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>TradingResourceAllOf</code>.
   * @alias module:model/TradingResourceAllOf
   */
  function TradingResourceAllOf() {
    _classCallCheck(this, TradingResourceAllOf);

    TradingResourceAllOf.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(TradingResourceAllOf, null, [{
    key: "initialize",
    value: function initialize(obj) {}
    /**
     * Constructs a <code>TradingResourceAllOf</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/TradingResourceAllOf} obj Optional instance to populate.
     * @return {module:model/TradingResourceAllOf} The populated <code>TradingResourceAllOf</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new TradingResourceAllOf();

        if (data.hasOwnProperty('buyPrice')) {
          obj['buyPrice'] = _ApiClient["default"].convertToType(data['buyPrice'], 'Number');
        }

        if (data.hasOwnProperty('sellPrice')) {
          obj['sellPrice'] = _ApiClient["default"].convertToType(data['sellPrice'], 'Number');
        }
      }

      return obj;
    }
  }]);

  return TradingResourceAllOf;
}();
/**
 * @member {Number} buyPrice
 */


TradingResourceAllOf.prototype['buyPrice'] = undefined;
/**
 * @member {Number} sellPrice
 */

TradingResourceAllOf.prototype['sellPrice'] = undefined;
var _default = TradingResourceAllOf;
exports["default"] = _default;
},{"../ApiClient":1}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * The Wreck model module.
 * @module model/Wreck
 * @version 1.0.0
 */
var Wreck = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Wreck</code>.
   * @alias module:model/Wreck
   * @param shipClass {String} 
   * @param name {String} 
   * @param player {String} 
   * @param killTick {Number} 
   * @param position {Array.<Number>} 
   */
  function Wreck(shipClass, name, player, killTick, position) {
    _classCallCheck(this, Wreck);

    Wreck.initialize(this, shipClass, name, player, killTick, position);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Wreck, null, [{
    key: "initialize",
    value: function initialize(obj, shipClass, name, player, killTick, position) {
      obj['shipClass'] = shipClass;
      obj['name'] = name;
      obj['player'] = player;
      obj['killTick'] = killTick;
      obj['position'] = position;
    }
    /**
     * Constructs a <code>Wreck</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Wreck} obj Optional instance to populate.
     * @return {module:model/Wreck} The populated <code>Wreck</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Wreck();

        if (data.hasOwnProperty('shipClass')) {
          obj['shipClass'] = _ApiClient["default"].convertToType(data['shipClass'], 'String');
        }

        if (data.hasOwnProperty('name')) {
          obj['name'] = _ApiClient["default"].convertToType(data['name'], 'String');
        }

        if (data.hasOwnProperty('player')) {
          obj['player'] = _ApiClient["default"].convertToType(data['player'], 'String');
        }

        if (data.hasOwnProperty('killTick')) {
          obj['killTick'] = _ApiClient["default"].convertToType(data['killTick'], 'Number');
        }

        if (data.hasOwnProperty('position')) {
          obj['position'] = _ApiClient["default"].convertToType(data['position'], ['Number']);
        }
      }

      return obj;
    }
  }]);

  return Wreck;
}();
/**
 * @member {String} shipClass
 */


Wreck.prototype['shipClass'] = undefined;
/**
 * @member {String} name
 */

Wreck.prototype['name'] = undefined;
/**
 * @member {String} player
 */

Wreck.prototype['player'] = undefined;
/**
 * @member {Number} killTick
 */

Wreck.prototype['killTick'] = undefined;
/**
 * @member {Array.<Number>} position
 */

Wreck.prototype['position'] = undefined;
var _default = Wreck;
exports["default"] = _default;
},{"../ApiClient":1}],35:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }

  // Remove event specific arrays for event types that no
  // one is subscribed for to avoid memory leak.
  if (callbacks.length === 0) {
    delete this._callbacks['$' + event];
  }

  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};

  var args = new Array(arguments.length - 1)
    , callbacks = this._callbacks['$' + event];

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],36:[function(require,module,exports){
module.exports = stringify
stringify.default = stringify
stringify.stable = deterministicStringify
stringify.stableStringify = deterministicStringify

var LIMIT_REPLACE_NODE = '[...]'
var CIRCULAR_REPLACE_NODE = '[Circular]'

var arr = []
var replacerStack = []

function defaultOptions () {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  }
}

// Regular stringify
function stringify (obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions()
  }

  decirc(obj, '', 0, [], undefined, 0, options)
  var res
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(obj, replacer, spacer)
    } else {
      res = JSON.stringify(obj, replaceGetterValues(replacer), spacer)
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]')
  } finally {
    while (arr.length !== 0) {
      var part = arr.pop()
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3])
      } else {
        part[0][part[1]] = part[2]
      }
    }
  }
  return res
}

function setReplace (replace, val, k, parent) {
  var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k)
  if (propertyDescriptor.get !== undefined) {
    if (propertyDescriptor.configurable) {
      Object.defineProperty(parent, k, { value: replace })
      arr.push([parent, k, val, propertyDescriptor])
    } else {
      replacerStack.push([val, k, replace])
    }
  } else {
    parent[k] = replace
    arr.push([parent, k, val])
  }
}

function decirc (val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1
  var i
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent)
        return
      }
    }

    if (
      typeof options.depthLimit !== 'undefined' &&
      depth > options.depthLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    if (
      typeof options.edgesLimit !== 'undefined' &&
      edgeIndex + 1 > options.edgesLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    stack.push(val)
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        decirc(val[i], i, i, stack, val, depth, options)
      }
    } else {
      var keys = Object.keys(val)
      for (i = 0; i < keys.length; i++) {
        var key = keys[i]
        decirc(val[key], key, i, stack, val, depth, options)
      }
    }
    stack.pop()
  }
}

// Stable-stringify
function compareFunction (a, b) {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

function deterministicStringify (obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions()
  }

  var tmp = deterministicDecirc(obj, '', 0, [], undefined, 0, options) || obj
  var res
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(tmp, replacer, spacer)
    } else {
      res = JSON.stringify(tmp, replaceGetterValues(replacer), spacer)
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]')
  } finally {
    // Ensure that we restore the object as it was.
    while (arr.length !== 0) {
      var part = arr.pop()
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3])
      } else {
        part[0][part[1]] = part[2]
      }
    }
  }
  return res
}

function deterministicDecirc (val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1
  var i
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent)
        return
      }
    }
    try {
      if (typeof val.toJSON === 'function') {
        return
      }
    } catch (_) {
      return
    }

    if (
      typeof options.depthLimit !== 'undefined' &&
      depth > options.depthLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    if (
      typeof options.edgesLimit !== 'undefined' &&
      edgeIndex + 1 > options.edgesLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    stack.push(val)
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        deterministicDecirc(val[i], i, i, stack, val, depth, options)
      }
    } else {
      // Create a temporary object in the required way
      var tmp = {}
      var keys = Object.keys(val).sort(compareFunction)
      for (i = 0; i < keys.length; i++) {
        var key = keys[i]
        deterministicDecirc(val[key], key, i, stack, val, depth, options)
        tmp[key] = val[key]
      }
      if (typeof parent !== 'undefined') {
        arr.push([parent, k, val])
        parent[k] = tmp
      } else {
        return tmp
      }
    }
    stack.pop()
  }
}

// wraps replacer function to handle values we couldn't replace
// and mark them as replaced value
function replaceGetterValues (replacer) {
  replacer =
    typeof replacer !== 'undefined'
      ? replacer
      : function (k, v) {
        return v
      }
  return function (key, val) {
    if (replacerStack.length > 0) {
      for (var i = 0; i < replacerStack.length; i++) {
        var part = replacerStack[i]
        if (part[1] === key && part[0] === val) {
          val = part[2]
          replacerStack.splice(i, 1)
          break
        }
      }
    }
    return replacer.call(this, key, val)
  }
}

},{}],37:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function Agent() {
  this._defaults = [];
}

['use', 'on', 'once', 'set', 'query', 'type', 'accept', 'auth', 'withCredentials', 'sortQuery', 'retry', 'ok', 'redirects', 'timeout', 'buffer', 'serialize', 'parse', 'ca', 'key', 'pfx', 'cert', 'disableTLSCerts'].forEach(function (fn) {
  // Default setting for all requests from this agent
  Agent.prototype[fn] = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this._defaults.push({
      fn: fn,
      args: args
    });

    return this;
  };
});

Agent.prototype._setDefaults = function (req) {
  this._defaults.forEach(function (def) {
    req[def.fn].apply(req, _toConsumableArray(def.args));
  });
};

module.exports = Agent;

},{}],38:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Root reference for iframes.
 */
var root;

if (typeof window !== 'undefined') {
  // Browser window
  root = window;
} else if (typeof self === 'undefined') {
  // Other environments
  console.warn('Using browser-only version of superagent in non-browser environment');
  root = void 0;
} else {
  // Web Worker
  root = self;
}

var Emitter = require('component-emitter');

var safeStringify = require('fast-safe-stringify');

var RequestBase = require('./request-base');

var isObject = require('./is-object');

var ResponseBase = require('./response-base');

var Agent = require('./agent-base');
/**
 * Noop.
 */


function noop() {}
/**
 * Expose `request`.
 */


module.exports = function (method, url) {
  // callback
  if (typeof url === 'function') {
    return new exports.Request('GET', method).end(url);
  } // url first


  if (arguments.length === 1) {
    return new exports.Request('GET', method);
  }

  return new exports.Request(method, url);
};

exports = module.exports;
var request = exports;
exports.Request = Request;
/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest && (!root.location || root.location.protocol !== 'file:' || !root.ActiveXObject)) {
    return new XMLHttpRequest();
  }

  try {
    return new ActiveXObject('Microsoft.XMLHTTP');
  } catch (_unused) {}

  try {
    return new ActiveXObject('Msxml2.XMLHTTP.6.0');
  } catch (_unused2) {}

  try {
    return new ActiveXObject('Msxml2.XMLHTTP.3.0');
  } catch (_unused3) {}

  try {
    return new ActiveXObject('Msxml2.XMLHTTP');
  } catch (_unused4) {}

  throw new Error('Browser-only version of superagent could not find XHR');
};
/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */


var trim = ''.trim ? function (s) {
  return s.trim();
} : function (s) {
  return s.replace(/(^\s*|\s*$)/g, '');
};
/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) pushEncodedKeyValuePair(pairs, key, obj[key]);
  }

  return pairs.join('&');
}
/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */


function pushEncodedKeyValuePair(pairs, key, val) {
  if (val === undefined) return;

  if (val === null) {
    pairs.push(encodeURI(key));
    return;
  }

  if (Array.isArray(val)) {
    val.forEach(function (v) {
      pushEncodedKeyValuePair(pairs, key, v);
    });
  } else if (isObject(val)) {
    for (var subkey in val) {
      if (Object.prototype.hasOwnProperty.call(val, subkey)) pushEncodedKeyValuePair(pairs, "".concat(key, "[").concat(subkey, "]"), val[subkey]);
    }
  } else {
    pairs.push(encodeURI(key) + '=' + encodeURIComponent(val));
  }
}
/**
 * Expose serialization method.
 */


request.serializeObject = serialize;
/**
 * Parse the given x-www-form-urlencoded `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');

    if (pos === -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] = decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}
/**
 * Expose parser.
 */


request.parseString = parseString;
/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'text/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  form: 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};
/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

request.serialize = {
  'application/x-www-form-urlencoded': serialize,
  'application/json': safeStringify
};
/**
 * Default parsers.
 *
 *     superagent.parse['application/xml'] = function(str){
 *       return { object parsed from str };
 *     };
 *
 */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};
/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');

    if (index === -1) {
      // could be empty line, just skip it
      continue;
    }

    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}
/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */


function isJSON(mime) {
  // should match /json or +json
  // but not /json-seq
  return /[/+]json($|[^-\w])/.test(mime);
}
/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */


function Response(req) {
  this.req = req;
  this.xhr = this.req.xhr; // responseText is accessible only if responseType is '' or 'text' and on older browsers

  this.text = this.req.method !== 'HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text') || typeof this.xhr.responseType === 'undefined' ? this.xhr.responseText : null;
  this.statusText = this.req.xhr.statusText;
  var status = this.xhr.status; // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request

  if (status === 1223) {
    status = 204;
  }

  this._setStatusProperties(status);

  this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  this.header = this.headers; // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.

  this.header['content-type'] = this.xhr.getResponseHeader('content-type');

  this._setHeaderProperties(this.header);

  if (this.text === null && req._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method === 'HEAD' ? null : this._parseBody(this.text ? this.text : this.xhr.response);
  }
} // eslint-disable-next-line new-cap


ResponseBase(Response.prototype);
/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function (str) {
  var parse = request.parse[this.type];

  if (this.req._parser) {
    return this.req._parser(this, str);
  }

  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }

  return parse && str && (str.length > 0 || str instanceof Object) ? parse(str) : null;
};
/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */


Response.prototype.toError = function () {
  var req = this.req;
  var method = req.method;
  var url = req.url;
  var msg = "cannot ".concat(method, " ").concat(url, " (").concat(this.status, ")");
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;
  return err;
};
/**
 * Expose `Response`.
 */


request.Response = Response;
/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case

  this._header = {}; // coerces header names to lowercase

  this.on('end', function () {
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch (err_) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = err_; // issue #675: return the raw response if the response parsing fails

      if (self.xhr) {
        // ie9 doesn't have 'response' property
        err.rawResponse = typeof self.xhr.responseType === 'undefined' ? self.xhr.responseText : self.xhr.response; // issue #876: return the http status code if the response parsing fails

        err.status = self.xhr.status ? self.xhr.status : null;
        err.statusCode = err.status; // backwards-compat only
      } else {
        err.rawResponse = null;
        err.status = null;
      }

      return self.callback(err);
    }

    self.emit('response', res);
    var new_err;

    try {
      if (!self._isResponseOK(res)) {
        new_err = new Error(res.statusText || res.text || 'Unsuccessful HTTP response');
      }
    } catch (err_) {
      new_err = err_; // ok() callback can throw
    } // #1000 don't catch errors from the callback to avoid double calling it


    if (new_err) {
      new_err.original = err;
      new_err.response = res;
      new_err.status = res.status;
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}
/**
 * Mixin `Emitter` and `RequestBase`.
 */
// eslint-disable-next-line new-cap


Emitter(Request.prototype); // eslint-disable-next-line new-cap

RequestBase(Request.prototype);
/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function (type) {
  this.set('Content-Type', request.types[type] || type);
  return this;
};
/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.accept = function (type) {
  this.set('Accept', request.types[type] || type);
  return this;
};
/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} [pass] optional in case of using 'bearer' as type
 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.auth = function (user, pass, options) {
  if (arguments.length === 1) pass = '';

  if (_typeof(pass) === 'object' && pass !== null) {
    // pass is optional and can be replaced with options
    options = pass;
    pass = '';
  }

  if (!options) {
    options = {
      type: typeof btoa === 'function' ? 'basic' : 'auto'
    };
  }

  var encoder = function encoder(string) {
    if (typeof btoa === 'function') {
      return btoa(string);
    }

    throw new Error('Cannot use basic auth, btoa is not a function');
  };

  return this._auth(user, pass, options, encoder);
};
/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.query = function (val) {
  if (typeof val !== 'string') val = serialize(val);
  if (val) this._query.push(val);
  return this;
};
/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.attach = function (field, file, options) {
  if (file) {
    if (this._data) {
      throw new Error("superagent can't mix .send() and .attach()");
    }

    this._getFormData().append(field, file, options || file.name);
  }

  return this;
};

Request.prototype._getFormData = function () {
  if (!this._formData) {
    this._formData = new root.FormData();
  }

  return this._formData;
};
/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */


Request.prototype.callback = function (err, res) {
  if (this._shouldRetry(err, res)) {
    return this._retry();
  }

  var fn = this._callback;
  this.clearTimeout();

  if (err) {
    if (this._maxRetries) err.retries = this._retries - 1;
    this.emit('error', err);
  }

  fn(err, res);
};
/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */


Request.prototype.crossDomainError = function () {
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;
  err.status = this.status;
  err.method = this.method;
  err.url = this.url;
  this.callback(err);
}; // This only warns, because the request is still likely to work


Request.prototype.agent = function () {
  console.warn('This is not supported in browser version of superagent');
  return this;
};

Request.prototype.ca = Request.prototype.agent;
Request.prototype.buffer = Request.prototype.ca; // This throws, because it can't send/receive data as expected

Request.prototype.write = function () {
  throw new Error('Streaming is not supported in browser version of superagent');
};

Request.prototype.pipe = Request.prototype.write;
/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj host object
 * @return {Boolean} is a host object
 * @api private
 */

Request.prototype._isHost = function (obj) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return obj && _typeof(obj) === 'object' && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
};
/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.end = function (fn) {
  if (this._endCalled) {
    console.warn('Warning: .end() was called twice. This is not supported in superagent');
  }

  this._endCalled = true; // store callback

  this._callback = fn || noop; // querystring

  this._finalizeQueryString();

  this._end();
};

Request.prototype._setUploadTimeout = function () {
  var self = this; // upload timeout it's wokrs only if deadline timeout is off

  if (this._uploadTimeout && !this._uploadTimeoutTimer) {
    this._uploadTimeoutTimer = setTimeout(function () {
      self._timeoutError('Upload timeout of ', self._uploadTimeout, 'ETIMEDOUT');
    }, this._uploadTimeout);
  }
}; // eslint-disable-next-line complexity


Request.prototype._end = function () {
  if (this._aborted) return this.callback(new Error('The request has been aborted even before .end() was called'));
  var self = this;
  this.xhr = request.getXHR();
  var xhr = this.xhr;
  var data = this._formData || this._data;

  this._setTimeouts(); // state change


  xhr.onreadystatechange = function () {
    var readyState = xhr.readyState;

    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }

    if (readyState !== 4) {
      return;
    } // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"


    var status;

    try {
      status = xhr.status;
    } catch (_unused5) {
      status = 0;
    }

    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }

    self.emit('end');
  }; // progress


  var handleProgress = function handleProgress(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;

      if (e.percent === 100) {
        clearTimeout(self._uploadTimeoutTimer);
      }
    }

    e.direction = direction;
    self.emit('progress', e);
  };

  if (this.hasListeners('progress')) {
    try {
      xhr.addEventListener('progress', handleProgress.bind(null, 'download'));

      if (xhr.upload) {
        xhr.upload.addEventListener('progress', handleProgress.bind(null, 'upload'));
      }
    } catch (_unused6) {// Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  if (xhr.upload) {
    this._setUploadTimeout();
  } // initiate request


  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  } // CORS


  if (this._withCredentials) xhr.withCredentials = true; // body

  if (!this._formData && this.method !== 'GET' && this.method !== 'HEAD' && typeof data !== 'string' && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];

    var _serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];

    if (!_serialize && isJSON(contentType)) {
      _serialize = request.serialize['application/json'];
    }

    if (_serialize) data = _serialize(data);
  } // set header fields


  for (var field in this.header) {
    if (this.header[field] === null) continue;
    if (Object.prototype.hasOwnProperty.call(this.header, field)) xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  } // send stuff


  this.emit('request', this); // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined

  xhr.send(typeof data === 'undefined' ? null : data);
};

request.agent = function () {
  return new Agent();
};

['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT', 'DELETE'].forEach(function (method) {
  Agent.prototype[method.toLowerCase()] = function (url, fn) {
    var req = new request.Request(method, url);

    this._setDefaults(req);

    if (fn) {
      req.end(fn);
    }

    return req;
  };
});
Agent.prototype.del = Agent.prototype.delete;
/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function (url, data, fn) {
  var req = request('GET', url);

  if (typeof data === 'function') {
    fn = data;
    data = null;
  }

  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};
/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */


request.head = function (url, data, fn) {
  var req = request('HEAD', url);

  if (typeof data === 'function') {
    fn = data;
    data = null;
  }

  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};
/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */


request.options = function (url, data, fn) {
  var req = request('OPTIONS', url);

  if (typeof data === 'function') {
    fn = data;
    data = null;
  }

  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};
/**
 * DELETE `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */


function del(url, data, fn) {
  var req = request('DELETE', url);

  if (typeof data === 'function') {
    fn = data;
    data = null;
  }

  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
}

request.del = del;
request.delete = del;
/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function (url, data, fn) {
  var req = request('PATCH', url);

  if (typeof data === 'function') {
    fn = data;
    data = null;
  }

  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};
/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */


request.post = function (url, data, fn) {
  var req = request('POST', url);

  if (typeof data === 'function') {
    fn = data;
    data = null;
  }

  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};
/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */


request.put = function (url, data, fn) {
  var req = request('PUT', url);

  if (typeof data === 'function') {
    fn = data;
    data = null;
  }

  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

},{"./agent-base":37,"./is-object":39,"./request-base":40,"./response-base":41,"component-emitter":35,"fast-safe-stringify":36}],39:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
function isObject(obj) {
  return obj !== null && _typeof(obj) === 'object';
}

module.exports = isObject;

},{}],40:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = require('./is-object');
/**
 * Expose `RequestBase`.
 */


module.exports = RequestBase;
/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase(obj) {
  if (obj) return mixin(obj);
}
/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */


function mixin(obj) {
  for (var key in RequestBase.prototype) {
    if (Object.prototype.hasOwnProperty.call(RequestBase.prototype, key)) obj[key] = RequestBase.prototype[key];
  }

  return obj;
}
/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.clearTimeout = function () {
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  clearTimeout(this._uploadTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  delete this._uploadTimeoutTimer;
  return this;
};
/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */


RequestBase.prototype.parse = function (fn) {
  this._parser = fn;
  return this;
};
/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.responseType = function (val) {
  this._responseType = val;
  return this;
};
/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */


RequestBase.prototype.serialize = function (fn) {
  this._serializer = fn;
  return this;
};
/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 * - upload is the time  since last bit of data was sent or received. This timeout works only if deadline timeout is off
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, deadline}
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.timeout = function (options) {
  if (!options || _typeof(options) !== 'object') {
    this._timeout = options;
    this._responseTimeout = 0;
    this._uploadTimeout = 0;
    return this;
  }

  for (var option in options) {
    if (Object.prototype.hasOwnProperty.call(options, option)) {
      switch (option) {
        case 'deadline':
          this._timeout = options.deadline;
          break;

        case 'response':
          this._responseTimeout = options.response;
          break;

        case 'upload':
          this._uploadTimeout = options.upload;
          break;

        default:
          console.warn('Unknown timeout option', option);
      }
    }
  }

  return this;
};
/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @param {Function} [fn]
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.retry = function (count, fn) {
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  this._retryCallback = fn;
  return this;
};

var ERROR_CODES = ['ECONNRESET', 'ETIMEDOUT', 'EADDRINFO', 'ESOCKETTIMEDOUT'];
/**
 * Determine if a request should be retried.
 * (Borrowed from segmentio/superagent-retry)
 *
 * @param {Error} err an error
 * @param {Response} [res] response
 * @returns {Boolean} if segment should be retried
 */

RequestBase.prototype._shouldRetry = function (err, res) {
  if (!this._maxRetries || this._retries++ >= this._maxRetries) {
    return false;
  }

  if (this._retryCallback) {
    try {
      var override = this._retryCallback(err, res);

      if (override === true) return true;
      if (override === false) return false; // undefined falls back to defaults
    } catch (err_) {
      console.error(err_);
    }
  }

  if (res && res.status && res.status >= 500 && res.status !== 501) return true;

  if (err) {
    if (err.code && ERROR_CODES.includes(err.code)) return true; // Superagent timeout

    if (err.timeout && err.code === 'ECONNABORTED') return true;
    if (err.crossDomain) return true;
  }

  return false;
};
/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */


RequestBase.prototype._retry = function () {
  this.clearTimeout(); // node

  if (this.req) {
    this.req = null;
    this.req = this.request();
  }

  this._aborted = false;
  this.timedout = false;
  this.timedoutError = null;
  return this._end();
};
/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */


RequestBase.prototype.then = function (resolve, reject) {
  var _this = this;

  if (!this._fullfilledPromise) {
    var self = this;

    if (this._endCalled) {
      console.warn('Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises');
    }

    this._fullfilledPromise = new Promise(function (resolve, reject) {
      self.on('abort', function () {
        if (_this._maxRetries && _this._maxRetries > _this._retries) {
          return;
        }

        if (_this.timedout && _this.timedoutError) {
          reject(_this.timedoutError);
          return;
        }

        var err = new Error('Aborted');
        err.code = 'ABORTED';
        err.status = _this.status;
        err.method = _this.method;
        err.url = _this.url;
        reject(err);
      });
      self.end(function (err, res) {
        if (err) reject(err);else resolve(res);
      });
    });
  }

  return this._fullfilledPromise.then(resolve, reject);
};

RequestBase.prototype.catch = function (cb) {
  return this.then(undefined, cb);
};
/**
 * Allow for extension
 */


RequestBase.prototype.use = function (fn) {
  fn(this);
  return this;
};

RequestBase.prototype.ok = function (cb) {
  if (typeof cb !== 'function') throw new Error('Callback required');
  this._okCallback = cb;
  return this;
};

RequestBase.prototype._isResponseOK = function (res) {
  if (!res) {
    return false;
  }

  if (this._okCallback) {
    return this._okCallback(res);
  }

  return res.status >= 200 && res.status < 300;
};
/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */


RequestBase.prototype.get = function (field) {
  return this._header[field.toLowerCase()];
};
/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */


RequestBase.prototype.getHeader = RequestBase.prototype.get;
/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function (field, val) {
  if (isObject(field)) {
    for (var key in field) {
      if (Object.prototype.hasOwnProperty.call(field, key)) this.set(key, field[key]);
    }

    return this;
  }

  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};
/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field field name
 */


RequestBase.prototype.unset = function (field) {
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};
/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name name of field
 * @param {String|Blob|File|Buffer|fs.ReadStream} val value of field
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.field = function (name, val) {
  // name should be either a string or an object.
  if (name === null || undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (this._data) {
    throw new Error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObject(name)) {
    for (var key in name) {
      if (Object.prototype.hasOwnProperty.call(name, key)) this.field(key, name[key]);
    }

    return this;
  }

  if (Array.isArray(val)) {
    for (var i in val) {
      if (Object.prototype.hasOwnProperty.call(val, i)) this.field(name, val[i]);
    }

    return this;
  } // val should be defined now


  if (val === null || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }

  if (typeof val === 'boolean') {
    val = String(val);
  }

  this._getFormData().append(name, val);

  return this;
};
/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request} request
 * @api public
 */


RequestBase.prototype.abort = function () {
  if (this._aborted) {
    return this;
  }

  this._aborted = true;
  if (this.xhr) this.xhr.abort(); // browser

  if (this.req) this.req.abort(); // node

  this.clearTimeout();
  this.emit('abort');
  return this;
};

RequestBase.prototype._auth = function (user, pass, options, base64Encoder) {
  switch (options.type) {
    case 'basic':
      this.set('Authorization', "Basic ".concat(base64Encoder("".concat(user, ":").concat(pass))));
      break;

    case 'auto':
      this.username = user;
      this.password = pass;
      break;

    case 'bearer':
      // usage would be .auth(accessToken, { type: 'bearer' })
      this.set('Authorization', "Bearer ".concat(user));
      break;

    default:
      break;
  }

  return this;
};
/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */


RequestBase.prototype.withCredentials = function (on) {
  // This is browser-only functionality. Node side is no-op.
  if (on === undefined) on = true;
  this._withCredentials = on;
  return this;
};
/**
 * Set the max redirects to `n`. Does nothing in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.redirects = function (n) {
  this._maxRedirects = n;
  return this;
};
/**
 * Maximum size of buffered response body, in bytes. Counts uncompressed size.
 * Default 200MB.
 *
 * @param {Number} n number of bytes
 * @return {Request} for chaining
 */


RequestBase.prototype.maxResponseSize = function (n) {
  if (typeof n !== 'number') {
    throw new TypeError('Invalid argument');
  }

  this._maxResponseSize = n;
  return this;
};
/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */


RequestBase.prototype.toJSON = function () {
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};
/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */
// eslint-disable-next-line complexity


RequestBase.prototype.send = function (data) {
  var isObj = isObject(data);
  var type = this._header['content-type'];

  if (this._formData) {
    throw new Error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObj && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw new Error("Can't merge these send calls");
  } // merge


  if (isObj && isObject(this._data)) {
    for (var key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) this._data[key] = data[key];
    }
  } else if (typeof data === 'string') {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];

    if (type === 'application/x-www-form-urlencoded') {
      this._data = this._data ? "".concat(this._data, "&").concat(data) : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!isObj || this._isHost(data)) {
    return this;
  } // default to json


  if (!type) this.type('json');
  return this;
};
/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.sortQuery = function (sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};
/**
 * Compose querystring to append to req.url
 *
 * @api private
 */


RequestBase.prototype._finalizeQueryString = function () {
  var query = this._query.join('&');

  if (query) {
    this.url += (this.url.includes('?') ? '&' : '?') + query;
  }

  this._query.length = 0; // Makes the call idempotent

  if (this._sort) {
    var index = this.url.indexOf('?');

    if (index >= 0) {
      var queryArr = this.url.slice(index + 1).split('&');

      if (typeof this._sort === 'function') {
        queryArr.sort(this._sort);
      } else {
        queryArr.sort();
      }

      this.url = this.url.slice(0, index) + '?' + queryArr.join('&');
    }
  }
}; // For backwards compat only


RequestBase.prototype._appendQueryString = function () {
  console.warn('Unsupported');
};
/**
 * Invoke callback with timeout error.
 *
 * @api private
 */


RequestBase.prototype._timeoutError = function (reason, timeout, errno) {
  if (this._aborted) {
    return;
  }

  var err = new Error("".concat(reason + timeout, "ms exceeded"));
  err.timeout = timeout;
  err.code = 'ECONNABORTED';
  err.errno = errno;
  this.timedout = true;
  this.timedoutError = err;
  this.abort();
  this.callback(err);
};

RequestBase.prototype._setTimeouts = function () {
  var self = this; // deadline

  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function () {
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  } // response timeout


  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function () {
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
};

},{"./is-object":39}],41:[function(require,module,exports){
"use strict";

/**
 * Module dependencies.
 */
var utils = require('./utils');
/**
 * Expose `ResponseBase`.
 */


module.exports = ResponseBase;
/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase(obj) {
  if (obj) return mixin(obj);
}
/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */


function mixin(obj) {
  for (var key in ResponseBase.prototype) {
    if (Object.prototype.hasOwnProperty.call(ResponseBase.prototype, key)) obj[key] = ResponseBase.prototype[key];
  }

  return obj;
}
/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */


ResponseBase.prototype.get = function (field) {
  return this.header[field.toLowerCase()];
};
/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */


ResponseBase.prototype._setHeaderProperties = function (header) {
  // TODO: moar!
  // TODO: make this a util
  // content-type
  var ct = header['content-type'] || '';
  this.type = utils.type(ct); // params

  var params = utils.params(ct);

  for (var key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) this[key] = params[key];
  }

  this.links = {}; // links

  try {
    if (header.link) {
      this.links = utils.parseLinks(header.link);
    }
  } catch (_unused) {// ignore
  }
};
/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */


ResponseBase.prototype._setStatusProperties = function (status) {
  var type = status / 100 | 0; // status / class

  this.statusCode = status;
  this.status = this.statusCode;
  this.statusType = type; // basics

  this.info = type === 1;
  this.ok = type === 2;
  this.redirect = type === 3;
  this.clientError = type === 4;
  this.serverError = type === 5;
  this.error = type === 4 || type === 5 ? this.toError() : false; // sugar

  this.created = status === 201;
  this.accepted = status === 202;
  this.noContent = status === 204;
  this.badRequest = status === 400;
  this.unauthorized = status === 401;
  this.notAcceptable = status === 406;
  this.forbidden = status === 403;
  this.notFound = status === 404;
  this.unprocessableEntity = status === 422;
};

},{"./utils":42}],42:[function(require,module,exports){
"use strict";

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */
exports.type = function (str) {
  return str.split(/ *; */).shift();
};
/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */


exports.params = function (str) {
  return str.split(/ *; */).reduce(function (obj, str) {
    var parts = str.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();
    if (key && val) obj[key] = val;
    return obj;
  }, {});
};
/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */


exports.parseLinks = function (str) {
  return str.split(/ *, */).reduce(function (obj, str) {
    var parts = str.split(/ *; */);
    var url = parts[0].slice(1, -1);
    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
    obj[rel] = url;
    return obj;
  }, {});
};
/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */


exports.cleanHeader = function (header, changesOrigin) {
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header.host; // secuirty

  if (changesOrigin) {
    delete header.authorization;
    delete header.cookie;
  }

  return header;
};

},{}],43:[function(require,module,exports){
var STC = require("space_tycoon_client")
var hashInt = require("hash-int")

STC.ApiClient.instance.basePath = "../"
STC.ApiClient.instance.enableCookies = true
console.log(STC)

var currentTick = new STC.CurrentTick()
var staticData
var zoom
var graphsOptions = {}

function bignum(n) {
	if (!n)
		return n
	let exponents = ["", "K", "M", "G", "T", "P", "E"]
	let i = 0
	while (n >= 1000) {
		n /= 1000
		i++
	}
	return n.toFixed(0) + exponents[i]
}

function colorToRgb(c) {
	return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")"
}

function hsvToRgb (h, s, b) {
	// input range: 360, 100, 100
	// output range: 256, 256, 256
	s /= 100
	b /= 100
	let k = (n) => (n + h / 60) % 6
	let f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)))
	return [255 * f(5), 255 * f(3), 255 * f(1)]
}

function updateResourcesColors() {
	let num = Object.keys(staticData.resourceNames).length
	let index = 0
	staticData.resourceColors = {}
	for (let rid of Object.keys(staticData.resourceNames)) {
		staticData.resourceColors[rid] = colorToRgb(hsvToRgb(index * 360 / num, 100, 100))
		index += 1
	}
}

function parseCookies() {
	let c = document.cookie
	if (c == "")
		return {}
	return document.cookie
	.split(";")
	.map(v => v.split("="))
	.reduce((acc, v) => {
		acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim())
		return acc
	}, {})
}

function last(p) {
	// returns last element of an array
	return p[Object.keys(p)[Object.keys(p).length - 1]]
}

function generateObjects(data) {
	data.objects = {}

	for (let pid of Object.keys(data.planets)) {
		let p = data.planets[pid]
		p.id = pid
		p.data = data
		data.objects[pid] = p
	}

	if (typeof data["wrecks"] !== "undefined") {
		for (let wid of Object.keys(data.wrecks)) {
			let w = data.wrecks[wid]
			w.id = wid
			w.data = data
			data.objects[wid] = w
			if (typeof w.prevPosition === "undefined") {
				w.prevPosition = w.position
			}
		}
	}

	for (let sid of Object.keys(data.ships)) {
		let s = data.ships[sid]
		s.id = sid
		s.data = data
		data.objects[sid] = s
	}

}

function positionIsEqual(pos1, pos2) {
	return pos1[0] === pos2[0] && pos1[1] === pos2[1]
}

function getObjectsOnPosition(data, pos) {
	let objects = []

	for (let pid of Object.keys(data.planets)) {
		let p = data.planets[pid]
		if (positionIsEqual(p.position, pos)) {
			objects.push(p)
		}
	}
	for (let sid of Object.keys(data.ships)) {
		let s = data.ships[sid]
		if (positionIsEqual(s.position, pos)) {
			objects.push(s)
		}
	}
	if (typeof data["wrecks"] !== "undefined") {
		for (let wid of Object.keys(data.wrecks)) {
			let w = data.wrecks[wid]
			if (positionIsEqual(w.position, pos)) {
				objects.push(w)
			}
		}
	}
	return objects
}

//////////////////////////////////////////
// map
//////////////////////////////////////////

function mapHandleZoom(e) {
	d3.selectAll("#panzoom")
	.attr("transform", e.transform)

	modalClose()
}

function modalClose() {
	d3.select("#modalContainer")
	.style("display", "none")
}

function drawModal(e, d) {
	let t = ""
	if (typeof d.shipClass !== "undefined") {
		let c = staticData.shipClasses[d.shipClass]
		t += "<hr>"
		t += "<table>"
		t += "<tr><td>Owner:<td>" + d.data.players[d.player].name
		t += "<tr><td>Class:<td>" + c.name
		if (typeof d["life"] !== "undefined") {
			t += "<tr><td>Life:<td>" + d.life + " / " + c.life
		}
		t += "</table>"
		if (typeof d.command !== "undefined") {
			t += "<hr>"
			t += "<table>"
			t += "<tr><td>Command:<td>" + d.command.type
			if (typeof d.command.target !== "undefined") {
				let o = d.data.objects[d.command.target]
				if (typeof o !== "undefined") {
					t += "<tr><td>Target:<td>" + o.name + " &lt;" + o.position + "&gt;"
				} else {
					t += "<tr><td>Target:<td>" + d.command.target
				}
			}
			// todo coordinates instead of target
			if (typeof d.command.resource !== "undefined") {
				t += "<tr><td>Resource:<td>" + staticData.resourceNames[d.command.resource]
			}
			if (typeof d.command.amount !== "undefined") {
				t += "<tr><td>Amount:<td class=\"amount\">" + d.command.amount
			}
			if (typeof d.command["class"] !== "undefined") {
				t += "<tr><td>Class:<td>" + staticData.shipClasses[d.command["class"]].name
			}
			t += "</table>"
		}
	}

	if (typeof d["resources"] !== "undefined" && Object.keys(d.resources).length > 0) {
		t += "<hr>"
		t += "<table class=\"commodities\">"
		if (!d.shipClass) {
			t += "<tr><td><td>Available<td>Buy price<td>Sell price"
		}
		for (let rid of Object.keys(d.resources)) {
			let r = d.resources[rid]
			t += "<tr><td>" + staticData.resourceNames[rid] + ": <td class=\"amount\">" + (bignum(r.amount) || "") + "<td class=\"buy\">" + (bignum(r.buyPrice) || "") + "<td class=\"sell\">" + (bignum(r.sellPrice) || "")
		}
		t += "</table>"
	}

	// window contents
	let titleHtml = "<span style=\"float: left\">" + d.name + "</span><span style=\"float: right\">&lt;" + d.position + "&gt;</span><div style=\"clear: both\"></div>"
	let title = "<div class=\"modalTitle\">" + titleHtml + "</div>"
	let info = "<div class=\"modalInfo\">" + t + "</div>"

	// window itself
	let html = "<div class=\"modalWindowItem\">" + title + info + "</div>"

	return html
}

function clickInfo(e) {
	let d = this["__data__"]
	let objects = getObjectsOnPosition(d.data, d.position)

	let html = ""
	// draw clicked object first
	html += drawModal(e, d)
	for (let i = 0; i < objects.length; i++) {
		if (d.id == objects[i].id) {
			// skip drawing clicked object (its already drawn)
			continue
		}
		html += drawModal(e, objects[i])
	}
	let style = "left: " + e.x + "px; top: " + e.y + "px;"
	let finalHtml = "<div class=\"modalWindow\" style=\"" + style + "\">" + html + "</div>"

	d3.select("#modalContainer")
	.html(finalHtml)
	.style("display", "block")
	.on("click", modalClose)
}

function planetColor(d) {
	let h1 = hashInt(d.id)
	let h2 = hashInt(h1 + 123)
	let h3 = hashInt(h2 + 741)
	let c = [ h1 % 20 + 120, h2 % 20 + 120, h3 % 20 + 120 ]
	return colorToRgb(c)
}

function wreckColor(d) {
	let c = d.data.players[d.player].color
	return colorToRgb([ c[0] * 0.2, c[1] * 0.2, c[2] * 0.2 ])
}

function shipColor(d) {
	let c = d.data.players[d.player].color
	return colorToRgb(c)
}

function shipHref(d) {
	return "#class-" + staticData.shipClasses[d.shipClass].name
}

function mapRedraw(data) {
	generateObjects(data)

	let planets = []
	for (let pid of Object.keys(data.planets)) {
		planets.push(data.planets[pid])
	}

	d3.select("#planets")
	.selectAll(".planet")
	.data(planets, d => d.id)
	.join("circle")
	.classed("planet", true)
	.on("click", clickInfo)
	.html(d => "<title>" + d.name + "</title>")
	.attr("fill", planetColor)
	.attr("r", 7)
	.attr("cx", d => d.position[0])
	.attr("cy", d => d.position[1])

	let wrecks = []
	if (typeof data["wrecks"] !== "undefined") {
		for (let wid of Object.keys(data.wrecks)) {
			wrecks.push(data.wrecks[wid])
		}
	}

	d3.select("#wrecks")
	.selectAll(".wreck")
	.data(wrecks, d => d.id)
	.join("circle")
	.classed("wreck", true)
	.on("click", clickInfo)
	.html(d => "<title>" + d.name + "</title>")
	.attr("fill", wreckColor)
	.attr("r", 4)
	.attr("cx", d => d.position[0])
	.attr("cy", d => d.position[1])

	let ships = []
	for (let sid of Object.keys(data.ships)) {
		ships.push(data.ships[sid])
	}

	let shipsPositions = function(sel) {
		return sel
		.attr("x", d => d.position[0])
		.attr("y", d => d.position[1])
	}

	d3.select("#ships")
	.selectAll(".ship")
	.data(ships, d => d.id)
	.join(function(enter) {
		return enter
		.append("use")
		.call(shipsPositions)
	})
	.classed("ship", true)
	.on("click", clickInfo)
	.html(d => "<title>" + d.name + "</title>")
	.attr("href", shipHref)
	.attr("fill", shipColor)
	.transition()
	.duration(1000)
	.ease(d3.easeLinear)
	.call(shipsPositions)

	let lines = []
	for (let sid of Object.keys(data.ships)) {
		let s = data.ships[sid]
		if (typeof s.command !== "undefined") {
			let o = data.objects[s.command.target]
			if (typeof o !== "undefined") {
				let l = {}
				l.id = s.id
				l.ship = s
				l.target = o
				lines.push(l)
			}
		}
	}

	let linesPositions = function(sel) {
		return sel
		.attr("x1", d => d.ship.position[0])
		.attr("y1", d => d.ship.position[1])
		.attr("x2", d => d.target.position[0])
		.attr("y2", d => d.target.position[1])
	}

	d3.select("#lines")
	.selectAll(".line")
	.data(lines, d => d.id)
	.join(function(enter) {
		return enter
		.append("line")
		.call(linesPositions)
	})
	.classed("line", true)
	.transition()
	.duration(1000)
	.ease(d3.easeLinear)
	.call(linesPositions)

	if (typeof data.playerId !== "undefined") {
		let ps = data.players[data.playerId].netWorth
		d3.select("#playerInfo")
		.html("Ships: " + bignum(ps.ships) + ", Commodities: " + bignum(ps.resources) + ", Money: " + bignum(ps.money) + ", Total: " + bignum(ps.total))
	} else {
		d3.select("#playerInfo")
		.html("")
	}

	let players = []
	for (let pid of Object.keys(data.players)) {
		let p = data.players[pid]
		p.id = pid
		players.push(p)
	}
	players.sort((a, b) => d3.descending(a.netWorth.total, b.netWorth.total))

	d3.select("#playersOverlay")
	.selectAll("tr")
	.data(players, d => d.id)
	.join("tr")
	.html(d => "<td>" + d.name + "<td>" + bignum(d.netWorth.total))
	.style("color", d => colorToRgb(d.color))
}

function spawnBeam(attacker, defender) {
	d3.select("#particles")
	.append("line")
	.classed("beam", true)
	.attr("x1", attacker.prevPosition[0])
	.attr("y1", attacker.prevPosition[1])
	.attr("x2", defender.prevPosition[0] + (Math.random() - 0.5) * 3)
	.attr("y2", defender.prevPosition[1] + (Math.random() - 0.5) * 3)
	.attr("opacity", 0.7)
	.transition()
	.duration(500)
	.ease(d3.easeCubicOut)
	.attr("opacity", 0)
	.remove()
}

function spawnParticles(pos, cnt) {
	for (let i = 0; i < cnt; i++) {
		let x1 = pos[0] + (Math.random() - 0.5) * (Math.random() + 0.5) * 5
		let y1 = pos[1] + (Math.random() - 0.5) * (Math.random() + 0.5) * 5
		let x2 = pos[0] + (Math.random() - 0.5) * (Math.random() + 0.5) * 20
		let y2 = pos[1] + (Math.random() - 0.5) * (Math.random() + 0.5) * 20
		let r1 = Math.floor(Math.random() * 360)
		let r2 = Math.floor(Math.random() * 360)
		let s1 = Math.random() + 0.5
		d3.select("#particles")
		.append("use")
		.attr("href", "#particle-" + Math.floor(Math.random() * 3))
		.attr("class", "particle particle-" + Math.floor(Math.random() * 3))
		.attr("transform", "translate(" + x1 + "," + y1 + ") rotate(" + r1 + ") scale(" + s1 + ")")
		.attr("opacity", 1)
		.transition()
		.duration(1000 + Math.random() * 2000)
		.ease(d3.easeCubicOut)
		.attr("transform", "translate(" + x2 + "," + y2 + ") rotate(" + r2 + ") scale(" + s1 + ")")
		.attr("opacity", Math.random() * 0.2 + 0.1)
		.remove()
	}
}

function spawnBloom(pos, radius, id) {
	d3.select("#blooms")
	.append("circle")
	.attr("fill", "url(#" + id + ")")
	.attr("cx", pos[0])
	.attr("cy", pos[1])
	.attr("r", radius)
	.attr("opacity", 1)
	.transition()
	.duration(500)
	.ease(d3.easeCubicOut)
	.attr("r", radius * 2)
	.attr("opacity", 0)
	.remove()
}

function spawnAttack(attacker, defender) {
	spawnBeam(attacker, defender)
	spawnParticles(defender.prevPosition, 3)
	spawnBloom(defender.prevPosition, 25, "attackBloomGrad")
}

function spawnKill(attacker, defender) {
	spawnBeam(attacker, defender)
	spawnParticles(defender.prevPosition, 20)
	spawnBloom(defender.prevPosition, 80, "killBloomGrad")
}

function spawnText(pos, direction, color, text, classes) {
	let x = pos[0] + direction[0] * 10
	let y = pos[1] + direction[1] * 10
	d3.select("#trades")
	.append("text")
	.text(text)
	.attr("class", classes)
	.attr("fill", color)
	.attr("x", x)
	.attr("y", y)
	.attr("opacity", 1)
	.transition()
	.duration(5000)
	.ease(d3.easeQuadOut)
	.attr("x", x + direction[0] * 20)
	.attr("y", y + direction[1] * 20)
	.attr("opacity", 1)
	.transition()
	.duration(1500)
	.attr("opacity", 0)
	.remove()
}

function spawnTrade(data, tr) {
	let p1 = data.objects[tr.buyer].player
	let p2 = data.objects[tr.seller].player
	let pl = p1 || p2
	if (typeof pl == "undefined")
		return
	let pos = data.objects[pl == p1 ? tr.buyer : tr.seller].position
	let c = colorToRgb(data.players[pl].color)
	let rn = staticData.resourceNames[tr.resource]
	spawnText(pos, [0, pl == p1 ? 1 : -1], c, (pl == p1 ? "-" : "+") + tr.price, "trade-price")
	spawnText(pos, [1, 0], c, (pl == p1 ? "+" : "-") + rn, "trade-name")
}

function mapEvents(data) {
	if (typeof data.reports["combat"] !== "undefined") {
		for (let c of data.reports.combat) {
			if (typeof c["killed"] !== "undefined" && c.killed)
				spawnKill(data.objects[c.attacker], data.objects[c.defender])
			else
				spawnAttack(data.objects[c.attacker], data.objects[c.defender])
		}
	}
	if (typeof data.reports["trade"] !== "undefined") {
		for (let tr of data.reports.trade) {
			spawnTrade(data, tr)
		}
	}
}

function mapRefresh() {
	if (!staticData) {
		(new STC.GameApi()).staticDataGet({}, function(error, data, response) {
			if (error) {
				d3.select("#tickInfo").text(error)
			} else {
				staticData = data
			}
		})
	}

	(new STC.GameApi()).dataGet({}, function(error, data, response) {
		if (error) {
			d3.select("#tickInfo").text(error)
		} else {
			if (staticData) {
				if ((typeof data.playerId !== "undefined") && (typeof data.players[data.playerId] === "undefined")) {
					delete data.playerId // the supposedly logged-in player does not exist
				}
				mapRedraw(data)
				mapEvents(data)
			}
		}
	})
}

function mapTimerLoop() {
	if (document.visibilityState === "visible") {
		(new STC.GameApi()).currentTickGet(function(error, data, response) {
			if (error) {
				setTimeout(mapTimerLoop, 1000)
				d3.select("#tickInfo").text(error)
			} else {
				setTimeout(mapTimerLoop, data.minTimeLeftMs || 300)
				if (currentTick.tick != data.tick) {
					d3.select("#tickInfo").text("Season: " + data.season + ", Tick: " + data.tick)
					currentTick = data
					mapRefresh()
				}
			}
		})
	} else {
		setTimeout(mapTimerLoop, 1000)
	}
}

function mapStartLoop() {
	let size = d3.select("#themap").node().getBoundingClientRect()
	zoom = d3.zoom()
	.on("zoom", mapHandleZoom)
	d3.select("#themap")
	.call(zoom)
	.call(zoom.transform, d3.zoomIdentity.translate(size.width / 2, size.height / 2).scale(Math.min(size.width, size.height) / 3000))

	let cookies = parseCookies()
	let playerid = cookies.playerId || -1
	if (playerid > 0) {
		d3.select("#userInfo").node().innerHTML = "<a href=\"logout.htm\">Log out</a> Player id: " + playerid + ", "
	}

	d3.select("#tickInfo").text("Connecting...")
	setTimeout(mapTimerLoop, 0)
}

window.initializeMap = function() {
	setTimeout(mapStartLoop, 0)
}

//////////////////////////////////////////
// graphs
//////////////////////////////////////////

function graphsHandleZoom(e) {
	d3.selectAll("#panzoom")
	.attr("transform", e.transform)
}

function filterLinePoints(values) {
	if (values.length < 10)
		return values
	let res = [ values[0] ]
	let buf = []
	for (let p of values) {
		buf.push(p)
		if (buf.length == 3) {
			if (buf[0][1] != buf[1][1] || buf[1][1] != buf[2][1]) {
				res.push(buf[1])
			}
			buf.shift()
		}
	}
	res.push(buf[1])
	return res
}

function multiLineGraph(lines, legends) {
	for (let k of Object.keys(lines))
		lines[k].values = filterLinePoints(lines[k].values)

	let size = d3.select("#thegraph").node().getBoundingClientRect()

	let xMin = d3.min(lines, l => d3.min(l.values, p => p[0]))
	let xMax = d3.max(lines, l => d3.max(l.values, p => p[0]))
	let xScale = d3.scaleLinear().domain([xMin, xMax]).range([20, size.width - 10])
	let xAxis = d3.axisBottom().scale(xScale).ticks(10)
	d3.select("#xaxis").call(xAxis)

	let yMin = d3.min(lines, l => d3.min(l.values, p => p[1]))
	let yMax = d3.max(lines, l => d3.max(l.values, p => p[1]))
	let yScale = d3.scaleLinear().domain([yMax, yMin]).range([35, size.height - 10])
	let yAxis = d3.axisRight().scale(yScale).ticks(10)
	d3.select("#yaxis").call(yAxis)

	d3.select("#graphdata")
	.selectAll(".line")
	.data(lines, d => d.id)
	.join("path")
	.attr("class", d => d.classes)
	.attr("stroke", d => d.color)
	.attr("d", d => d3.line()
		.x(p => xScale(p[0]))
		.y(p => yScale(p[1]))
		(d.values)
	)

	if (legends) {
		d3.select("#legend")
		.selectAll(".legend")
		.data(legends, d => d.id)
		.join("text")
		.classed("legend", true)
		.text(d => d.name)
		.attr("fill", d => d.color)
		.attr("x", size.width - 15)
		.transition()
		.duration(1000)
		.attr("y", d => yScale(d.value) - 3)
	} else {
		d3.select("#legend")
		.selectAll(".legend")
		.remove()
	}
}

function prefixAccumulate(res) {
	for (let k of Object.keys(res)) {
		let values = res[k]
		let add = 0
		for (let i of Object.keys(values)) {
			let tmp = values[i]
			values[i] += add
			add += tmp
		}
	}
}

function graphsRedrawPlayers(data, enabled) {
	let lines = []
	let legends = []
	for (let sid of Object.keys(data.scores)) {
		let s = data.scores[sid]
		let name = data.world.players[sid].name
		let color = colorToRgb(data.world.players[sid].color)

		function category(key) {
			let m = {}
			m.id = key + "-" + sid
			m.name = name
			m.color = color
			m.classes = "line line-" + key
			m.values = []
			for (let x of Object.keys(s[key]))
				m.values.push([ parseInt(x), s[key][x] ])
			lines.push(m)
		}

		let l = {}
		l.id = sid
		l.name = name
		l.color = color

		if (enabled[0]) {
			l.value = last(s.resources)
			category("resources")
		}
		if (enabled[1]) {
			l.value = last(s.ships)
			category("ships")
		}
		if (enabled[2]) {
			l.value = last(s.money)
			category("money")
		}
		if (enabled[3]) {
			l.value = last(s.total)
			category("total")
		}

		legends.push(l)
	}
	multiLineGraph(lines, legends)
}

function graphsRedrawDamage(data, attackerMultiplier, defenderMultiplier) {
	let res = {}
	for (let sid of Object.keys(data.scores)) {
		res[sid] = {}
		for (let k of Object.keys(data.scores[sid].total))
			res[sid][k] = 0
	}
	if ((typeof data["combat"] !== "undefined") && data.combat) {
		for (let c of Object.values(data.combat)) {
			let a = data.world.objects[c.attacker]
			let d = data.world.objects[c.defender]
			let dmg = staticData.shipClasses[a.shipClass].damage
			res[a.player][c.tick] += dmg * attackerMultiplier
			res[d.player][c.tick] += dmg * defenderMultiplier
		}
	}
	prefixAccumulate(res)

	let lines = []
	let legends = []
	for (let sid of Object.keys(res)) {
		let s = res[sid]
		let name = data.world.players[sid].name
		let color = colorToRgb(data.world.players[sid].color)

		let m = {}
		m.id = sid
		m.name = name
		m.color = color
		m.classes = "line"
		m.values = []
		for (let x of Object.keys(s))
			m.values.push([ parseInt(x), s[x] ])
		lines.push(m)

		let l = {}
		l.id = sid
		l.name = name
		l.color = color
		l.value = last(s)
		legends.push(l)
	}
	multiLineGraph(lines, legends)
}

function graphsRedrawResourcesPrices(data) {
	let lines = []
	let legends = []
	for (let rid of Object.keys(data.prices)) {
		let p = data.prices[rid]
		let name = staticData.resourceNames[rid]
		let color = staticData.resourceColors[rid]

		let m = {}
		m.id = rid
		m.name = name
		m.color = color
		m.classes = "line"
		m.values = []
		for (let x of Object.keys(p))
			m.values.push([ parseInt(x), p[x] ])
		lines.push(m)

		let l = {}
		l.id = rid
		l.name = name
		l.color = color
		l.value = last(p)
		legends.push(l)
	}
	multiLineGraph(lines, legends)
}

function graphsRedrawResourcesAmounts(data) {
	let lines = []
	let legends = []
	for (let rid of Object.keys(data.resourceAmounts)) {
		let p = data.resourceAmounts[rid]
		let name = staticData.resourceNames[rid]
		let color = staticData.resourceColors[rid]

		let m = {}
		m.id = rid
		m.name = name
		m.color = color
		m.classes = "line"
		m.values = []
		for (let x of Object.keys(p))
			m.values.push([ parseInt(x), p[x] ])
		lines.push(m)

		let l = {}
		l.id = rid
		l.name = name
		l.color = color
		l.value = last(p)
		legends.push(l)
	}
	multiLineGraph(lines, legends)
}

function graphsRedrawResourcesTotals(data) {
	let lines = []
	let legends = []
	for (let rid of Object.keys(data.prices)) {
		let p = data.prices[rid]
		let a = data.resourceAmounts[rid]
		let name = staticData.resourceNames[rid]
		let color = staticData.resourceColors[rid]

		let m = {}
		m.id = rid
		m.name = name
		m.color = color
		m.classes = "line"
		m.values = []
		for (let x of Object.keys(p))
			m.values.push([ parseInt(x), p[x] * a[x] ])
		lines.push(m)

		let l = {}
		l.id = rid
		l.name = name
		l.color = color
		l.value = last(p) * last(a)
		legends.push(l)
	}
	multiLineGraph(lines, legends)
}

function graphsRedrawResourcesVolumes(data) {
	let res = {}
	for (let rid of Object.keys(data.prices)) {
		res[rid] = {}
		for (let k of Object.keys(data.prices[rid]))
			res[rid][k] = 0
	}
	if (typeof data["trade"] !== "undefined" && data.trade) {
		for (let tr of Object.values(data.trade)) {
			res[tr.resource][tr.tick] += tr.amount
		}
	}
	prefixAccumulate(res)

	let lines = []
	let legends = []
	for (let rid of Object.keys(res)) {
		let p = res[rid]
		let name = staticData.resourceNames[rid]
		let color = staticData.resourceColors[rid]

		let m = {}
		m.id = rid
		m.name = name
		m.color = color
		m.classes = "line"
		m.values = []
		for (let x of Object.keys(p))
			m.values.push([ parseInt(x), p[x] ])
		lines.push(m)

		let l = {}
		l.id = rid
		l.name = name
		l.color = color
		l.value = last(p)
		legends.push(l)
	}
	multiLineGraph(lines, legends)
}

function graphsRedrawSeasons(data, weighted) {
	let lines = []
	let legends = []
	if (typeof data["seasonScores"] !== "undefined") {
		for (let sid of Object.keys(data.seasonScores)) {
			let s = data.seasonScores[sid]
			let name = data.world.players[sid].name
			let color = colorToRgb(data.world.players[sid].color)

			let m = {}
			m.id = sid
			m.name = name
			m.color = color
			m.classes = "line"
			m.values = []
			let lst = 0
			if (weighted) {
				let sum = 0
				for (let x of Object.keys(s)) {
					let k = parseInt(x)
					sum += k * s[x]
					let div = (k + 1) * k / 2
					lst = sum / div
					m.values.push([ k, lst ])
				}
			} else {
				for (let x of Object.keys(s)) {
					lst = s[x]
					m.values.push([ parseInt(x), s[x] ])
				}
			}
			lines.push(m)

			let l = {}
			l.id = sid
			l.name = name
			l.color = color
			l.value = lst
			legends.push(l)
		}
	}
	multiLineGraph(lines, legends)
}

function graphsRefresh(data) {
	if (!staticData) {
		(new STC.GameApi()).staticDataGet({}, function(error, data, response) {
			if (error) {
				d3.select("#tickInfo").text(error)
			} else {
				staticData = data
				updateResourcesColors()
			}
		})
	}

	(new STC.GameApi()).dataGet({}, function(error, world, response) {
		if (error) {
			d3.select("#tickInfo").text(error)
		} else {
			generateObjects(world)
			data.world = world
			if (staticData) {
				if (graphsOptions.type == "players")
					graphsRedrawPlayers(data, [true, true, true, true])
				else if (graphsOptions.type == "players-total")
					graphsRedrawPlayers(data, [false, false, false, true])
				else if (graphsOptions.type == "players-money")
					graphsRedrawPlayers(data, [false, false, true, false])
				else if (graphsOptions.type == "players-resources")
					graphsRedrawPlayers(data, [true, false, false, false])
				else if (graphsOptions.type == "damage-dealt")
					graphsRedrawDamage(data, 1, 0)
				else if (graphsOptions.type == "damage-received")
					graphsRedrawDamage(data, 0, 1)
				else if (graphsOptions.type == "damage-difference")
					graphsRedrawDamage(data, 1, -1)
				else if (graphsOptions.type == "resources-prices")
					graphsRedrawResourcesPrices(data)
				else if (graphsOptions.type == "resources-amounts")
					graphsRedrawResourcesAmounts(data)
				else if (graphsOptions.type == "resources-totals")
					graphsRedrawResourcesTotals(data)
				else if (graphsOptions.type == "resources-volumes")
					graphsRedrawResourcesVolumes(data)
				else if (graphsOptions.type == "seasons-raw")
					graphsRedrawSeasons(data, false)
				else if (graphsOptions.type == "seasons-weigthed")
					graphsRedrawSeasons(data, true)
			}
		}
	})
}

function graphsTimerLoop() {
	setTimeout(graphsTimerLoop, 1000)
	if (document.visibilityState === "visible") {
		(new STC.GameApi()).reportsGet({}, function(error, data, response) {
			if (error) {
				d3.select("#tickInfo").text(error)
			} else {
				d3.select("#tickInfo").text("Season: " + data.season + ", Tick: " + data.tick)
				if (data.season != currentTick.season) {
					staticData = undefined
					currentTick.season = data.season
				}
				graphsRefresh(data)
			}
		})
	}
}

function graphsStartLoop() {
	d3.select("#tickInfo").text("Connecting...")

	zoom = d3.zoom().on("zoom", mapHandleZoom)
	d3.select("#thegraph").call(zoom)

	graphsOptions.type = "players"
	d3.select("#graphSelect").on("change", function(e) {
		d3.select("#thegraph").call(zoom.transform, d3.zoomIdentity)
		graphsOptions.type = e.target.value
	})

	setTimeout(graphsTimerLoop, 0)
}

window.initializeGraphs = function() {
	setTimeout(graphsStartLoop, 0)
}

//////////////////////////////////////////
// user
//////////////////////////////////////////

function registrationValidate(which) {
	let u = d3.select("#reg_username").node().value
	let p1 = d3.select("#reg_password").node().value
	let p2 = d3.select("#reg_password2").node().value
	if (u.length <= 2 || u.length >= 30) {
		d3.select("#response").text("invalid user name")
		return false
	}
	if (p1.length <= 2 || p1.length >= 100) {
		d3.select("#response").text("invalid password")
		return false
	}
	if (p1 != p2) {
		d3.select("#response").text("passwords do not match")
		return false
	}
	d3.select("#response").text("")
	return true
}

function registrationSubmit() {
	if (!registrationValidate(-1))
		return
	d3.json(STC.ApiClient.instance.basePath + "create-user", {
		method: "POST",
		body: JSON.stringify({
			username: d3.select("#reg_username").node().value,
			password: d3.select("#reg_password").node().value
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	})
	.then(json => {
		d3.select("#response").text(JSON.stringify(json))
	})
	.catch(err => {
		d3.select("#response").text(err)
	})
}

function loginValidate(which) {
	let u = d3.select("#login_username").node().value
	let ps = d3.select("#login_password").node().value
	if (u.length == 0) {
		d3.select("#response").text("invalid user name")
		return false
	}
	if (ps.length == 0) {
		d3.select("#response").text("invalid password")
		return false
	}
	d3.select("#response").text("")
	return true
}

function loginSubmit() {
	if (!loginValidate(-1))
		return
	d3.json(STC.ApiClient.instance.basePath + "login?persistent=1", {
		method: "POST",
		body: JSON.stringify({
			username: d3.select("#login_username").node().value,
			password: d3.select("#login_password").node().value
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		},
		credentials: "include"
	})
	.then(json => {
		d3.select("#response").text(JSON.stringify(json))
		document.cookie = "player-id=" + json.id + "; path=/";
	})
	.catch(err => {
		d3.select("#response").text(err)
	})
}

function logoutSubmit() {
	document.cookie = "player-id=; expires= Thu, 21 Aug 2014 20:00:00 UTC; path=/"
	d3.json(STC.ApiClient.instance.basePath + "logout", { credentials: "include" })
	.then(json => {
		d3.select("#response").text(JSON.stringify(json))
	})
	.catch(err => {
		d3.select("#response").text(err)
	})
}

function resetSubmit() {
	d3.json(STC.ApiClient.instance.basePath + "reset", { credentials: "include" })
	.then(json => {
		d3.select("#response").text(JSON.stringify(json))
	})
	.catch(err => {
		d3.select("#response").text(err)
	})
}

function usersPageChange(type) {
	d3.select("#response").text("")
	d3.selectAll(".userDiv").style("display", "none")
	d3.select("#" + type + "Div").style("display", "block")
}

window.initializeUserPage = function() {
	d3.select("#reg_username").on("input", e => registrationValidate(0))
	d3.select("#reg_password").on("input", e => registrationValidate(1))
	d3.select("#reg_password2").on("input", e => registrationValidate(2))
	d3.select("#reg_button").on("click", registrationSubmit)

	d3.select("#login_username").on("input", e => loginValidate(0))
	d3.select("#login_password").on("input", e => loginValidate(1))
	d3.select("#login_button").on("click", loginSubmit)

	d3.select("#logout_button").on("click", logoutSubmit)
	d3.select("#reset_button").on("click", resetSubmit)

	d3.select("#userSelect").on("change", function(e) {
		usersPageChange(e.target.value)
	})
	usersPageChange("login")
}

},{"hash-int":47,"space_tycoon_client":3}],44:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],45:[function(require,module,exports){

},{}],46:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":44,"buffer":46,"ieee754":48}],47:[function(require,module,exports){
"use strict"

var A
if(typeof Uint32Array === undefined) {
  A = [ 0 ]
} else {
  A = new Uint32Array(1)
}

function hashInt(x) {
  A[0]  = x|0
  A[0] -= (A[0]<<6)
  A[0] ^= (A[0]>>>17)
  A[0] -= (A[0]<<9)
  A[0] ^= (A[0]<<4)
  A[0] -= (A[0]<<3)
  A[0] ^= (A[0]<<10)
  A[0] ^= (A[0]>>>15)
  return A[0]
}

module.exports = hashInt

},{}],48:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],49:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],50:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],51:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":49,"./encode":50}]},{},[43]);
