var STC = require("space_tycoon_client")

STC.ApiClient.instance.basePath = "http://localhost" // for development
STC.ApiClient.instance.enableCookies = true
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

function parseCookies() {
	let c = document.cookie
	if (c == "")
		return {}
	return document.cookie
	.split(';')
	.map(v => v.split('='))
	.reduce((acc, v) => {
		acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim())
		return acc
	}, {})
}

function startLoop()
{
	let cookies = parseCookies()
	let playerid = cookies["player-id"] || -1
	if (playerid > 0) {
		d3.select("#userInfo").node().innerHTML = "Player id: " + playerid + ' <a href="logout.htm">Log out</a>'
	}
	d3.select("#tickInfo").text("Connecting...")
	setTimeout(timerLoop, 0)
}

setTimeout(startLoop, 0)
