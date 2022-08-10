var STC = require("space_tycoon_client")

STC.ApiClient.instance.basePath = "http://localhost" // for development
STC.ApiClient.instance.enableCookies = true
console.log(STC)

var currentTick = new STC.CurrentTick()
var zoom

function initDraw() {
	zoom = d3.zoom()
	.on("zoom", handleZoom)

	d3.select("#themap")
	.call(zoom)
}

function handleZoom(e) {
	d3.selectAll("#panzoom")
	.attr("transform", e.transform)

	modalClose()
}

function modalClose() {
	d3.select("#modalContainer")
	.style("display", "none")
}

function clickInfo(e) {
	let d = this["__data__"]

	d3.select("#modalContainer")
	.style("display", "block")

	d3.select("#modalWindow")
	.style("left", e.x + "px")
	.style("top", e.y + "px")
	.on("click", modalClose)

	d3.select("#modalTitle")
	.html(d.name)

	d3.select("#modalInfo")
	.html(JSON.stringify(d))
}

function redraw(data) {
	if (!zoom)
		initDraw()

	let planets = []
	for (let pid of Object.keys(data.planets)) {
		let p = data.planets[pid]
		p.id = pid
		planets.push(p)
	}

	let ships = []
	for (let sid of Object.keys(data.ships)) {
		let s = data.ships[sid]
		s.id = sid
		ships.push(s)
	}

	d3.select("#planets")
	.selectAll(".planet")
	.data(planets, d => d.id)
	.join("circle")
	.classed("planet", true)
	.on("click", clickInfo)
	.html(d => "<title>" + d.name + "</title>")
	.attr("r", 7)
	.attr("cx", d => d.position[0])
	.attr("cy", d => d.position[1])

	d3.select("#ships")
	.selectAll(".ship")
	.data(ships, d => d.id)
	.join("circle")
	.classed("ship", true)
	.on("click", clickInfo)
	.html(d => "<title>" + d.name + "</title>")
	.attr("fill", d => "rgb(" + data.players[d.player].color[0] + "," + data.players[d.player].color[1] + "," + data.players[d.player].color[2] + ")")
	.attr("r", 5)
	.transition()
	.duration(1000)
	.ease(d3.easeLinear)
	.attr("cx", d => d.position[0])
	.attr("cy", d => d.position[1])
}

function refresh() {
	(new STC.DataApi()).dataGet(function(error, data, response) {
		if (error) {
			d3.select("#tickInfo").text(error)
		} else {
			//console.log(data)
			redraw(data)
		}
	})
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
				refresh()
			}
		}
	})
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

function startLoop()
{
	let cookies = parseCookies()
	let playerid = cookies["player-id"] || -1
	if (playerid > 0) {
		d3.select("#userInfo").node().innerHTML = "Player id: " + playerid + " <a href=\"logout.htm\">Log out</a>"
	}
	d3.select("#tickInfo").text("Connecting...")
	setTimeout(timerLoop, 0)
}

setTimeout(startLoop, 0)
