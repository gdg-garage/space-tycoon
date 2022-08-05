var SpaceTycoonClient = require('space_tycoon_client')

// for development
SpaceTycoonClient.ApiClient.instance.basePath = "http://localhost"
console.log(SpaceTycoonClient)

// example current tick api call
var api = new SpaceTycoonClient.CurrentTickApi()
var callback = function(error, data, response) {
  if (error) {
    console.error(error)
  } else {
    console.log('API called successfully.')
    console.log(data)
    console.log(response)
  }
}
api.currentTickGet(callback)

// example commands api call
/*
var api = new SpaceTycoonClient.CommandsApi()
var requestBody = {key: new SpaceTycoonClient.Command()}
var callback = function(error, data, response) {
  if (error) {
    console.error(error)
  } else {
    console.log('API called successfully.')
    console.log(data)
    console.log(response)
  }
}
api.commandsPost(requestBody, callback)
*/

