
$(document).ready(function(){

	// Create a game
	game = new Game();

	// Add data
	game.addData(data);

	for (id in game.data.groups)
	{
		var group = game.data.groups[id];
		
		// Display groups
		$('div#content').append(
			'<div class="option-wrapper">' +
				'<div class="option">' + 
					'<div class="title">' +
						group.name +
					'</div>' +
					'<div class="info">' +
						'<ul>' + 
							'<li>' + group.getNumberOfElements() + ' flags</li>' +
							'<li>Score: ' + group.getScore()  + '%</li>' +
						'</ul>' +
					'</div>' +
				'</div>' +
				'<div class="button-wrapper">' +
					'<div class="button" onclick="window.location=\'play/?g=' + group.id + '\';">Play</div>' +
					'<div class="button" onclick="window.location=\'view/?g=' + group.id + '\';">View</div>' +
				'</div class="button-wrapper">' +
			'</div class="option-wrapper">');
	}
})
