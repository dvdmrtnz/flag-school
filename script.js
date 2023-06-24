
$(document).ready(function(){

	// Create a game
	game = new Game();

	// Add data
	game.addData(data);

	for (id in game.data.groups)
	{
		var group = game.data.groups[id];
		
		// Display groups
		$('div#list').append(
			'<div class="option-wrapper">' +
				'<div class="option">' + 
					'<div class="title-wrapper">' +
						'<div class="title">' + group.name + '</div>' +
						'<i class="fa-solid fa-list" onclick="window.location=\'view/?g=' + group.id + '\';"></i>' +
					'</div>' +
					'<div class="info">' +
						'<ul>' + 
							'<li>' + group.getNumberOfElements() + ' flags</li>' +
							'<li>Score: ' + group.getScore()  + '%</li>' +
						'</ul>' +
					'</div>' +
				'</div>' +
				'<div class="button" onclick="window.location=\'play/?g=' + group.id + '\';">' + 
					'<i class="fa-solid fa-play fa-3x"></i>' +
				'</div>' +
			'</div class="option-wrapper">');
	}
})
