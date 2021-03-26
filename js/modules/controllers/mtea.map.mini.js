/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, jquery:true, indent:4, maxerr:50 */

define(['d3', 
		'myConfig'], 
	function (
		d3, 
		myConfig
	) {
	"use strict";

	/**
	 * Make the map small and position in the corner
	 * @param  {Object} Vis SVG DOM object
	 * @return {Void}
	 */
	var init = function (Vis) {
		d3.select("#overview")
			.transition()
			.duration(800)
			.ease("cubic-bezier(0.785, 0.135, 0.150, 0.860)")
			.attr("transform", "scale(0.208333333), translate(" + 759 * 4.8 + ", " + 146 * 4.8 + ")");

		cover();
		addStroke(Vis);
	},

	/**
	 * Add a cover to the mini map
	 * This cover prevents tooltips, etc 
	 * and is clickable, a click returns to the overview
	 * @return {[type]} [description]
	 */
	cover = function () {
		d3.select("#overview").append("rect")
			.attr("id", "minicover")
			.attr("class", "clickable hide-country")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("transform", "translate(2, 2)")
			.attr("fill-opacity", "0");
	},

	/**
	 * Removes the mini map
	 * @return {Void}
	 */
	remove = function () {
		d3.select("#overview")
			.classed("mini", false)
			.transition()
			.duration(800)
			.ease("cubic-bezier(0.785, 0.135, 0.150, 0.860)")
			.attr("transform", "scale(1), translate(0, 144)");

		d3.select("#minicover")
			.remove();

	//	d3.select("#overview-bound")
	//		.attr("stroke-opacity", "0");
	},

	/**
	 * Add a stroke to the overview bound layer
	 * @return {Void}
	 */
	addStroke = function () {
		d3.select("#overview-bound")
			.transition()
			.delay(500)
			.duration(250)
			.attr("stroke-opacity", "1");
	};

	return {
		init : init,
		remove: remove,
		cover  : cover
	}
});