
$(document).ready(function(){

	// Create a game
	game = new Game();

	// Add data
	game.addData(data);
	
	// Set current group
	var group = param('g');
	if (group == '')
	{
		group = 'world';
	}
	game.setCurrentGroup(group);

	// Display elements
	for (var element of game.currentGroup.elements)
	{
		$('div#content').append(
			'<div class="flag">' +
			'<img class="flag" src="../img/' + element.id + '.svg"/>' +
			'</div>' + 
			'<div class="info">' + element.name + '</div>');
	}

})

var game;
