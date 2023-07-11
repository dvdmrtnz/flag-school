
$(document).ready(function(){

	// Add service worker for offline playing
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('service-worker.js')
		.then(registration => 
		{
			console.log("Service Worker registered"); 
		}).catch(err => {
			console.log('Service Worker registration failed: ', err);
		})
	}
	
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
					'<div class="title">' + group.name + '</div>' +
					'<div class="info">' +
						'<div class="infoElement" onclick="window.location=\'view/?g=' + group.id + '\';">' +
							'<i class="fa-solid fa-flag"></i>' +
							'<div class="infoNumber">' + group.getNumberOfElements() + '</div>' +
						'</div>' +
						'<div class="infoElement">' +
							'<i class="fa-solid fa-bolt gold"></i>' +
							'<div class="infoNumber">' + group.getLongestStreak() + '</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
				'<div class="button" onclick="window.location=\'play/?g=' + group.id + '\';">' + 
					'<i class="fa-solid fa-play fa-3x"></i>' +
				'</div>' +
			'</div class="option-wrapper">');
	}
})
