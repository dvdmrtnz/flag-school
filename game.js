function Game ()
{
	this.data = {};
	this.stats = {};
	this.similars = [];

	this.options = [];
	this.solution = {};
	this.prevsolution = {};
	this.group = "";

	this.addData = function (data, groupid)
	{
		var groups = data.groups;
		var elements = data.elements;
		var similars = data.similars;

		// Check if the group exists
		this.group = 'world';
		for (var i in groups)
		{
			if (groupid == groups[i].id)
			{
				this.group = groupid;
			}
		}

		// Load elements
		for (var e of elements)
		{
			if (e.group.indexOf(this.group) != -1)
			{
				var element = e;
				element.right = 0;
				element.wrong = 0;
				this.data[e.id] = element;
			}
		}

		// Load similars
		for (var i in this.data)
		{
			var e = this.data[i];
			e.similar_to = [];

			// Check if it is in an array of similars
			for (var f of similars)
			{
				if (f.indexOf(e.id) != -1)
				{
					for (var g of f)
					if (this.data[g] != undefined)
					{
						e.similar_to.push(g);
					}
				}
			}
		}

		// Load stats
		var ck_stats = Cookies.getJSON('stats');
		if (ck_stats != undefined)
		{
			this.stats = ck_stats;
		}
		else
		{
			for (var i in groups)
			{
				var e = groups[i];
				this.stats[e.id] = {};
				this.stats[e.id].id = e.id;
				this.stats[e.id].right = 0;
				this.stats[e.id].wrong = 0;
			}
			Cookies.set('stats', this.stats);
		}
	}

	this.getOption = function ()
	{
		var weights = [];
		var total = 0;

		// Calculate weights
		for (var i in this.data)
		{
			var e = this.data[i];

			var weight = 10;
			weight *= Math.pow(0.5, e.right);
			weight *= Math.pow(4, e.wrong);

			// Give more weight to options similar to solution
			if (this.solution != this.prevsolution)
			{
				var similar_to = this.solution.similar_to;
				if (similar_to != undefined && similar_to.indexOf(e.id) != -1)
				{
					var count = similar_to.length;
					weight *= (50 / count);
				}
			}

			weights.push(weight);
			total += weight;
		}

		// Normalize weights
		for (var i in weights)
		{
			weights[i] = weights[i] / total;
		}

		// Get random number between 0 and 1
		random = Math.random();

		// Find matching element
		var max = 0;
		for (var i = 0; i < weights.length; i++)
		{
			max += weights[i];
			if (random < max)
			{
				break;
			}
			if (i == weights.length - 1)
			{
				break;
			}
		}

		// Return element
		var keys = Object.keys(this.data);
		return this.data[keys[i]];

	}

	this.loadOptions = function ()
	{
		// Empty options array
		this.options = [];

		// Save previous solution
		this.prevsolution = this.solution;

		// Get solution
		while (this.solution == this.prevsolution)
		{
			this.options[0] = this.getOption();
			this.solution = this.options[0];
		}

		// Fill options array
		for (var i = 0; i < 5; i++)
		{
			// Get random option
			var option = this.getOption();
			
			// Check for duplicates and push to options array
			if (this.options.indexOf(option) != -1)
			{
				i--;
			}
			else
			{
				this.options.push(option);
			}
		}

		// Shuffle array
		this.options = shuffle(this.options);
	};

	this.checkOption = function (id)
	{
		// Get selected option
		for (var option of this.options)
		{
			if (option.id == id)
			{
				break;
			}
		}

		// Check if correct
		if (option == this.solution)
		{
			$('div#' + id).addClass('correct');
			// Increment counters
			this.stats[this.group].right++;
			this.solution.right++;
			// Save stats
			Cookies.set('stats', this.stats);
			// Set timeout
			timeout = 500;
		}
		else
		{
			$('div#' + id).addClass('incorrect');
			$('div#' + this.solution.id).addClass('correct');
			// Increment counters
			this.stats[this.group].wrong++;
			this.solution.wrong++;
			option.wrong++;
			// Save stats
			Cookies.set('stats', this.stats);
			// Set timeout
			timeout = 1500;
		}

		// Load a new question
			setTimeout(function(){
				reload();
			}, timeout);
	};
}

var getRandomNumber = function (max)
{
	return max * Math.random() << 0;
}

function shuffle(array)
{
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function param(name)
{
	return (location.search.split(name + '=')[1] || '').split('&')[0];
}