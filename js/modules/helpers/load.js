/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, jquery:true, indent:4, maxerr:50 */

define(['d3',
		'myConfig'],
	function (
		d3,
		myConfig
	) {
	"use strict";

	/**
	 * Load json data
	 * @return {Object} GeoJSON data (countries)
	 */
	var json = function (jsonPath) {
		return $.getJSON('/' + jsonPath);
	},

	/**
	 * Show error message if data could not be loaded
	 * @return {Void}
	 */
	showError = function () {
		// TODO: make this pretty
		alert("Failed to load data");
	},


	/**
	 * Extend countries with visited countries data
	 * @param  {Object} countries     All countries
	 * @param  {Object} tripCountries Visited countries
	 * @return {Object}               Extended countries
	 */
	extendCountryData = function (countries, tripCountries) {
		var tkey = null,
			ckey = 0;
		for (tkey in tripCountries.features) {
			for (ckey in countries.features) {
				if (tripCountries.features[tkey].id === countries.features[ckey].id) {
					$.extend(countries.features[ckey], tripCountries.features[tkey]);
				}
			}
		}
		return countries;
	};

	return {
		json: json,
		showError: showError,
		extendCountryData : extendCountryData
	}
});