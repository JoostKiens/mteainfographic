/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, jquery:true, indent:4, maxerr:50 */

define(['d3', 
		'myConfig'], 
	function (
		d3, 
		myConfig
	) {
	"use strict";

	var get = function(el) {

			if (typeof el === 'string') {

				return document.getElementById(el);

			} else {

				return el;

			}

		},

		add = function(el, dest) {

			var el = this.get(el);

			var dest = this.get(dest);

			dest.appendChild(el);

		},

		remove = function(el) {

			var el = this.get(el);

			el.parentNode.removeChild(el);

		};

	return {
		add: add,
		get: get,
		remove: remove
	}
});