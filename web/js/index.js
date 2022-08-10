var STC = require("space_tycoon_client")

STC.ApiClient.instance.basePath = "http://localhost" // for development
STC.ApiClient.instance.enableCookies = true
console.log(STC)

var currentTick = new STC.CurrentTick()
var staticData
var zoom

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
	.html("<span style=\"float: left\">" + d.name + "</span><span style=\"float: right\">&lt;" + d.position + "&gt;</span><div style=\"clear: both\"></div>")

	let t = ""
	if (d["ship-class"]) {
		let c = staticData["ship-classes"][d["ship-class"]]
		t += "<hr>"
		t += "<table>"
		t += "<tr><td>Owner:<td>" + d.data.players[d.player].name
		t += "<tr><td>Class:<td>" + c.name
		t += "<tr><td>Life:<td>" + d.life + " / " + c.life
		t += "</table>"
	}
	if (Object.keys(d.resources).length > 0) {
		t += "<hr>"
		t += "<table class=\"commodities\">"
		for (let rid of Object.keys(d.resources)) {
			let r = d.resources[rid]
			t += "<tr><td>" + staticData["resource-names"][rid] + ": <td class=\"amount\">" + (bignum(r.amount) || "") + "<td class=\"buy\">" + (bignum(r["buy-price"]) || "") + "<td class=\"sell\">" + (bignum(r["sell-price"]) || "")
		}
		t += "</table>"
	}
	d3.select("#modalInfo")
	.html(t)
}

function redraw(data) {

	let planets = []
	for (let pid of Object.keys(data.planets)) {
		let p = data.planets[pid]
		p.id = pid
		p.data = data
		planets.push(p)
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

	let ships = []
	for (let sid of Object.keys(data.ships)) {
		let s = data.ships[sid]
		s.id = sid
		s.data = data
		ships.push(s)
	}

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

	if (data["player-id"] > 0) {
		let ps = data.players[data["player-id"]]["net-worth"]
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
	players.sort((a, b) => d3.descending(a["net-worth"].total, b["net-worth"].total))

	d3.select("#playersOverlay")
	.selectAll("tr")
	.data(players, d => d.id)
	.join("tr")
	.html(d => "<td>" + d.name + "<td>" + bignum(d["net-worth"].total))
	.style("color", d => "rgb(" + d.color[0] + "," + d.color[1] + "," + d.color[2] + ")")
}

function refresh() {
	if (!staticData) {
		(new STC.StaticDataApi()).staticDataGet(function(error, data, response) {
			if (error) {
				d3.select("#tickInfo").text(error)
			} else {
				staticData = data
			}
		})
	}

	(new STC.DataApi()).dataGet(function(error, data, response) {
		if (error) {
			d3.select("#tickInfo").text(error)
		} else {
			if (staticData) {
				redraw(data)
			}
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
				d3.select("#tickInfo").text("Season: " + data.season + ", Tick: " + data.tick)
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
	zoom = d3.zoom()
	.on("zoom", handleZoom)
	d3.select("#themap")
	.call(zoom)

	let cookies = parseCookies()
	let playerid = cookies["player-id"] || -1
	if (playerid > 0) {
		d3.select("#userInfo").node().innerHTML = "<a href=\"logout.htm\">Log out</a> Player id: " + playerid + ", "
	}

	d3.select("#tickInfo").text("Connecting...")
	setTimeout(timerLoop, 0)
}

setTimeout(startLoop, 0)