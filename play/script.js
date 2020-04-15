
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

	// Start a game
	reload();
})

var game;

var reload = function ()
{
	// Display score
	$('div#score').text('Score: ' + game.getScore() + "%");
	
	// Get options
	var options = game.getOptions();

	// Remove question
	$('div#question').html('');

	// Remove options
	$('div#options').html('');

	// Get question style
	var imageasquestion = getRandomNumber(2);

	if (imageasquestion)
	{
		// Image as question

		// Display image
		$('div#question').append(
			'<div class="container">' +
			'<img src="../img/' + game.solution.id + '.svg"/></div>');

		// Display options
		for (var element of options)
		{
			$('div#options').append(
				'<div class="option" id="' + element.id + '" onClick="game.selectOption(this.id)">' +
				element.name + '</div>');
		}
	}
	else
	{
		// Image as answers

		// Display name
		$('div#question').append('<div id="text">' + game.solution.name + '</div>');

		for (var element of options)
		{
			$('div#options').append(
				'<div class="option" id="' + element.id + '" onClick="game.selectOption(this.id)">' +
				'<div class="container">' +
				'<img src="../img/' + element.id + '.svg"/>' + '</div></div>');
		}
	}
}