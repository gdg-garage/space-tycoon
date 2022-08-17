var STC = require("space_tycoon_client")
var hashInt = require("hash-int")

STC.ApiClient.instance.basePath = "http://localhost" // for development
STC.ApiClient.instance.enableCookies = true
console.log(STC)

var currentTick = new STC.CurrentTick()
var staticData
var playerData
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

function colorToRgb(c) {
	return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")"
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
	if (typeof d["ship-class"] !== "undefined") {
		let c = staticData["ship-classes"][d["ship-class"]]
		t += "<hr>"
		t += "<table>"
		t += "<tr><td>Owner:<td>" + d.data.players[d.player].name
		t += "<tr><td>Class:<td>" + c.name
		t += "<tr><td>Life:<td>" + d.life + " / " + c.life
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
				t += "<tr><td>Resource:<td>" + staticData["resource-names"][d.command.resource]
			}
			if (typeof d.command.amount !== "undefined") {
				t += "<tr><td>Amount:<td class=\"amount\">" + d.command.amount
			}
			if (typeof d.command["class"] !== "undefined") {
				t += "<tr><td>Class:<td>" + staticData["ship-classes"][d.command["class"]].name
			}
			t += "</table>"
		}
	}
	if (Object.keys(d.resources).length > 0) {
		t += "<hr>"
		t += "<table class=\"commodities\">"
		if (!d["ship-class"]) {
			t += "<tr><td><td>Available<td>Buy price<td>Sell price"
		}
		for (let rid of Object.keys(d.resources)) {
			let r = d.resources[rid]
			t += "<tr><td>" + staticData["resource-names"][rid] + ": <td class=\"amount\">" + (bignum(r.amount) || "") + "<td class=\"buy\">" + (bignum(r["buy-price"]) || "") + "<td class=\"sell\">" + (bignum(r["sell-price"]) || "")
		}
		t += "</table>"
	}
	d3.select("#modalInfo")
	.html(t)
}

function planetColor(d) {
	let h1 = hashInt(d.id)
	let h2 = hashInt(h1 + 123)
	let h3 = hashInt(h2 + 741)
	let c = [ h1 % 20 + 120, h2 % 20 + 120, h3 % 20 + 120 ]
	return colorToRgb(c)
}

function shipColor(d) {
	let c = d.data.players[d.player].color
	return colorToRgb(c)
}

function shipHref(d) {
	return "#class-" + staticData["ship-classes"][d["ship-class"]].name
}

function mapRedraw(data) {
	data.objects = {}

	let planets = []
	for (let pid of Object.keys(data.planets)) {
		let p = data.planets[pid]
		p.id = pid
		p.data = data
		planets.push(p)
		data.objects[pid] = p
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

	let ships = []
	for (let sid of Object.keys(data.ships)) {
		let s = data.ships[sid]
		s.id = sid
		s.data = data
		ships.push(s)
		data.objects[sid] = s
	}

	d3.select("#ships")
	.selectAll(".ship")
	.data(ships, d => d.id)
	.join("use")
	.classed("ship", true)
	.on("click", clickInfo)
	.html(d => "<title>" + d.name + "</title>")
	.attr("href", shipHref)
	.attr("fill", shipColor)
	.transition()
	.duration(1000)
	.ease(d3.easeLinear)
	.attr("x", d => d.position[0])
	.attr("y", d => d.position[1])

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

	d3.select("#lines")
	.selectAll(".line")
	.data(lines, d => d.id)
	.join("line")
	.classed("line", true)
	.transition()
	.duration(1000)
	.ease(d3.easeLinear)
	.attr("x1", d => d.ship.position[0])
	.attr("y1", d => d.ship.position[1])
	.attr("x2", d => d.target.position[0])
	.attr("y2", d => d.target.position[1])

	if (typeof data["player-id"] !== "undefined") {
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

function mapRefresh() {
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
				if ((typeof data["player-id"] !== "undefined") && (typeof data.players[data["player-id"]] === "undefined")) {
					delete data["player-id"] // the supposedly logged-in player does not exist
				}
				mapRedraw(data)
			}
		}
	})
}

function mapTimerLoop() {
	if (document.visibilityState === "visible") {
		(new STC.CurrentTickApi()).currentTickGet(function(error, data, response) {
			if (error) {
				setTimeout(mapTimerLoop, 1000)
				d3.select("#tickInfo").text(error)
			} else {
				setTimeout(mapTimerLoop, data["min-time-left-ms"] || 300)
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
	let playerid = cookies["player-id"] || -1
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

function graphsRedraw(data) {
	let lines = []
	for (let sid of Object.keys(data.scores)) {
		let s = data.scores[sid]

		function category(key) {
			let m = {}
			m.category = key
			m.name = playerData[sid].name
			m.color = colorToRgb(playerData[sid].color)
			m.values = []
			for (let x of Object.keys(s[key]))
				m.values.push([ parseInt(x), s[key][x] ])
			lines.push(m)
		}

		category("resources")
		category("ships")
		category("money")
		category("total")
	}

	let size = d3.select("#thegraph").node().getBoundingClientRect()

	let xMin = d3.min(lines, l => d3.min(l.values, p => p[0]))
	let xMax = d3.max(lines, l => d3.max(l.values, p => p[0]))
	let xScale = d3.scaleLinear().domain([xMin, xMax]).range([10, size.width - 10])
	let xAxis = d3.axisBottom().scale(xScale).ticks(10)
	d3.select("#xaxis").call(xAxis)

	let yMin = d3.min(lines, l => d3.min(l.values, p => p[1]))
	let yMax = d3.max(lines, l => d3.max(l.values, p => p[1]))
	let yScale = d3.scaleLinear().domain([yMax, yMin]).range([10, size.height - 10])
	let yAxis = d3.axisRight().scale(yScale).ticks(10)
	d3.select("#yaxis").call(yAxis)

	d3.select("#graphdata")
	.selectAll(".line")
	.data(lines)
	.join("path")
	.classed("line", true)
	.attr("stroke", d => d.color)
	.attr("d", d => d3.line()
		.x(p => xScale(p[0]))
		.y(p => yScale(p[1]))
		(d.values)
	)
}

function graphsRefresh(data) {
	if (!staticData) {
		(new STC.StaticDataApi()).staticDataGet(function(error, data, response) {
			if (error) {
				d3.select("#tickInfo").text(error)
			} else {
				staticData = data
			}
		})
	}

	if (!playerData) {
		(new STC.DataApi()).dataGet(function(error, data, response) {
			if (error) {
				d3.select("#tickInfo").text(error)
			} else {
				playerData = data.players
			}
		})
	}

	if (staticData && playerData) {
		graphsRedraw(data)
	}
}

function graphsTimerLoop() {
	setTimeout(graphsTimerLoop, 1000)
	if (document.visibilityState === "visible") {
		(new STC.ReportsApi()).reportsGet(function(error, data, response) {
			if (error) {
				d3.select("#tickInfo").text(error)
			} else {
				d3.select("#tickInfo").text("")
				graphsRefresh(data)
			}
		})
	}
}

function graphsStartLoop() {
	d3.select("#tickInfo").text("Connecting...")
	setTimeout(graphsTimerLoop, 0)
}

window.initializeGraphs = function() {
	setTimeout(graphsStartLoop, 0)
}
