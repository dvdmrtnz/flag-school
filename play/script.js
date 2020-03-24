
$(document).ready(function(){

	// Create a game
	game = new Game();

	// Add data
	var group = param('g');
	game.addData(data, group);

	// Start a game
	reload();
})

var game;

var reload = function ()
{
	// Display score
	var right = game.stats[game.group].right;
	var wrong = game.stats[game.group].wrong;
	var score = 100 * right / (right + wrong);
	if (isNaN(score))
	{
		score = 0;
	}
	score = score.toFixed(2);
	$('div#score').text('Score: ' + score + "%");
	
	// Get options
	var options = game.loadOptions();

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
		for (var element of game.options)
		{
			$('div#options').append(
				'<div class="option" id="' + element.id + '" onClick="game.checkOption(this.id)">' +
				element.name + '</div>');
		}
	}
	else
	{
		// Image as answers

		// Display name
		$('div#question').append('<div id="text">' + game.solution.name + '</div>');

		for (var element of game.options)
		{
			$('div#options').append(
				'<div class="option" id="' + element.id + '" onClick="game.checkOption(this.id)">' +
				'<div class="container">' +
				'<img src="../img/' + element.id + '.svg"/>' + '</div></div>');
		}
	}
}