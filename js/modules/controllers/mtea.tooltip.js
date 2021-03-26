/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, jquery:true, indent:4, maxerr:50 */

define(['d3', 'myConfig', 'modules/helpers/dom'], function (d3, myConfig, Dom) {
	"use strict";

	/**
	 * Show the tooltip on hover
	 * @param  {Object} d    Data element
	 * @param  {Object} Vis  Visualization
	 * @param  {Func}   path Projection path
	 * @return {Void}
	 */
	var create = function (type) {

		if (type === "overview") {
			createMap();
		} else if (type === "moneyPerDay") {
			createMoneyPerDay();
		} else if (type === "moneyDivision") {
			createMoneyDivision()
		}
	},

	createMoneyPerDay = function () {
		var wrap = document.createElement("div");
		wrap.setAttribute("id", "tt-mpd");
		wrap.setAttribute("class", "tt");
		wrap.setAttribute("style", "opacity: 0");

		var head = document.createElement("header");
		Dom.add(head, wrap);

		var title = document.createElement("h3");
		title.setAttribute("id", "tt-mpd-country");
		Dom.add(title, head);

		var dl = document.createElement("dl");
		Dom.add(dl, wrap);

		var dt = document.createElement("dt");
		dt.textContent = "Days";
		Dom.add(dt, dl);

		var dd = document.createElement("dd");
		dd.setAttribute("id", "tt-mpd-days");
		Dom.add(dd, dl);

		dt = document.createElement("dt");
		dt.textContent = "Daily cost";
		Dom.add(dt, dl);

		dd = document.createElement("dd");
		dd.setAttribute("id", "tt-mpd-cost");
		Dom.add(dd, dl);

		Dom.add(wrap, 'main');
	},

	createMap = function () {

		var wrap = document.createElement("div");
		wrap.setAttribute("id", "tt-overview");
		wrap.setAttribute("class", "tt");
		wrap.setAttribute("style", "opacity: 0");

		var head = document.createElement("header");
		Dom.add(head, wrap);

		var title = document.createElement("h3");
			title.setAttribute("id", "tt-country");
		Dom.add(title, head);

		var dl = document.createElement("dl");
		Dom.add(dl, wrap);

		var dt = document.createElement("dt");
		dt.textContent = "Days";
		Dom.add(dt, dl);

		var dd = document.createElement("dd");
		dd.setAttribute("id", "tt-days");
		Dom.add(dd, dl);

		dt = document.createElement("dt");
		dt.textContent = "Kilometers";
		Dom.add(dt, dl);

		dd = document.createElement("dd");
		dd.setAttribute("id", "tt-km");
		Dom.add(dd, dl);

		var footer = document.createElement("footer");
		footer.setAttribute("class", "tt-meta");
		footer.textContent = "Click country for more info.";
		Dom.add(footer, wrap);

		Dom.add(wrap, 'main');
	},

	createMoneyDivision = function () {
		var wrap = document.createElement("div");
		wrap.setAttribute("id", "tt-md");
		wrap.setAttribute("class", "tt");
		wrap.setAttribute("style", "opacity: 0");

		var head = document.createElement("header");
		Dom.add(head, wrap);

		var title = document.createElement("h3");
		title.setAttribute("id", "tt-md-name");
		Dom.add(title, head);

		var dl = document.createElement("dl");
		Dom.add(dl, wrap);

		var dt = document.createElement("dt");
		dt.textContent = "Cost";
		Dom.add(dt, dl);

		var dd = document.createElement("dd");
		dd.setAttribute("id", "tt-md-val");
		Dom.add(dd, dl);

		dt = document.createElement("dt");
		dt.textContent = "Total cost";
		Dom.add(dt, dl);

		dd = document.createElement("dd");
		dd.setAttribute("id", "tt-md-total-cost");
		Dom.add(dd, dl);

		dt = document.createElement("dt");
		dt.textContent = "Kilometers";
		Dom.add(dt, dl);

		dd = document.createElement("dd");
		dd.setAttribute("id", "tt-md-total-km");
		Dom.add(dd, dl);

		dt = document.createElement("dt");
		dt.textContent = "Days";
		Dom.add(dt, dl);

		dd = document.createElement("dd");
		dd.setAttribute("id", "tt-md-total-days");
		Dom.add(dd, dl);

		Dom.add(wrap, 'main');
	},

	showMap = function (d, Vis, path) {
		var coords = path.centroid(d),
			bounds = path.bounds(d);

		d3.select("#tt-country").text(d.properties.name);

		d3.select("#tt-days").text(d.properties.days);

		d3.select("#tt-km").text(d.properties.km);

		d3.select("#tt-overview")
			.style("z-index", "1")
			//.transition()
			.style("opacity", "1")
			.style("top", function() {
				return (bounds[0][1] / 2600 * 100) + "%";
			})
			.style("left", function() {
				return (coords[0] / 960 * 100) + "%";
			});
	},

	showMoneyDivision = function(d, country, offset, x, y, radius) {
		d3.select("#tt-md-name").text(d.data[0]);

		d3.select("#tt-md-val").text(d.data[1] + " \u20AC");

		d3.select("#tt-md-total-days").text(country.properties.days);

		d3.select("#tt-md-total-cost").text(country.properties.moneyTotal + " \u20AC");

		d3.select("#tt-md-total-km").text(country.properties.km + " km.");

		d3.select("#tt-md")
			.style("z-index", "1")
			//.transition()
			.style("opacity", "1")
			.style("left", function() {
				return ((offset[0] + x) / 960  * 100) + "%";
			})
			.style("top", function() {
				return (((offset[1] + y) / 2600 * 100) - (radius / 2600 * 100) - 0.95) + "%";
			});

	},

	showMoneyPerDay = function(d, offset, x, y) {

		d3.select("#tt-mpd-country").text(d.properties.name);

		d3.select("#tt-mpd-days").text(d.properties.days);

		d3.select("#tt-mpd-cost").text(d.properties.moneyPerDay + " \u20AC");

		d3.select("#tt-mpd")
			.style("z-index", "1")
			//.transition()
			.style("opacity", "1")
			.style("left", function() {
				return ((offset[0] + x + 16.5) / 960 * 100) + "%";
			})
			.style("top", function() {
				return ((offset[1] + y + 16) / 2600 * 100) + "%";
			});
	},

	/**
	 * Hide the tooltip
	 * @param  {Object} d Data element
	 * @return {Void}
	 */
	hide = function (type) {
		d3.select("#tt-" + type)
			//.transition()
			//.delay(300)
			.style("opacity", "0")
			.style("z-index", "-1");
	};

	return {
		create: create,
		showMap : showMap,
		showMoneyPerDay : showMoneyPerDay,
		showMoneyDivision : showMoneyDivision,
		hide : hide
	};
});