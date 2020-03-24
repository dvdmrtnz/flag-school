
$(document).ready(function(){

	// Create a game
	game = new Game();

	// Add data
	var group = param('g');
	game.addData(data, group);

	// Display elements
	for (var i in game.data)
	{
		var e = game.data[i];
		$('div#content').append(
			'<div class="flag">' +
			'<img class="flag" src="../img/' + e.id + '.svg"/>' +
			'</div>' + 
			'<div class="info">' + e.name + '</div>');
		if (e.similar_to == undefined)
		{
			continue;
		}
		/*
		for (var j of e.similar_to)
		{
			var f = game.data[j];
			$('div#content').append(
				'<div class="flag">' +
				'<img class="flag" src="../img/' + f.id + '.svg"/>' +
				'</div>' + 
				'<div class="info">' + f.name + '</div>');
		}
		*/
	}

})

var game;
