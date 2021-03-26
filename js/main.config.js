var require = {
	paths : {
		'd3' : 'vendor/d3.v3',
		'myConfig' : 'modules/config/myconfig',
	},
	shim : {
		'd3' : {
			exports : 'd3'
		}
	}
	// Cache busting, remove before going live
	//urlArgs: "bust=" +  (new Date()).getTime()
};