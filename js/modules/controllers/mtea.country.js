/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, jquery:true, indent:4, maxerr:50 */

define(['d3', 
		'myConfig',
		'modules/helpers/dom',
		'modules/controllers/mtea.map.mini'], 
	function (
		d3, 
		myConfig,
		Dom,
		miniMap
	) {
	"use strict";

	var hideTtTimer,
		init = function (d, Vis, path, callback) {

		// Hide tooltip
		disableOverviewTooltip();

		// Create poiDesc container
		createPoiDesc();

		// Make overview map small
		miniMap.init(Vis);

		// Add classes to svg
		addSvgClasses();

		// Draw country
		Vis = draw(d, Vis, path);

		// Draw clippath (prevent routes 
		// extending past country borders)
		Vis = createClippath(d, Vis, path);

		// Add route & POI
		if (d.geodata) {
			Vis = addRouteData(d, Vis, path);
		}

		// Add title
		Vis = addTitle(d, Vis, path);

		// Add description
		addDesc(d);

		// Add meta data
		Vis = addMeta(d, Vis, path);

		d3.select(".hide-country")
			.on("click", function () {
				hide(Vis);
			})

		if (callback && typeof(callback) === "function") {
			callback();
		}

	},

	draw = function (d, Vis, path) {

		var centroid = path.centroid(d),
			centerStage = [480, 280],
			offset = [-(centroid[0] - (centerStage[0] / d.properties.zoom)), -(centroid[1] - (centerStage[1] / d.properties.zoom))];

		Vis.showCountry = Vis.append("g")
			.attr("id", "country-details")
			.attr("transform", "translate(0, 144)")
		.append("g")
			.attr("id", "country-wrapper")
			.selectAll("path")
			.data([d])
			.enter()
		.append("path")
			.attr("d", path)
			.attr("fill", myConfig.colors.fillVisited)
			.attr("stroke", myConfig.colors.strokeVisited)
			.attr("stroke-width", (1 / d.properties.zoom) * 2)
			.attr("id", "large-country");

		transformCountry(d, centroid, offset);

		return Vis;
	},

	transformCountry = function(d, centroid, offset) {
		// Transform position and scale
		d3.select("#country-wrapper")
			.attr("transform-origin", centroid[0] + ", " + centroid[1])
			.transition()
			.duration(800)
			.ease("cubic-bezier(0.785, 0.135, 0.150, 0.860)")
			.attr("transform", "scale(" + d.properties.zoom + "), translate(" + offset[0] + ", " + offset[1] + ")");
	},

	createClippath = function (d, Vis, path) {
		Vis.countryClip = d3.select("#country-wrapper")
			.append("defs")
				.append("svg:clipPath")
				.attr("id", "countryclip")
				.selectAll("path")
				.data([d])
				.enter()
			.append("path")
				.attr("d", path);
		return Vis;
	},

	addRouteData = function (d, Vis, path) {
		var zoom = d.properties.zoom;
		var country = d;
		path.pointRadius(4 / d.properties.zoom * 2);

		Vis.countryRoute = d3.select("#country-wrapper")
			.append("g")
				.attr("id", "country-route")
				.selectAll("path")
				.data(d.geodata.features)
				.enter()
			.append("path")
				.attr("d", path)
				.attr("class", function (d) {
					if (d.geometry.type === "Point") {
						return "country-poi point clickable";
					} else {
						return "country-route line";
					}
				})
				.attr("stroke-linecap", "round")
				.attr("fill-opacity", "0")
				.attr("stroke-opacity", "0");

		showPoi(d, country, path, zoom);
		return Vis;
	},

	addDesc = function (d) {
		var desc = document.createElement("div"),
			main = document.getElementById("main");
		desc.setAttribute("id", "country-desc");
		desc.setAttribute("class", "country-desc");
		desc.setAttribute("style", "opacity: 0;");
		desc.innerHTML = "<h4>What happened?</h4>" + d.properties.description;
		main.appendChild(desc);

		d3.select("#country-desc")
			.transition()
			.delay(250)
			.duration(550)
			.style("opacity", "1");
	},

	addTitle = function (d, Vis, path) {
		Vis.countryTitle = d3.select("#country-details").append("text")
			.attr("width", "400")
			.attr("height", 100)
			.attr("fill-opacity", "0")
			.attr("class", "sc-title h2")
			.text(d.properties.name)
			.attr("text-anchor", "middle")
			.attr("transform", "translate(480, 50)")
			//.attr("fill", "#666")
			.transition()
			.delay(550)
			.duration(250)
			.attr("fill-opacity", "1");

		return Vis;
	},

	showPoi = function (d, country, path, zoom) {
		var countPoints = 0;
		
		// Select poi
		d3.select("#country-route")
			.selectAll("path")
			.filter(function(d, i) { 
				if (d.geometry.type === "Point") {
					countPoints++;
					d3.select(this)
						.filter( function (d, i) {
							if (countPoints === 1) {
								showPoiDesc(d, country, path, 1050);
							}
							return d;
						})
						.on("click", function(d){
							showPoiDesc(d, country, path, 0);
						})
						.attr("stroke-width", (1 / zoom * 1))
						.attr("stroke", "#444444")
						.transition()
						.ease("quad")
						.delay(850 + i * 125)
						.duration(250)
						.attr("stroke-opacity", "1")
						.attr("fill-opacity", "1")
						.attr("stroke", "#000000")
						.attr("stroke-width", (1 / zoom * 10))
					.transition()
						.duration(250)
						.attr("stroke-width", (1 / zoom * 1.5))
						.attr("stroke", "#444444")
				}
			});

		// Show route
		showRoute(d, countPoints, zoom);
	},

	showPoiDesc = function (d, country, path, delay) {

		showPoiDescLine(d, country, path, delay);

		d3.select("#det-name")
			.text(d.properties.Name);

		d3.select("#det-description")
			.html(d.properties.Description);

		d3.select("#det-poi-wr")
			.style("display", "block")
			.style("opacity", "0")
			.transition()
			.delay(delay)
			.duration(200)
			.style("opacity", "1");
	},

	createPoiDesc = function () {

		var wrap = document.createElement("div");
		wrap.setAttribute("id", "det-poi-wr");

		var div = document.createElement("div");
		div.setAttribute("id", "det-poi");
		div.setAttribute("class", "det mod note");
		Dom.add(div, wrap);

		var title = document.createElement("h4");
		title.setAttribute("id", "det-name");
		Dom.add(title, div);

		var p = document.createElement("p");
		p.setAttribute("id", "det-description");
		Dom.add(p, div);

		Dom.add(wrap, 'main');
	},

	showPoiDescLine = function (d, country, path, delay) {
		var centroidCountry = path.centroid(country),
			centroidPoi = path.centroid(d),
			data = [
						[ centroidPoi[0] - (1 / country.properties.zoom * 9), centroidPoi[1] ], 
						[ centroidCountry[0]  - (1 / country.properties.zoom * 278), centroidCountry[1] + (1 / country.properties.zoom * 80)]
					];

		removePoiDescLine();

		d3.select("#country-route")
			.append("g")
				.attr("id", "poi-desc-line")
				.selectAll("line")
				.data(data)
				.enter()
			.append("line")
				.attr("x1", data[0][0])
				.attr("y1", data[0][1])
				.attr("x2", data[1][0])
				.attr("y2", data[1][1])
				.attr("stroke-opacity", "0")
				.transition()
				.delay(delay)
				.attr("stroke", "#000")
				.attr("stroke-opacity", "0.6")
				.attr("fill", "none")
				.attr("stroke-width", 1 / country.properties.zoom * 0.5);
	},

	showRoute = function (d, countPoints, zoom) {
		d3.selectAll(".country-route")
			.attr("clip-path", "url(#countryclip)")
			.attr("stroke-width", (4 / zoom * 1.5))
			.attr("stroke-opacity", "1")
	},

	addMeta = function (d, Vis, path) {
		var rating = "",
			i = 0,
			dateFormat = d3.time.format("%d.%m.%Y"),
			meta = null,
			metaLength = 0;

		for (i = 0; i < parseInt(d.properties.rating); i++) {
			rating = rating + "\u2605";
		}

		meta = [
			d.properties.name.toUpperCase(),
			dateFormat(new Date(d.properties.startDate)) + " - " + dateFormat(new Date(d.properties.endDate)),
			"Days: " + d.properties.days,
			"Kilometers: " + d.properties.km,
			"Total cost: " + d.properties.moneyTotal + " \u20AC",
			"Gasoline cost: " + d.properties.moneyGas + " \u20AC",
			"Cost per day: " + d.properties.moneyPerDay + " \u20AC",
			"Mechanics: " + d.properties.mechanics,
			d.properties.weather,
			d.properties.scenery,
			rating
		];
		metaLength = meta.length;

		// Text details wrapper
		Vis.countryDetails = d3.select("#country-details").append("g")
			.attr("text-anchor", "end")
			.attr("fill", "#444")
			.attr("class", "sc-details")
			.attr("transform", "translate(960, 168)");

		Vis.countryDetails.append("text")
			.attr("width", "200")
			.attr("transform", "translate(0, 0)")
			.attr("fill", myConfig.colors.fillVisited)
			.attr("class", "hide-country fake-link")
			.on("click", function () {
				hide(d, Vis, path);
			})
			.text("Back to map")
			.attr("fill-opacity", "0")
			.transition()
			.delay(600)
			.duration(250)
			.attr("fill-opacity", "1");

		// Add text to details
		for (i = 0; i < metaLength; i++) {
			Vis.countryDetails.append("text")
			.attr("width", "200")
			.attr("transform", "translate(0, " + (32 + i * 32) + ")")
			.text(meta[i])
			.attr("fill-opacity", "0")
			.transition()
			.delay(650 + i * 50)
			.duration(250)
			.attr("fill-opacity", "1");
		}

		return Vis;
	},

	hide = function (Vis) {

		window,setTimeout(function () {
			removeSvgClasses();
		}, 800);
		hideTtTimer = window.setTimeout(function () {
			enableOverviewTooltip();
		}, 1200);

		miniMap.remove(Vis);

		hideCountry();

		retransformCountry();

		removeCountryRoute();

		removeCountryTitle();

		removeCountryDesc();

		hideCountryMeta();

		removePoiDescLine();
		
		removePoiDesc();
		
		removeDesc();
	},

	removeDesc = function () {
		d3.select("#country-details")
			.transition()
			.delay(1000)
			.remove();
	},

	removePoiDesc = function (){
		d3.select("#det-poi-wr")
			.transition()
			.style("opacity", "0")
			.transition()
			.style("display", "none");
	},

	removePoiDescLine = function () {
		d3.select("#poi-desc-line")
			.remove();
	},

	addSvgClasses = function () {
		d3.select("#stage")
			.classed("showdetail", true);
	},

	removeSvgClasses = function () {
		d3.select("#stage")
			.classed("showdetail", false);
	},

	disableOverviewTooltip = function () {
		d3.select("#tt-overview")
			.style("display", "none");
	},

	enableOverviewTooltip = function () {
		d3.select("#tt-overview")
			.style("display", "block");
	},

	removeCountryTitle = function () {
		d3.select("#country-details > text")
			.transition()
			.duration(400)
			.attr("fill-opacity", "0")
			.remove();
	},

	removeCountryDesc = function () {
		d3.select("#country-desc")
			.transition()
			.duration(400)
			.style("opacity", "0")
			.remove();
	},


	removeCountryRoute = function () {
		d3.selectAll("#country-route path")
			.transition()
				.delay(600)
				.duration(200)
				.attr("fill-opacity", "0")
				.attr("stroke-opacity", "0");
	},

	retransformCountry = function () {
		d3.select("#country-wrapper")
			.transition()
			.duration(800)
			.ease("cubic-bezier(0.785, 0.135, 0.150, 0.860)")
			.attr("transform", "scale(" + 1  + "), translate(0, 0)");
	},

	hideCountry = function () {
		d3.select("#large-country")
			.transition()
			.delay(800)
			.duration(200)
			.attr("fill-opacity", "0")
			.attr("stroke-opacity", "0");

	},

	hideCountryMeta = function () {
		d3.selectAll(".sc-details > text")
			.transition()
			.attr("fill-opacity", "0")
			.remove();
	};

	return {
		init: init,
		hide: hide
	}
});