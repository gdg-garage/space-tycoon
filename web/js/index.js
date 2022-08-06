var STC = require("space_tycoon_client")

// for development
STC.ApiClient.instance.basePath = "http://localhost"
console.log(STC)

var currentTick = new STC.CurrentTick()

function redraw() {
	// TODO
}

function timerLoop() {
	(new STC.CurrentTickApi()).currentTickGet(function(error, data, response) {
		if (error) {
			setTimeout(timerLoop, 1000)
			d3.select("#tickInfo").text(error)
		} else {
			setTimeout(timerLoop, data["time-left-ms"] || 300)
			if (currentTick.tick != data.tick) {
				d3.select("#tickInfo").text("season: " + data.season + ", tick: " + data.tick)
				currentTick = data
				redraw()
			}
		}
	})
}

function startLoop()
{
	d3.select("#tickInfo").text("Connecting...")
	setTimeout(timerLoop, 0)
}

setTimeout(startLoop, 0)
