
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

	// Display title 
	$('div#title').text(game.currentGroup.name);

	// Display elements
	for (var element of game.currentGroup.elements)
	{
		$('div#list').append(
			'<div class="option">' +
			'<div class="flag">' +
			'<img class="flag" src="../img/flag/' + element.id + '.svg"/>' +
			'</div>' + 
			'<div class="info">' + element.name + '<br>' + element.getScore() + 
			'% (' + element.right + '/' + (element.right + element.wrong) + ')' +
			'</div>' + 
			'</div>');
	}

})

var game;
