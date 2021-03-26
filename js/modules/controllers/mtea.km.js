/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, jquery:true, indent:4, maxerr:50 */

define(['jquery', 
		'd3', 
		'myConfig'], 
	function (
		$,
		d3,
		myConfig
		) {

	var s = {
		"margin" : {top: 20, right: 20, bottom: 30, left: 50},
		"outerWidth" : 960,
		"outerHeight" : 400,
		"width" : 810,
		"height" : 257
	}

	init = function (km, Vis) {

		Vis = addTitle(Vis, "How many km did we drive?", 864)

		Vis = createChart(km, Vis)
		
		return Vis;
	},
	
	createChart = function (km, Vis) {

		var parseDate = d3.time.format("%m/%d/%Y").parse;

		var x = d3.time.scale()
			.range([0, s.width]);

		var y = d3.scale.linear()
			.range([s.height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

		var line = d3.svg.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.km); });

		Vis.kmChart = Vis.append("g")
			.attr("id", "km-chart")
			.attr("transform", "translate(80, 936)");

		var data = [];

		km[0].forEach(function(d) {
			if (d.km) {
				d.date = parseDate(d.date);
				d.km = +d.km;
				d.comment = +d.comment;
				data.push(d);
			}
		});

		x.domain(d3.extent(data, function(d) { return d.date; }));
		y.domain(d3.extent(data, function(d) { return d.km; }));

		Vis.kmChart.append("text")
			.text("20,000KM")
			.attr("class", "km-text")
			.attr("transform", "translate(20, 214)");

		Vis.kmChart.append("g")
			.attr("class", "x axis km-x-axis")
			.attr("transform", "translate(0," + s.height + ")")
			.call(xAxis);

		Vis.kmChart.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(0, 0)")
			.call(yAxis)
		.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Car mileage (km)");

		Vis.kmChart.append("path")
			.datum(data)
			.attr("class", "chart-line")
			.attr("stroke-width", "4")
			.attr("stroke", "#F97743")
			.attr("fill", "none")
			.attr("d", line);

		// now rotate text on x axis
		// solution based on idea here: https://groups.google.com/forum/?fromgroups#!topic/d3-js/heOBPQF3sAY
		// first move the text left so no longer centered on the tick
		// then rotate up to get 45 degrees.
		
		Vis.kmChart.selectAll(".km-x-axis text")  // select all the text elements for the xaxis
			.attr("transform", function(d) {
				//return "translate(" + this.getBBox().height * -14.2 + ", " + (this.getBBox().height + 13) + ")rotate(-45)";
				return "translate(" + this.getBoundingClientRect().height * -14.2 + ", " + (this.getBoundingClientRect().height + 13) + ")rotate(-45)";
			});
		
		return Vis;
	},

	addTitle = function (Vis, text, yOffset) {
		Vis.append("text")
			.attr("class", "page-title h2")
			.text(text)
			.attr("text-anchor", "middle")
			.attr("transform", "translate(480, " + yOffset + ")");

		return Vis;
	},

	getWidth = function () {
		return s.outerWidth - s.margin.left - s.margin.right;
	},

	getHeight = function () {
		return s.outerHeight - margin.top - margin.bottom;
	};

	return {
		init : init
	};
});