(function($) {
	$.fn.jkScrollTo = function(settings) {
		var config = {
			speed : 800,
			offset :  120
		};

		if (settings) $.extend(config, settings);
		
		this.each(function() {

			$(this).click(function (event) {

				event.preventDefault();

				var target, 
					targetOffset;

				if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {

					target = $(this.hash);
					target = target.length && target || $('[name=' + this.hash.slice(1) +']');

					if (target.length) {

						targetOffset = target.offset().top - config.offset;

						$('html,body')
							.animate({scrollTop: targetOffset}, config.speed, function () {
								location.hash = $(target).attr('id');
							});
					}
				}
			});
		});
		return this;
	};
})(jQuery);