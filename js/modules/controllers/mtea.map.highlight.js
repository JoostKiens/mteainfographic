/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, jquery:true, indent:4, maxerr:50 */

define(['d3', 
		'myConfig'], 
	function (
		d3, 
		myConfig
	) {
	"use strict";

	/**
	 * Create the highlight "layer": highlighted countries
	 * are redrawn on top of the original country
	 * @param  {Object} Vis Vizualization
	 * @return {Object}     Vizualization
	 */
	var createLayer = function(Vis) {
		Vis.hlCountry = Vis.overview
		.append("g")
			.attr("id", "hl-country");

		return Vis;
	},

	/**
	 * Show highlighted country, this happens by 
	 * drawing the country over the original country 
	 * and route.
	 * This is so the hover effect doesn't get disturbed 
	 * by hovering over the route
	 * 
	 * @param  {Object} d           Data element
	 * @param  {Object} Vis         Vizualization
	 * @param  {Func}   path        Projection path
	 * @return {Void}
	 */
	show = function (d, Vis, path, callback) {

		Vis.hlCountry
			.selectAll("path")
			.data([d])
			.enter()
		.append("path")
			.style("opacity", "0")
			.attr("d", path)
			.attr("class", "hl clickable")
			.on("mouseout", function (d, i) {
				hide(d);
			})
			.on("click", function (d, i) {
				if (callback) {
					callback();
				}
			})
			.transition()
			.ease("linear")
			.style("opacity", "0.5")
			.style("fill", myConfig.colors.fillHighlight)
			.style("stroke", "none");
	},

	/**
	 * Remove all highlighted countries
	 * @param  {Object} d Data element
	 * @return {Void}
	 */
	hide = function (d, callback) {
		// Hide tooltip, just in case
		if (callback) {
			callback();
		}

		// Remove all highlights
		d3.select(".hl")
			.remove();
	};


	return {
		createLayer : createLayer,
		show: show,
		hide : hide
	};
});