/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, jquery:true, indent:4, maxerr:50 */

define(['jquery', 
		'd3', 
		'myConfig',
		'modules/helpers/load',
		'modules/controllers/mtea.tooltip',
		'modules/controllers/mtea.map.highlight',
		'modules/controllers/mtea.country'], 
	function (
		$, 
		d3, 
		myConfig,
		load,
		tooltip,
		mapHighlight,
		country
	) {

	"use strict";

	var s = {
		/**
		 * Set the projection
		 * @type {Object}
		 */
		xy : d3.geo.mercator(),

		/**
		 * Map offset X
		 * @type {Number}
		 */
		xOffset : 90,

		/**
		 * Map offset Y
		 * @type {Number}
		 */
		yOffset : 490,

		/**
		 * Map zoom level
		 * @type {Number}
		 */
		zoom : 2500,


		/**
		 * List of route elements that should be dashed
		 * @type {Array}
		 */
		dashedLines : ["boat"],

		overviewYOffset : 72 + 72
	},

	init = function (countries, globalRoute, Vis, config) {

		var path = null;

		if (config && typeof(config) === 'object') {
			$.extend(s, config);
		}

		path = getPath();

		setSVGClasses();
		createOverviewClip();
		tooltip.create("overview");

		Vis = addTitle("How did we drive", 96);
		Vis = createOverview(Vis);
		Vis = createOverviewBound(Vis);
		Vis = drawCountries(countries, path, Vis);
		Vis = drawGlobalRoute(globalRoute[0], path, Vis);
		Vis = mapHighlight.createLayer(Vis);

		return Vis;

	},

	/**
	 * Set the page title
	 */
	addTitle = function (text, yOffset) {
		Vis.append("text")
			.attr("class", "page-title h2")
			.text(text)
			.attr("text-anchor", "middle")
			.attr("transform", "translate(480, " + yOffset + ")");

		return Vis;
	},
	/**
	 * Create clipping path for the overview
	 * @return {Void}
	 */
	createOverviewClip = function () {
		d3.select("#stage")
			.append("defs")
			.append("svg:clipPath")
				.attr("id", "overview-clip")
			.append("svg:rect")
				.attr("id", "clip-rect")
				.attr("x", "0")
				.attr("y", "0")
				.attr("width", "960")
				.attr("height", "600");
	},

	/**
	 * Set classes to svg element
	 */
	setSVGClasses = function () {
		d3.select("#stage")
			.attr("class", "overview map");
	},

	/**
	 * Create the overview "layer"
	 * @param  {Object} Vis SVG DOM object
	 * @return {Object}     SVG DOM object
	 */
	createOverview = function(Vis) {
		Vis.overview = Vis.append("g")
			.attr("id", "overview")
			.attr("transform", "translate(0, " + s.overviewYOffset + ")");

		return Vis;
	},

	/**
	 * Create the bounding box of the overview "layer"
	 * Use when scaling the overview map
	 * @param  {Object} Vis SVG DOM object
	 * @return {Object}     SVG DOM object
	 */
	createOverviewBound = function(Vis) {
		Vis.overviewBound = Vis.overview
			.append("rect")
				.attr("id", "overview-bound")
				.attr("class", "bounding-box")
				.attr("width", "960")
				.attr("height", "600")
				.attr("stroke", myConfig.colors.fillNotVisited)
				.attr("stroke-width", "12")
				.attr("clip-path", "url(#overview-clip)");

		return Vis;
	},

	/**
	 * Create the actual map with (visited) countries
	 * @param  {Object} countries GeoJSON data
	 * @param  {Object} Vis       SVG DOM object
	 * @return {Object}           Modified SVG DOM object
	 */
	drawCountries = function (countries, path, Vis) {

		Vis.countries = Vis.overview
		.append("g")
			.attr("id", "countries")
			.attr("clip-path", "url(#overview-clip)")
			.selectAll("path")
			.data(countries.features)
			.enter()
		.append("path")
			.attr("d", path)
			.attr("class", function (d) { return getCountryClasses(d); })
			.style("fill", function (d) {
				if (d.properties.visited) {
					return myConfig.colors.fillVisited;
				} else {
					return myConfig.colors.fillNotVisited;
				}
			})
			.style("stroke", function (d) {
				if (d.properties.visited) {
					return myConfig.colors.strokeVisited;
				} else {
					return myConfig.colors.strokeNotVisited;
				}
			})
			.attr("data-visited", function (d) {
				if (d.properties.visited) {
					return "1";
				} else {
					return "0";
				}
			})
			.on('mouseover', function(d, i) {
				mapHighlight.hide(d, function () {
					tooltip.hide("overview");
				});
				if (d.properties.visited) {
					tooltip.showMap(d, Vis, path);
					mapHighlight.show(d, Vis, path, function () {
						country.init(d, Vis, path, function () {
							mapHighlight.hide(d, function () {
								tooltip.hide("overview");
							});
						});
					});
				}
			})
		return Vis;
	},


	/**
	 * Draw the route: the way we drove
	 * @param  {Object} globalRoute GeoJSON path
	 * @param  {Func}   path            Projection path
	 * @param  {Object} Vis             Vizualisation
	 * @return {Object}                 Vizualisation
	 */
	drawGlobalRoute = function (globalRoute, path, Vis) {
		Vis.globalRoute = Vis.overview
		.append("g")
			.attr("id", "global-lines")
			.selectAll("path")
			.data(globalRoute.features)
			.enter()
		.append("path")
			.attr("d", path)
			.attr("class", function (d) { return getRouteClasses(d); })
			.attr("stroke-dasharray", function (d) { return getStrokeDashValue(d); })
			.attr("stroke-linecap", "round")
		.append("title")
			// Use capitalized Name, converter screws up
			.text(function (d) { return d.properties.Name; });

		return Vis;

	},

	/**
	 * Get the HTML classes for countries
	 * @param  {Object} d Path data
	 * @return {String}   HTML Classes
	 */
	getCountryClasses = function (d) {
		if (d.properties.visited) {
			return "state visited clickable";
		}
		return "state";
	},

	/**
	 * Get the HTML classes for routes
	 * @param  {Object} d Path data
	 * @return {String}   HTML Classes
	 */
	getRouteClasses = function (d) {
		return "line global-line " + d.properties.Name.toLowerCase().replace(' ', '-');
	},

	/**
	 * Get the route stroke dasharray value
	 * @param  {Object} d Path data
	 * @return {String}   Stroke dasharray value for the routes
	 */
	getStrokeDashValue = function (d) {
		if ($.inArray(d.properties.Name.toLowerCase().replace(' ', '-'), s.dashedLines) !== -1) {
			return "2, 6";
		}
		return "";
	},

	/**
	 * Get the projection path / center the map
	 * @return {Func} D3 Geo path func
	 */
	getPath = function () {
		//create translation to center grid in different area
		var translate = s.xy.translate();

		// center
		translate[0] = s.xOffset;
		translate[1] = s.yOffset;
		s.xy.translate(translate);

		//zoom in
		s.xy.scale(s.zoom);
		return d3.geo.path().projection(s.xy);
	};

	return {
		init : init
	}

});