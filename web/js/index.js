var STC = require('space_tycoon_client')

// for development
STC.ApiClient.instance.basePath = "http://localhost"
console.log(STC)

var currentTick = new STC.CurrentTick()

function redraw() {
	d3.select("#tickInfo").text("season: " + currentTick.season + ", tick: " + currentTick.tick)
}

function timerLoop() {
	(new STC.CurrentTickApi()).currentTickGet(function(error, data, response) {
		if (error) {
			console.error(error)
		} else {
			setTimeout(timerLoop, data["time-left-ms"] || 300)
			if (currentTick.tick != data.tick) {
				currentTick = data
				redraw()
			}
		}
	})
}

setTimeout(timerLoop, 10)
