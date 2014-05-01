console.log("SYMba loaded.");

var USER_SPEED = 1000;
var OPTIONS_FILTER = ['HEADER', 'FOOTER', 'DIV', 'A', 'UL', 'LI', 'SECTION', 'TABLE', 'TR', 'TD', 'THEAD', 'TBODY', 'IMG', 'BUTTON', 'INPUT', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
var extension_url = chrome.extension.getURL('');
var sidebar_html = ['<div class="symba" id="symba-navigation">',
		    '<ul class="symba" id="symba-ul">',
		'<li class="symba"><input type="image" src="' + extension_url + 'images/up-level.png" alt="Up" id="symba-up-button" class="symba" height="32" width="32"></li>',
		'<li class="symba"><input type="image" src="' + extension_url + 'images/home.png" alt="Home" id="symba-home-button" class="symba" height="32" width="32"></li>',
		'<li class="symba"><input type="image" src="' + extension_url + 'images/back.png" alt="Back" id="symba-back-button" class="symba" height="32" width="32"></li>',
		'<li class="symba"><input type="image" src="' + extension_url + 'images/forward.png" alt="Forward" id="symba-forward-button" class="symba" height="32" width="32"></li>',
		'<li class="symba"><input type="image" src="' + extension_url + 'images/switch-tab.png" alt="Switch Tab" id="symba-switch-tab-button" class="symba" height="32" width="32"></li>',
		'<li class="symba"><input type="image" src="' + extension_url + 'images/new-tab.png" alt="New Tab" id="symba-new-tab-button" class="symba" height="32" width="32"></li>',
		'<li class="symba"><input type="image" src="' + extension_url + 'images/pause.png" alt="Pause" id="symba-pause-button" class="symba" height="32" width="32"></li>',
	'</ul>',
'</div>'].join('\n');

document.body.outerHTML = sidebar_html + document.body.outerHTML;

var parent = $('body');
var options = filterOptions($(parent).children());
var branch = [];
var index = 0;
var prevIndex = 0;
var paused = false;
var bypass = false;

$('#symba-up-button').click(function(event){
	branch.pop();
	branch.pop();
	branch.pop();
	if(branch.length > 0)
		parent = branch.pop();
	else
		parent = $('body');
	options = filterOptions($(parent).children());
	console.log(options);
	index = 0;
	prevIndex = 0;
	bypass = true;
	//zoom.out();
});

$('#symba-home-button').click(function(event){
	window.open("https://www.google.com", '_self');
});

$('#symba-back-button').click(function(event){
	window.history.back();
});

$('#symba-forward-button').click(function(event){
	window.history.forward();
});

$('#symba-switch-tab-button').click(function(event){
	
});

$('#symba-new-tab-button').click(function(event){
	window.open("https://www.google.com", '_newtab');
});

$('#symba-pause-button').click(function(event){
	paused = true;
});

$(document).ready(function() {
	$(document).keyup(function(event){
        if(event.keyCode == 71){

        	if(paused)
        		paused = false;
        	else{

        		branch.push(parent);
        		console.log(branch);

        		elementType = $(parent).prop('tagName');
				if(elementType == 'INPUT'){
		           	$(parent).click();
		        }
            	else if(elementType == 'A')
		           	window.location.href = $(parent).attr("href");

		        if(!bypass){

            		if(options.length == 0){ // act when reaching the end of the branch
	            		parent = $('body');
            			options = filterOptions($(parent).children());
            			//setTimeout(function(){zoom.out()}, 100);
					}else{
						// set new parent
            			parent = options[prevIndex];
            			//zoom.to({element: options[prevIndex]});
						// reset options array
						options = filterOptions($(parent).children());
					}

            		while(options.length == 1 || options.length == 2 & $.inArray($('#symba-navigation'), options)){ // skip through cycles where there is only one option
	            		parent = options[options.length - 1];
            			//zoom.to({element: parent});
            			options = filterOptions($(parent).children());
            		}

            	}

				// reset cycling to first option
            	index = 0;

            	bypass = false;

        	}
        }
    });
	setInterval(function(){cycleContent()}, USER_SPEED);
});

function cycleContent(){

	if(!paused){
    	options = filterOptions($(parent).children());

		$('*').removeClass("parent");
		$('*').removeClass("options");
		$('*').removeClass("selected");

		$(parent).addClass("parent");

		for(var i = 0; i < options.length; i++)
			$(options[i]).addClass("options");

		$(options[index]).removeClass("options");
		$(options[index]).addClass("selected");

		console.log(options[index]);

		prevIndex = index;
		index++;
		if(index == options.length)
			index = 0;

		/*$('body').animate({
        	scrollTop: $(options[prevIndex]).offset().top - $(options[index]).offset().top
    	}, 200);*/
	}
}

function filterOptions(options){
	var filteredOptions = [];
	var elementType;
	var containsSymba = false;
	if(options.length == 0)
		return options;
	for(var i = 0; i < options.length; i++){
		var option_class = $(options[i]).attr('class');
		if(typeof option_class !== 'undefined' && option_class.indexOf('symba') != -1)
			containsSymba = true;
		if(isOption(options[i]))
			filteredOptions.push(options[i]);
	}
	if(!containsSymba && !(typeof $(parent).attr('class') !== 'undefined' && $(parent).attr('class').indexOf('symba') != -1))
		filteredOptions.unshift($('#symba-navigation'));
	return filteredOptions;
}

function isOption(option){
	var elementType = $(option).prop('tagName');
	if($(option).css('display') == 'none' || $(option).attr('type') == 'hidden')
		return false;
	else if($.inArray(elementType, OPTIONS_FILTER) != -1 && !(elementType == 'DIV' && !$.trim($(option).html()))) {
		return true;
	}
	else{
		var children = $(option).children();
		for(var i = 0; i < children.length; i++)
			if(isOption(children[i]))
				return true;
	}
}


/*!
 * zoom.js 0.2
 * http://lab.hakim.se/zoom-js
 * MIT licensed
 *
 * Copyright (C) 2011-2012 Hakim El Hattab, http://hakim.se
 */
var zoom = (function(){

	// The current zoom level (scale)
	var level = 1;

	// The current mouse position, used for panning
	var mouseX = 0,
		mouseY = 0;

	// Timeout before pan is activated
	var panEngageTimeout = -1,
		panUpdateInterval = -1;

	// Check for transform support so that we can fallback otherwise
	var supportsTransforms = 	'WebkitTransform' in document.body.style ||
								'MozTransform' in document.body.style ||
								'msTransform' in document.body.style ||
								'OTransform' in document.body.style ||
								'transform' in document.body.style;

	if( supportsTransforms ) {
		// The easing that will be applied when we zoom in/out
		document.body.style.transition = 'transform 0.8s ease';
		document.body.style.OTransition = '-o-transform 0.8s ease';
		document.body.style.msTransition = '-ms-transform 0.8s ease';
		document.body.style.MozTransition = '-moz-transform 0.8s ease';
		document.body.style.WebkitTransition = '-webkit-transform 0.8s ease';
	}

	document.addEventListener( 'keyup', function( event ) {
		var element = options[index];
		var position = element.getBoundingClientRect();
		mouseX = position.left;
		mouseY = position.top;
	} );

	/**
	 * Applies the CSS required to zoom in, prioritizes use of CSS3
	 * transforms but falls back on zoom for IE.
	 *
	 * @param {Number} pageOffsetX
	 * @param {Number} pageOffsetY
	 * @param {Number} elementOffsetX
	 * @param {Number} elementOffsetY
	 * @param {Number} scale
	 */
	function magnify( pageOffsetX, pageOffsetY, elementOffsetX, elementOffsetY, scale ) {

		if( supportsTransforms ) {
			var origin = pageOffsetX +'px '+ pageOffsetY +'px',
				transform = 'translate('+ -elementOffsetX +'px,'+ -elementOffsetY +'px) scale('+ scale +')';

			document.body.style.transformOrigin = origin;
			document.body.style.OTransformOrigin = origin;
			document.body.style.msTransformOrigin = origin;
			document.body.style.MozTransformOrigin = origin;
			document.body.style.WebkitTransformOrigin = origin;

			document.body.style.transform = transform;
			document.body.style.OTransform = transform;
			document.body.style.msTransform = transform;
			document.body.style.MozTransform = transform;
			document.body.style.WebkitTransform = transform;
		}
		else {
			// Reset all values
			if( scale === 1 ) {
				document.body.style.position = '';
				document.body.style.left = '';
				document.body.style.top = '';
				document.body.style.width = '';
				document.body.style.height = '';
				document.body.style.zoom = '';
			}
			// Apply scale
			else {
				document.body.style.position = 'relative';
				document.body.style.left = ( - ( pageOffsetX + elementOffsetX ) / scale ) + 'px';
				document.body.style.top = ( - ( pageOffsetY + elementOffsetY ) / scale ) + 'px';
				document.body.style.width = ( scale * 100 ) + '%';
				document.body.style.height = ( scale * 100 ) + '%';
				document.body.style.zoom = scale;
			}
		}

		level = scale;
	}

	/**
	 * Pan the document when the mosue cursor approaches the edges
	 * of the window.
	 */
	function pan() {
		var range = 0.12,
			rangeX = window.innerWidth * range,
			rangeY = window.innerHeight * range,
			scrollOffset = getScrollOffset();

		// Up
		if( mouseY < rangeY ) {
			window.scroll( scrollOffset.x, scrollOffset.y - ( 1 - ( mouseY / rangeY ) ) * ( 14 / level ) );
		}
		// Down
		else if( mouseY > window.innerHeight - rangeY ) {
			window.scroll( scrollOffset.x, scrollOffset.y + ( 1 - ( window.innerHeight - mouseY ) / rangeY ) * ( 14 / level ) );
		}

		// Left
		if( mouseX < rangeX ) {
			window.scroll( scrollOffset.x - ( 1 - ( mouseX / rangeX ) ) * ( 14 / level ), scrollOffset.y );
		}
		// Right
		else if( mouseX > window.innerWidth - rangeX ) {
			window.scroll( scrollOffset.x + ( 1 - ( window.innerWidth - mouseX ) / rangeX ) * ( 14 / level ), scrollOffset.y );
		}
	}

	function getScrollOffset() {
		return {
			x: window.scrollX !== undefined ? window.scrollX : window.pageXOffset,
			y: window.scrollY !== undefined ? window.scrollY : window.pageYOffset
		}
	}

	return {
		/**
		 * Zooms in on either a rectangle or HTML element.
		 *
		 * @param {Object} options
		 *   - element: HTML element to zoom in on
		 *   OR
		 *   - x/y: coordinates in non-transformed space to zoom in on
		 *   - width/height: the portion of the screen to zoom in on
		 *   - scale: can be used instead of width/height to explicitly set scale
		 */
		to: function( options ) {
			// Due to an implementation limitation we can't zoom in
			// to another element without zooming out first
			if( level !== 1 ) {
				//zoom.out();
			}
			else {
				options.x = options.x || 0;
				options.y = options.y || 0;

				// If an element is set, that takes precedence
				if( !!options.element ) {
					// Space around the zoomed in element to leave on screen
					var padding = 20;

					options.width = options.element.getBoundingClientRect().width + ( padding * 2 );
					options.height = options.element.getBoundingClientRect().height + ( padding * 2 );
					options.x = options.element.getBoundingClientRect().left - padding;
					options.y = options.element.getBoundingClientRect().top - padding;
				}

				// If width/height values are set, calculate scale from those values
				if( options.width !== undefined && options.height !== undefined ) {
					options.scale = Math.max( Math.min( window.innerWidth / options.width, window.innerHeight / options.height ), 1 );
				}

				if( options.scale > 1 ) {
					options.x *= options.scale;
					options.y *= options.scale;

					var scrollOffset = getScrollOffset();

					magnify( scrollOffset.x, scrollOffset.y, options.x, options.y, options.scale );

					if( options.pan !== false ) {

						// Wait with engaging panning as it may conflict with the
						// zoom transition
						panEngageTimeout = setTimeout( function() {
							panUpdateInterval = setInterval( pan, 1000 / 60 );
						}, 800 );

					}
				}
			}
		},

		/**
		 * Resets the document zoom state to its default.
		 */
		out: function() {
			clearTimeout( panEngageTimeout );
			clearInterval( panUpdateInterval );

			var scrollOffset = getScrollOffset();

			magnify( scrollOffset.x, scrollOffset.y, 0, 0, 1 );

			level = 1;
		},

		// Alias
		magnify: function( options ) { this.to( options ) },
		reset: function() { this.out() },

		zoomLevel: function() {
			return level;
		}
	}

})();

