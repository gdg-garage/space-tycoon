var STC = require("space_tycoon_client")
var hashInt = require("hash-int")

STC.ApiClient.instance.basePath = "http://localhost" // for development
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
	let num = Object.keys(staticData["resource-names"]).length
	let index = 0
	staticData.resourceColors = {}
	for (let rid of Object.keys(staticData["resource-names"])) {
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
			if (typeof w["prev-position"] === "undefined") {
				w["prev-position"] = w.position
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

	if (typeof d["resources"] !== "undefined" && Object.keys(d.resources).length > 0) {
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

function wreckColor(d) {
	let c = d.data.players[d.player].color
	return colorToRgb([ c[0] * 0.2, c[1] * 0.2, c[2] * 0.2 ])
}

function shipColor(d) {
	let c = d.data.players[d.player].color
	return colorToRgb(c)
}

function shipHref(d) {
	return "#class-" + staticData["ship-classes"][d["ship-class"]].name
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
	.style("color", d => colorToRgb(d.color))
}

function spawnBeam(attacker, defender) {
	d3.select("#particles")
	.append("line")
	.classed("beam", true)
	.attr("x1", attacker["prev-position"][0])
	.attr("y1", attacker["prev-position"][1])
	.attr("x2", defender["prev-position"][0] + (Math.random() - 0.5) * 3)
	.attr("y2", defender["prev-position"][1] + (Math.random() - 0.5) * 3)
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
	spawnParticles(defender["prev-position"], 3)
	spawnBloom(defender["prev-position"], 25, "attackBloomGrad")
}

function spawnKill(attacker, defender) {
	spawnBeam(attacker, defender)
	spawnParticles(defender["prev-position"], 20)
	spawnBloom(defender["prev-position"], 80, "killBloomGrad")
}

function spawnText(pos, direction, color, text, classes) {
	let x = pos[0] + direction[0] * 15
	let y = pos[1] + direction[1] * 15
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
	let rn = staticData["resource-names"][tr.resource]
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
		(new STC.GameApi()).staticDataGet(function(error, data, response) {
			if (error) {
				d3.select("#tickInfo").text(error)
			} else {
				staticData = data
			}
		})
	}

	(new STC.GameApi()).dataGet(function(error, data, response) {
		if (error) {
			d3.select("#tickInfo").text(error)
		} else {
			if (staticData) {
				if ((typeof data["player-id"] !== "undefined") && (typeof data.players[data["player-id"]] === "undefined")) {
					delete data["player-id"] // the supposedly logged-in player does not exist
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

function multiLineGraph(lines, legends) {
	let size = d3.select("#thegraph").node().getBoundingClientRect()

	let xMin = d3.min(lines, l => d3.min(l.values, p => p[0]))
	let xMax = d3.max(lines, l => d3.max(l.values, p => p[0]))
	let xScale = d3.scaleLinear().domain([xMin, xMax]).range([20, size.width - 20])
	let xAxis = d3.axisBottom().scale(xScale).ticks(10)
	d3.select("#xaxis").call(xAxis)

	let yMin = d3.min(lines, l => d3.min(l.values, p => p[1]))
	let yMax = d3.max(lines, l => d3.max(l.values, p => p[1]))
	let yScale = d3.scaleLinear().domain([yMax, yMin]).range([20, size.height - 20])
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
		.attr("x", size.width - 20)
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

		if (enabled[0])
			category("resources")
		if (enabled[1])
			category("ships")
		if (enabled[2])
			category("money")
		if (enabled[3])
			category("total")

		let l = {}
		l.id = sid
		l.name = name
		l.color = color
		l.value = last(s.total)
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
	if (typeof data["combat"] !== "undefined") {
		for (let c of Object.values(data.combat)) {
			let a = data.world.objects[c.attacker]
			let d = data.world.objects[c.defender]
			let dmg = staticData["ship-classes"][a["ship-class"]].damage
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
		let name = staticData["resource-names"][rid]
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
		let name = staticData["resource-names"][rid]
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
		let name = staticData["resource-names"][rid]
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
	if (typeof data["trade"] !== "undefined") {
		for (let tr of Object.values(data.trade)) {
			res[tr.resource][tr.tick] += tr.amount
		}
	}
	prefixAccumulate(res)

	let lines = []
	let legends = []
	for (let rid of Object.keys(res)) {
		let p = res[rid]
		let name = staticData["resource-names"][rid]
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

function graphsRefresh(data) {
	if (!staticData) {
		(new STC.GameApi()).staticDataGet(function(error, data, response) {
			if (error) {
				d3.select("#tickInfo").text(error)
			} else {
				staticData = data
				updateResourcesColors()
			}
		})
	}

	(new STC.GameApi()).dataGet(function(error, world, response) {
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
			}
		}
	})
}

function graphsTimerLoop() {
	setTimeout(graphsTimerLoop, 1000)
	if (document.visibilityState === "visible") {
		(new STC.GameApi()).reportsGet(function(error, data, response) {
			if (error) {
				d3.select("#tickInfo").text(error)
			} else {
				d3.select("#tickInfo").text("")
				if (data.season != currentTick.season) {
					staticData = undefined
					playerData = undefined
					currentTick.season = data.season
				}
				graphsRefresh(data)
			}
		})
	}
}

function graphsStartLoop() {
	d3.select("#tickInfo").text("Connecting...")
	setTimeout(graphsTimerLoop, 0)
	graphsOptions.type = "players"
	d3.select("#graphSelect").on("change", function(e) {
		graphsOptions.type = e.target.value
	})
}

window.initializeGraphs = function() {
	setTimeout(graphsStartLoop, 0)
}
