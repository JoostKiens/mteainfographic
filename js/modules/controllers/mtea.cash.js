/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, jquery:true, indent:4, maxerr:50 */

define(['d3', 
		'myConfig',
		'modules/controllers/mtea.tooltip'], 
	function (
		d3, 
		myConfig,
		tooltip
	) {
	"use strict";

	var init = function (countries, Vis) {
		disableBarTooltip();
		tooltip.create("moneyPerDay");
		tooltip.create("moneyDivision");

		Vis = addTitle(Vis, "How much did it cost?", 1368);
		Vis = addTitle(Vis, "What did we spend on?", 1896);
		Vis = moneyPerDay(countries, Vis);
		Vis = moneySummary(Vis);
		Vis = moneyDivision(countries, Vis);
	},

	addTitle = function (Vis, text, yOffset) {
		Vis.append("text")
			.attr("class", "page-title h2")
			.text(text)
			.attr("text-anchor", "middle")
			.attr("transform", "translate(480, " + yOffset + ")");

		return Vis;
	},

	moneySummary = function (Vis) {
		Vis.moneySummary = Vis.append("g")
			.attr("id", "money-summary")
			.attr("width", "320")
			.attr("height", "320")
			.attr("transform", "translate(320, 1464)")
			.attr("text-anchor", "end")
		.append("text")
			.attr("class", "h3")
			.text("Total costs")
			.attr("transform", "translate(-40, 0)");

		d3.select("#money-summary").append("text")
			.text("Gasoline: 1735.69 \u20AC")
			.attr("transform", "translate(-40, 36)");

		d3.select("#money-summary").append("text")
			.text("Food & drink: 1798.83 \u20AC")
			.attr("transform", "translate(-40, 72)");

		d3.select("#money-summary").append("text")
			.text("Car maintenance:  512.00 \u20AC")
			.attr("transform", "translate(-40, 108)");

		d3.select("#money-summary").append("text")
			.text("Accomodation: 1326.86 \u20AC")
			.attr("transform", "translate(-40, 144)");

		d3.select("#money-summary").append("text")
			.text("Miscellanious: 1100.19 \u20AC")
			.attr("transform", "translate(-40, 180)");

		d3.select("#money-summary").append("text")
			.text("Shipping, incl. bribes: 2683.41 \u20AC")
			.attr("transform", "translate(-40, 212)");

		d3.select("#money-summary").append("text")
			.text("Flight tickets:  239.87 \u20AC")
			.attr("transform", "translate(-40, 244)");

		d3.select("#money-summary").append("text")
			.text("Total:  9396.85 \u20AC")
			.attr("class", "strong")
			.attr("transform", "translate(-40, 280)");

		d3.select("#money-summary").append("text")
			.text("Note: we got scammed big time by our shipping")
			.attr("class", "small")
			.attr("transform", "translate(-40, 312)");

		d3.select("#money-summary").append("text")
			.text("agent in KL. Shipping cost could be about \u2153!")
			.attr("class", "small")
			.attr("transform", "translate(-40, 330)");

		return Vis;
	},

	moneyPerDay = function (countries, Vis) {
		var s = {
			"width" : "560",
			"height" : "320"
		};

		var x = d3.scale.ordinal()
			.rangeRoundBands([0, s.width], .1);

		var y = d3.scale.linear()
			.range([s.height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

		var data = [];

		countries.features.forEach(function(d, i) {
			if (d.properties.visited) {
				d.properties.moneyPerDay = +d.properties.moneyPerDay;
				data.push(d);
			}
		});

		x.domain(data.map(function (d) {
			return d.id;
		}));

		y.domain([0, d3.max(data, function (d) {
			return d.properties.moneyPerDay;
		}) + 5]);

		Vis.moneyPerDay = Vis.append("g")
			.attr("id", "money-per-day")
			.attr("class", "chart barchart")
			.attr("width", "640")
			.attr("transform", "translate(400, 1440)");

		Vis.moneyPerDay.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + s.height + ")")
			.attr("stroke-width", "1")
			.call(xAxis);

		Vis.moneyPerDay.append("g")
			.attr("class", "y axis")
			.attr("stroke-width", "1")
			.call(yAxis)
		.append("text")
			.attr("transform", "rotate(-90), translate(0, -70)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Avg. cost per day (\u20AC)");

		Vis.moneyPerDay.selectAll(".bar")
			.data(data)
			.enter()
		.append("rect")
			.attr("class", "bar")
			.attr("x", function (d) {
				return x(d.id);
			})
			.attr("width", x.rangeBand())
			.attr("y", function (d) { 
				return y(d.properties.moneyPerDay); 
			})
			.attr("height", function (d) { 
				return s.height - y(d.properties.moneyPerDay); 
			})
			.on("mouseover", function (d, i) {
				tooltip.showMoneyPerDay(d,[400, 1296], x(d.id), y(d.properties.moneyPerDay));
			})
			.on("mouseout", function (d, i) {
				tooltip.hide("mpd");
			});

		return Vis;
	},

	moneyDivision = function (countries, Vis) {
		var width = 960,
			height = 600,
			radius = 60;

		var color = d3.scale.ordinal()
			.range(["#F97743", "#FAD089", "#c65e35", "#FF9C5B", "#944728"]);

		var arc = d3.svg.arc()
			.outerRadius(radius - 10)
			.innerRadius(30);

		var pie = d3.layout.pie()
			.sort(null)
			.value(function(d) { 
				return d[1];
			});

		var data = [];
		var j = 0;

		countries.features.forEach( function( d, i) {
			if (d.properties.visited) {
				data.push(d);
			}
		});

		Vis.moneyDivision = Vis.append("g")
			.attr("id", "money-division")
			.attr("transform", "translate(0, 2016)");

		data.forEach( function (d, i) {

			var country = d;

			var myData = [
					["Gas", d.properties.moneyGas],
					["Accomodation", d.properties.moneyAccomodation],
					["Vehicle", d.properties.moneyCar],
					["Food & drinks", d.properties.moneyFB],
					["Miscellanious", d.properties.moneyMisc]
				];

			if (d.properties.moneyGas === "0" && 
				d.properties.moneyAccomodation === "0" && 
				d.properties.moneyCar === "0" && 
				d.properties.moneyFB === "0" && 
				d.properties.moneyMisc === "0") {
				return ;
			}

			radius = 40 + (d.properties.moneyTotal / 25);
			var ttOffset = radius;
			arc = d3.svg.arc()
				.outerRadius(radius - 10)
				.innerRadius(15);

			var offsetX = 60 + ((j % 5) * 200);
			var offsetY = Math.floor(j / 5) * 190;
			var g = Vis.moneyDivision.append("g")
				.attr("id", "money-division-" + d.id)
				.attr("transform", "translate(" + offsetX + ", " + offsetY + ")")
				.selectAll(".arc")
				.data(pie(myData))
				.enter()
			.append("g")
				.attr("class", "arc");

			g.append("path")
				.attr("d", arc)
				.style("fill", function(d) { 
					return color(d.data[0]); 
				})
				.on("mouseover", function (d, i) {
					tooltip.showMoneyDivision(d, country, [0, 1872], offsetX, offsetY, ttOffset);
				})
				.on("mouseout", function (d, i) {
					tooltip.hide("md");
				});

			d3.select("#money-division-" + d.id)
				.append("text")
				.attr("transform", "translate(0, " + (radius + 24) + ")")
				.attr("class", "h4")
				.attr("text-anchor", "middle")
				.text(d.properties.name);
			j++;
		});

		Vis.moneyDivisionLegend = Vis.moneyDivision.append("g")
			.attr("id", "moneyDivisionLegend")
			.attr("transform", "translate(560, 348)");

		var legend = {
			"Gas" : "#F97743",
			"Accomodation" : "#FAD089",
			"Vehicle" : "#c65e35",
			"Food & drinks" : "#FF9C5B",
			"Miscellanious" : "#944728"
		}

		j = 0;
		for (var key in legend) {
			Vis.moneyDivisionLegend.append("rect")
				.attr("id", "money-division-" + key.toLowerCase().replace(/\W/g, ''))
				.attr("class", "legend-color")
				.attr("width", "60")
				.attr("height", "24")
				.attr("stroke", "#666")
				.attr("stroke-width", "1")
				.attr("fill", legend[key])
				.attr("transform", "translate(" + (Math.floor(j / 3) * 200) + ", " + j % 3 * 36 + ")");

			Vis.moneyDivisionLegend.append("text")
				.attr("transform", "translate(" + (Math.floor(j / 3) * 200 + 70) + ", " + (j % 3 * 36 + 16) + ")")
				.text(key);

			j++;
		}

		return Vis;
	},

	disableBarTooltip = function () {
		d3.select("#tt-bar")
			.style("display", "none");
	};

	return {
		init: init
	};
});