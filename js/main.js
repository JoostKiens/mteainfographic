require([
		"jquery", 
		"d3",
		"myConfig",
		'modules/helpers/load',
		'modules/helpers/dom',
		"modules/controllers/mtea.setstage",
		"modules/controllers/mtea.map",
		"modules/controllers/mtea.km",
		"modules/controllers/mtea.cash",
		"modules/plugins/jquery.jk.scrollto"
	], function(
		$, 
		d3,
		myConfig,
		load,
		dom,
		setStage,
		mteaMap,
		mteaKm,
		mteaCash,
		scrollTo
	) {

	$(function() {

		if ( $("html").hasClass("inlinesvg") && $("html").hasClass("svgclippaths") ) {

			$("#main").append("<div id=\"loading\" class=\"loading\" />");

			$("#main-nav").find("a").jkScrollTo();

			// Set the stage
			Vis = setStage.init();

			$("#stage").hide();

			// Load data
			$.when(
				load.json(myConfig.countryPath), 
				load.json(myConfig.tripCountriesPath),
				load.json(myConfig.tripKmPath),
				load.json(myConfig.tripGlobalRoutePath)
			).then(function (countries, tripCountries, km, globalRoute) { 
				// Success

				// Extend country data
				countries = load.extendCountryData(countries[0], tripCountries[0]);

				// Create overview map & country maps
				Vis = mteaMap.init(countries, globalRoute, Vis);

				Vis = mteaKm.init(km, Vis);
				// 
				Vis = mteaCash.init(countries, Vis);


				$("#loading").fadeOut("slow", function () {
					$("#stage").fadeIn();
				});

			}, load.showError);
		} else {
			$("#main").append("<h2><br>Sorry, Your browser does not support SVG. Try downloading Chome, Firefox or if you really have to, use IE9.<br><br></h2>");
		}
	});
});
