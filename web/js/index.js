var STC = require("space_tycoon_client")
var hashInt = require("hash-int")

STC.ApiClient.instance.basePath = "../"
STC.ApiClient.instance.enableCookies = true
console.log(STC)

var gameApi = new STC.GameApi()
var currentTick = new STC.CurrentTick()
var staticData
var zoom
var graphsOptions = {}
var previousNames = {}

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

function updateTickInfo(data) {
	let replay = parseCookies()["replay_enabled"]
	d3.select("#tickInfo").text((replay ? "REPLAY, " : "") + "Season: " + data.season + ", Tick: " + data.tick + " (" + Math.floor(data.tick / 60) + ":" + ((data.tick % 60) < 10 ? "0" : "") + (data.tick % 60) + ")")
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
	t += "<hr>"
	t += "Id: " + d.id
	t += ", Position: &lt;" + d.position + "&gt";

	if (typeof d.shipClass !== "undefined") {
		let c = staticData.shipClasses[d.shipClass]
		t += "<hr>"
		if (typeof d["life"] !== "undefined") {
			t += "Life: " + d.life + " / " + c.life + ", "
		}
		t += "Class: " + c.name + ", "
		t += "Owner: " + d.data.players[d.player].name
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
			t += "<tr><td><td>Amount<td>Buy price<td>Sell price"
		}
		for (let rid of Object.keys(d.resources)) {
			let r = d.resources[rid]
			t += "<tr><td>" + staticData.resourceNames[rid] + ": <td class=\"amount\">" + (bignum(r.amount) || "") + "<td class=\"buy\">" + (bignum(r.buyPrice) || "") + "<td class=\"sell\">" + (bignum(r.sellPrice) || "")
		}
		t += "</table>"
	}

	// window contents
	let title = "<div class=\"modalTitle\">" + d.name + "</div>"
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
	let style = "left: " + (e.x + 1) + "px; top: " + (e.y + 1) + "px;"
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

function spawnRename(data, ship) {
	let c = colorToRgb(data.players[ship.player].color)
	spawnText(ship.position, [0, -1], c, ship.name, "rename")
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

	for (let sid of Object.keys(data.ships)) {
		let s = data.ships[sid]
		if (s.name != previousNames[sid]) {
			previousNames[sid] = s.name
			spawnRename(data, s)
		}
	}
}

function mapRefresh(queryParams) {
	if (!staticData) {
		gameApi.staticDataGet(queryParams, function(error, data, response) {
			if (error) {
				d3.select("#tickInfo").text(error)
				replayStornoSubmit()
			} else {
				staticData = data
			}
		})
	}

	gameApi.dataGet(queryParams, function(error, data, response) {
		if (error) {
			d3.select("#tickInfo").text(error)
			replayStornoSubmit()
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
		let cookies = parseCookies()
		if (cookies["replay_enabled"]) {
			currentTick = { season: cookies["replay_season"], tick: cookies["replay_tick"] }
			updateTickInfo(currentTick)
			mapRefresh({ season: currentTick.season, tick: currentTick.tick })
			if (cookies["replay_continuous"]) {
				let t = parseInt(currentTick.tick) + 1
				document.cookie = "replay_tick=" + t + "; path=/"
			}
			setTimeout(mapTimerLoop, cookies["replay_faster"] ? 100 : 1000)
		} else {
			gameApi.currentTickGet(function(error, data, response) {
				if (error) {
					setTimeout(mapTimerLoop, 1000)
					d3.select("#tickInfo").text(error)
					replayStornoSubmit()
				} else {
					setTimeout(mapTimerLoop, data.minTimeLeftMs || 300)
					if (currentTick.tick != data.tick) {
						currentTick = data
						updateTickInfo(currentTick)
						mapRefresh({ season: currentTick.season, tick: currentTick.tick })
					}
				}
			})
		}
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

function graphsRefresh(data, queryParams) {
	if (!staticData) {
		gameApi.staticDataGet(queryParams, function(error, data, response) {
			if (error) {
				d3.select("#tickInfo").text(error)
				replayStornoSubmit()
			} else {
				staticData = data
				updateResourcesColors()
			}
		})
	}

	gameApi.dataGet(queryParams, function(error, world, response) {
		if (error) {
			d3.select("#tickInfo").text(error)
			replayStornoSubmit()
		} else {
			generateObjects(world)
			data.world = world
			if (staticData) {
				if (graphsOptions.type == "players")
					graphsRedrawPlayers(data, [true, true, true, true])
				else if (graphsOptions.type == "players-total")
					graphsRedrawPlayers(data, [false, false, false, true])
				else if (graphsOptions.type == "players-ships")
					graphsRedrawPlayers(data, [false, true, false, false])
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
	let cookies = parseCookies()
	if (document.visibilityState === "visible") {
		setTimeout(graphsTimerLoop, cookies["replay_faster"] ? 100 : 1000)
		if (cookies["replay_enabled"]) {
			let queryParams = { season: cookies["replay_season"], tick: cookies["replay_tick"] }
			gameApi.reportsGet(queryParams, function(error, data, response) {
				if (error) {
					d3.select("#tickInfo").text(error)
					replayStornoSubmit()
				} else {
					updateTickInfo(data)
					currentTick.season = data.season
					graphsRefresh(data, queryParams)
					if (cookies["replay_continuous"]) {
						let t = parseInt(queryParams.tick) + 1
						document.cookie = "replay_tick=" + t + "; path=/"
					}
				}
			})
		} else {
			gameApi.reportsGet({}, function(error, data, response) {
				if (error) {
					d3.select("#tickInfo").text(error)
				} else {
					updateTickInfo(data)
					if (data.season != currentTick.season) {
						staticData = undefined
						currentTick.season = data.season
					}
					graphsRefresh(data)
				}
			})
		}
	} else {
		setTimeout(graphsTimerLoop, 1000)
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

function replayStornoSubmit() {
	let reset = function(name) { document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;" }
	reset("replay_season")
	reset("replay_tick")
	reset("replay_continuous")
	reset("replay_faster")
	reset("replay_enabled")
	d3.select("#response").text("replay storno-ed")
}

function replayStartSubmit() {
	replayStornoSubmit()
	document.cookie = "replay_season=" + d3.select("#replay_season").node().value + "; path=/"
	if (d3.select("#replay_continuous").node().checked) {
		document.cookie = "replay_continuous=1; path=/"
		if (d3.select("#replay_faster").node().checked)
			document.cookie = "replay_faster=1; path=/"
		document.cookie = "replay_tick=2; path=/"
	} else {
		document.cookie = "replay_tick=" + d3.select("#replay_tick").node().value + "; path=/"
	}
	document.cookie = "replay_enabled=true; path=/"
	d3.select("#response").text("replay started")
}

function replayUpdateDisabled() {
	d3.select("#replay_tick").node().disabled = d3.select("#replay_continuous").node().checked
	d3.select("#replay_faster").node().disabled = !d3.select("#replay_continuous").node().checked
}

function usersPageChange(type) {
	d3.select("#response").text("")
	d3.selectAll(".userDiv").style("display", "none")
	d3.select("#" + type + "Div").style("display", "block")
	replayUpdateDisabled()
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

	d3.select("#replay_button_storno").on("click", replayStornoSubmit)
	d3.select("#replay_button_start").on("click", replayStartSubmit)
	d3.select("#replay_continuous").on("change", replayUpdateDisabled)

	d3.select("#userSelect").on("change", function(e) {
		usersPageChange(e.target.value)
	})
	usersPageChange("login")
}
