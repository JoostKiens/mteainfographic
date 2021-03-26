/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, jquery:true, indent:4, maxerr:50 */

define(['d3'], function (d3) {
	"use strict";


	var s = {
		/**
		 * Chart margin
		 * @type {Object}
		 */
		margin : {
			top: 30,
			right: 30,
			bottom: 30,
			left : 30
		},
		/**
		 * Chart width
		 * @return {Integer} Chart width in px
		 */
		width : function () {
			return 960 - this.margin.right - this.margin.left;
		},
		/**
		 * Chart height
		 * @type {Integer} Chart height in px
		 */
		height : function () {
			return 2600 - this.margin.top - this.margin.bottom;
		},
		/**
		 * The ID of the container of the map
		 * @type {String}
		 */
		containerId : 'main',

		/**
		 * The viewBox attribute value
		 * @return {String} Value for viewBox attribute
		 */
		viewBox : function () {
			return '0 0 ' + (this.width() + this.margin.left + this.margin.right)  + ' ' + (this.height() + this.margin.top + this.margin.bottom);
		},
	},

	/**
	 * Create the Vis stage
	 * @return {Object} SVG object
	 */
	init = function (config) {

		if (config && typeof(config) === 'object') {
			$.extend(s, config);
		}

		// Create svg
		var Vis = d3.select("#" + s.containerId).append("div")
			.attr("id", "svg-wrap")
			.append("svg")
			.attr("preserveAspectRatio", "xMidYMin meet")
			//.attr("width", s.width() + s.margin.left + s.margin.right)
			//.attr("height", s.height() + s.margin.top + s.margin.bottom)
			.attr('id', 'stage')
			.attr("viewBox", s.viewBox());

		/* To add a dropshadow
		// see: http://stackoverflow.com/questions/6088409/svg-drop-shadow-using-css3
		var filter = Vis.append("filter")
			.attr("id", "dropshadow")
			.attr("opacity", "0.5")
			.attr("height", "130%");

		filter.append("feGaussianBlur")
			.attr("in", "SourceAlpha")
			// stdDeviation is how much to blur
			.attr("stdDeviation", "1.5");

		filter.append("feOffset")
			// how much to offset
			.attr("dx", "0")
			.attr("dy", "0")
			.attr("result", "offsetblur");

		var feMerge = filter.append("feMerge");

		// this contains the offset blurred image
		feMerge.append("feMergeNode");
			

		// this contains the element that the filter is applied to
		feMerge.append("feMergeNode")
			.attr("in", "SourceGraphic");
		*/

		/*
		<filter id="dropshadow" height="130%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="3"/> 
  <feOffset dx="2" dy="2" result="offsetblur"/> <!-- how much to offset -->
  <feMerge> 
    <feMergeNode/> <!-- this contains the offset blurred image -->
    <feMergeNode in="SourceGraphic"/> <!-- this contains the element that the filter is applied to -->
  </feMerge>
</filter>
		 */
		/*
		Vis.append("g")
			//.attr("clip-path", "url(#clip)")
			.attr("transform", "translate(" + s.margin.left + "," + s.margin.top + ")");
*/

		return Vis;
	};

	return {
		init: init
	};
});