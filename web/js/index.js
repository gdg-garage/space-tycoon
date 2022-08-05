var STC = require('space_tycoon_client')

// for development
STC.ApiClient.instance.basePath = "http://localhost"
console.log(STC)

var currentTick = -1

function redraw() {
	console.log(currentTick)
	d3.select("#tickInfo").text("tick: " + currentTick)
}

function timerLoop() {
	(new STC.CurrentTickApi()).currentTickGet(function(error, data, response) {
		if (error) {
			console.error(error)
		} else {
			console.log(data)
			console.log(response)
			setTimeout(timerLoop, data["time-left-ms"] || 300)
			let tick = data.tick
			if (tick != currentTick) {
				currentTick = tick
				redraw()
			}
		}
	})
}

setTimeout(timerLoop, 10)
