/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, jquery:true, indent:4, maxerr:50 */

define({
	"colors" : {
		/**
		 * Fill & stroke colors
		 */
		"fillVisited" : "#F97743",
		"strokeVisited" : "#c65e35",
		"fillNotVisited" : "#E3E3E3",
		"strokeNotVisited" : "#CCCCCC",
		"fillHighlight" : "#ED303C",
		"mapBG" : "#CBDAE6"
	},
	/**
	 * Path of countries data model
	 * @type {String}
	 */
	"countryPath" : 'js/modules/models/countries.data.json',

	/**
	 * Path of trip.countries (visited) data model
	 * @type {String}
	 */
	"tripCountriesPath" : 'js/modules/models/trip.countries.data.json',

	/**
	 * Path to trip.global.route data model
	 * @type {String}
	 */
	"tripGlobalRoutePath" : 'js/modules/models/trip.global.route.data.json',

	/**
	 * Path to trip.km data model
	 * @type {String}
	 */
	"tripKmPath" : 'js/modules/models/trip.km.data.json'
});