
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
	// Display title
	$('div#title').text(game.currentGroup.name);
	
	if (game.getLongestStreak() == game.getCurrentStreak()) 
	{
		// Hide current streak
		$('div#currentStreak').hide();
		// Set longest streak style to highlightedStreak
		$('div#longestStreak').attr('class', 'highlightedStreak')
	}
	else
	{
		// Show current streak
		$('div#currentStreak').show();
		// Set longest streak style back to streak
		$('div#longestStreak').attr('class', 'streak')
	}

	// Update longest streak
	$('div#longestStreak div.streakValue').text(game.getLongestStreak());

	// Update current streak
	$('div#currentStreak div.streakValue').text(game.getCurrentStreak());
	
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
			'<img src="../img/flag/' + game.solution.id + '.svg"/></div>');

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
				'<img src="../img/flag/' + element.id + '.svg"/>' + '</div></div>');
		}
	}
}