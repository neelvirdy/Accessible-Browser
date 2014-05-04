console.log("SYMba loaded.");

var USER_SPEED = 1200;
var SCROLL_SPEED = 800;
var TIMEOUT_SPEED = 3000;
var OPTIONS_FILTER = ['HEADER', 'FOOTER', 'DIV', 'A', 'UL', 'LI', 'SECTION', 'TABLE', 'TR', 'TD', 'THEAD', 'TBODY', 'IMG', 'BUTTON', 'INPUT', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
var extension_url = chrome.extension.getURL('');
var sidebar_html = ['<div class="symba" id="symba-navigation">',
		    '<ul class="symba" id="symba-ul">',
		'<li class="symba"><input type="image" src="' + extension_url + 'images/up-level.png" alt="Up" id="symba-up-button" class="symba" height="32" width="32"></li>',
		'<li class="symba"><input type="image" src="' + extension_url + 'images/home.png" alt="Home" id="symba-home-button" class="symba" height="32" width="32"></li>',
		'<li class="symba"><input type="image" src="' + extension_url + 'images/back.png" alt="Back" id="symba-back-button" class="symba" height="32" width="32"></li>',
		'<li class="symba"><input type="image" src="' + extension_url + 'images/forward.png" alt="Forward" id="symba-forward-button" class="symba" height="32" width="32"></li>',
		'<li class="symba"><input type="image" src="' + extension_url + 'images/refresh.png" alt="Refresh" id="symba-refresh-button" class="symba" height="32" width="32"></li>',
		'<li class="symba"><input type="image" src="' + extension_url + 'images/new-tab.png" alt="New Tab" id="symba-new-tab-button" class="symba" height="32" width="32"></li>',
		'<li class="symba"><input type="image" src="' + extension_url + 'images/switch-tab.png" alt="Switch Tab" id="symba-switch-tab-button" class="symba" height="32" width="32"></li>',
		'<li class="symba"><input type="image" src="' + extension_url + 'images/refresh.png" alt="Refresh" id="symba-refresh-button" class="symba" height="32" width="32"></li>',
		'<li class="symba"><input type="image" src="' + extension_url + 'images/pause.png" alt="Pause" id="symba-pause-button" class="symba" height="32" width="32"></li>',
		'<li class="symba"><input type="image" src="' + extension_url + 'images/leave.png" alt="Leave" id="symba-leave-button" class="symba" height="32" width="32"></li>',
	'</ul>',
'</div>'].join('\n');

document.body.outerHTML = sidebar_html + document.body.outerHTML;

var parent = $('body');
var options = filterOptions($(parent).children());
var branch = [];
var index = 0;
var prevIndex = 0;
var paused = false;
var cacheIndex = index;
var cachePrev = prevIndex;

$('#symba-up-button').click(function(event){
	upLevel(4);
	index = 0;
	prevIndex = 0;
});

function upLevel(count){
	for(var i = 0; i < count-1; i++){	
		branch.pop();
	}
	if(branch.length > 0)
		parent = branch.pop();
	else
		parent = $('body');
	options = filterOptions($(parent).children());
}

$('#symba-home-button').click(function(event){
	window.open("https://www.google.com", '_self');
});

$('#symba-back-button').click(function(event){
	window.history.back();
});

$('#symba-forward-button').click(function(event){
	window.history.forward();
});

$('#symba-refresh-button').click(function(event){
	location.reload(true);
});

$('#symba-new-tab-button').click(function(event){
	window.open("https://www.google.com", '_newtab');
});

$('#symba-switch-tab-button').click(function(event){
	e = jQuery.Event("keydown");        
	e.which = 9;
	e.ctrlKey = true;
	$("html").trigger(e);
});

$('#symba-refresh-button').click(function(event){
	window.refresh();
});

$('#symba-pause-button').click(function(event){
	$("#symba-navigation").hide();
	paused = true;
});

var timeout;

$(document).ready(function() {
	$(document).keyup(function(event){
        if(event.keyCode == 71){
		window.clearTimeout(timeout);
        	if(paused){
        		paused = false;
        		$("#symba-navigation").show();
        	}
        	else{
        		branch.push(parent);
        		console.log(branch);

        		elementType = $(parent).prop('tagName');
				if(elementType == 'INPUT')
		           	$(parent).click();
            	else if(elementType == 'A')
		           	window.location.href = $(parent).attr("href");
            	if(options.length == 0){ // act when reaching the end of the branch
					parent = $('body');
            		options = filterOptions($(parent).children());
				}else{
					// set new parent
           			parent = options[prevIndex];
					// reset options array
					options = filterOptions($(parent).children());
				}
           		while(options.length == 1 || options.length == 2 & $.inArray($('#symba-navigation'), options)){ // skip through cycles where there is only one option
            		parent = options[options.length - 1];
           			options = filterOptions($(parent).children());
            	}

				if(options.length == 0){
					cacheIndex = index;
					cachePrev = prevIndex;
					timeout = setTimeout(function(){upLevel(1); index = cacheIndex; prevIndex = cachePrev;}, TIMEOUT_SPEED);
				}

            }
			// reset cycling to first option
            index = 0;
			prevIndex = 0;
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

		if(!$(options[index]).hasClass('symba')){
		
			if(index == 0 && options.length > 0) {
				$('body').animate({			
        			scrollTop: $(parent).position().top
    			}, SCROLL_SPEED * 0.8);
			}

			else {
				$('body').animate({	
        			scrollTop: $(options[index]).position().top 
    			}, SCROLL_SPEED);
			}
			
		}

		prevIndex = index;
		index++;

		if(index == options.length) {
			index = 0;
		}
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
