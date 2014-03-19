var USER_SPEED = 1000;
var OPTIONS_FILTER = ['HEADER', 'FOOTER', 'DIV', 'A', 'UL', 'LI', 'SECTION'];

var parent = $('body');
var options = filterOptions($(parent).children());
var branch = [];
var index = 0;
var prevIndex = 0; // must start as anything non-zero

$(document).ready(function() {
	$(document).keyup(function(event){
        if(event.keyCode == 71){

        	branch.push(parent);
        	console.log(branch);

            // remove class from old options
            for(var i = 0; i < options.length; i++)
				$(options[i]).removeClass("options");

            // remove class from old parent
            $(parent).removeClass("selected");

			// set new parent
            parent = options[prevIndex];
			// reset options array
			options = filterOptions($(parent).children());

            while(options.length == 1){ // skip through cycles where there is only one option
            	parent = $(parent).children()[0];
            	options = filterOptions($(parent).children());
            }

            if(options.length == 0){ // act when reaching the end of the branch
            	var elementType = $(parent).prop('tagName');
            	if(elementType == 'INPUT')
            		$(parent).focus();
            	else if(elementType == 'A')
            		window.location.href = $(parent).attr("href");
            	else{
            		parent = $('body');
            		options = filterOptions($(parent).children());
            	}
			}

			// reset cycling to first option
            index = 0;

			// add class to new options
			for(var i = 0; i < options.length; i++)
				$(options[i]).addClass("options");
        }
    });
	setInterval(function(){cycleContent()}, USER_SPEED);
});

function cycleContent(){
	if(prevIndex != index){
		$(options[prevIndex]).removeClass("selected");
		$(options[prevIndex]).addClass("options");
	}
	$(options[index]).removeClass("options");
	$(options[index]).addClass("selected");

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

	/*for(var i = 0; i < OPTIONS_FILTER.length; i++){
		//console.log($.find(OPTIONS_FILTER[i].toLowerCase()));
		if($.find(OPTIONS_FILTER[i].toLowerCase()).length > 0)
			return true;
	}
	return false;*/
}