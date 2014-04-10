var USER_SPEED = 1000;
var OPTIONS_FILTER = ['HEADER', 'FOOTER', 'DIV', 'A', 'UL', 'LI', 'SECTION', 'TABLE', 'TR', 'TD', 'THEAD', 'TBODY', 'IMG', 'BUTTON', 'INPUT', 'P'];

var sidebar_html = ['<div id="symba_navigation">',
		    '<ul>',
		'<li><img src="images/up.jpg" alt="Up" height="50" width="50"></li>',
		'<li><img src="images/home.jpg" alt="Home" height="50" width="50"></li>',
		'<li><img src="images/left.jpg" alt="Left" height="50" width="50"></li>',
		'<li><img src="images/right.jpg" alt="Right" height="50" width="50"></li>',
		'<li><img src="images/switch.jpg" alt="Switch" height="50" width="50"></li>',
		'<li><img src="images/bookmarks.jpg" alt="Bookmark" height="50" width="50"></li>',
		'<li><img src="images/newtab.jpg" alt="New Tab" height="50" width="50"></li>',
		'<li><img src="images/pause.jpg" alt="Pause" height="50" width="50"></li>',
	'</ul>',
'</div>'].join('\n');

$('body').html(sidebar_html + '<div id="symba-page-content">' + $('body').html()) + '</div>';

var parent = $('body');
var options = filterOptions($(parent).children());
var branch = [];
var index = 0;
var prevIndex = 0;

$(document).ready(function() {
	/*$('#symba_navigation').animate({
		marginLeft: '15%'
	}, 300);*/

	$(document).keyup(function(event){
        if(event.keyCode == 71){

        	branch.push(parent);
        	console.log(branch);

			// set new parent
            parent = options[prevIndex];
			// reset options array
			options = filterOptions($(parent).children());

			var elementType = $(parent).prop('tagName');
			if(elementType == 'INPUT')
            	$(parent).focus();
            else if(elementType == 'A')
            	window.location.href = $(parent).attr("href");

            while(options.length == 1){ // skip through cycles where there is only one option
            	parent = $(parent).children()[0];
            	options = filterOptions($(parent).children());
            }

            if(options.length == 0){ // act when reaching the end of the branch
            	elementType = $(parent).prop('tagName');
				if(elementType == 'INPUT')
	            	$(parent).focus();
            	else if(elementType == 'A')
	            	window.location.href = $(parent).attr("href");

            	parent = $('body');
            	options = filterOptions($(parent).children());
			}

			// reset cycling to first option
            index = 0;

        }
    });
	setInterval(function(){cycleContent()}, USER_SPEED);
});

function cycleContent(){

    for(var i = 0; i < options.length; i++){
		$('*').removeClass("options");
		$('*').removeClass("selected");
	}

	for(var i = 0; i < options.length; i++)
		$(options[i]).addClass("options");

	$(options[index]).removeClass("options");
	$(options[index]).addClass("selected");

	/*

	if(prevIndex != index){
		$(options[prevIndex]).removeClass("selected");
		$(options[prevIndex]).addClass("options");
	}
	$(options[index]).removeClass("options");
	$(options[index]).addClass("selected");

	*/

	console.log(options[index]);

	prevIndex = index;
	index++;
	if(index == options.length)
		index = 0;
}

function filterOptions(options){
	var filteredOptions = [];
	var elementType;
	for(var i = 0; i < options.length; i++){
		if(isOption(options[i]))
			filteredOptions.push(options[i]);
	}
	return filteredOptions;
}

function isOption(option){
	var elementType = $(option).prop('tagName');
	if($.inArray(elementType, OPTIONS_FILTER) != -1 && $(option).attr("display") != "none"){
		return true;
	}
	else{
		var children = $(option).children();
		for(var i = 0; i < children.length; i++)
			if(isOption(children[i]))
				return true;
	}
}
