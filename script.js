
$(document).ready(function(){

	// Get groups
	var groups = data.groups;

	// Get stats
	var stats = Cookies.getJSON('stats');
	console.log(stats);

	for (e of groups)
	{
		var id = e.id;
		var name = e.name;
		var count = 0;

		// Count number of elements
		for (var i in data.elements)
		{
			var f = data.elements[i];

			if (f.group.indexOf(e.id) != -1)
			{
				count ++;
			}
		}

		// Get score
		var score = 0;
		if (stats != undefined)
		{
			var right = stats[e.id].right;
			var wrong = stats[e.id].wrong;
			var score = 100 * right / (right + wrong);
		}
		if (isNaN(score))
		{
			score = 0;
		}
		score = score.toFixed(2);

		// Display groups
		$('div#content').append(
			'<div class="option-wrapper">' +
				'<div class="option">' + 
					'<div class="title">' +
						name +
					'</div>' +
					'<div class="info">' +
						'<ul>' + 
							'<li>' + count + ' flags</li>' +
							'<li>Score: ' + score  + '%</li>' +
						'</ul>' +
					'</div>' +
				'</div>' +
				'<div class="button-wrapper">' +
					'<div class="button" onclick="window.location=\'play/?g=' + id + '\';">Play</div>' +
					'<div class="button" onclick="window.location=\'view/?g=' + id + '\';">View</div>' +
				'</div class="button-wrapper">' +
			'</div class="option-wrapper">');

		Cookies.set('aaa', 'eee');

	}

})
