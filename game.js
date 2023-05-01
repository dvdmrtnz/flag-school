
/**
 * Represents a game.
 *
 * @constructor
 */
function Game ()
{
	this.data = 
	{
		groups: {},
		elements: {}
	};

	this.options = [];
	this.solution = {};

	/**
	 * Adds data to the game.
	 *
	 * @param {Object} rawData Raw data.
	 */
	Game.prototype.addData = function (rawData)
	{
		// Groups
		for (var rawGroup of rawData.groups)
		{
			// Create group
			var group = new Group();
			group.id = rawGroup.id;
			group.name = rawGroup.name;
			
			// Add group to data
			this.data.groups[rawGroup.id] = group;
		}
		
		// Elements
		for (var rawElement of rawData.elements)
		{
			// Create element
			var element = new Element();
			element.id = rawElement.id;
			element.name = rawElement.name;
			
			// Add element to data
			this.data.elements[rawElement.id] = element;
			
			// Add elements to groups
			for (var g of rawElement.group)
			{
				// Check if group exists
				if (this.data.groups[g] == undefined)
				{
					console.log('ERROR: Group "' + g + '" does not exist');
					continue;
				}
				
				// Add element to group
				this.data.groups[g].elements.push(element);
			}
		}
		
		// Add similars
		for (var rawSimilarArray of rawData.similars)
		{
			// Generate similar array
			var similarArray = [];
			for (var elementId of rawSimilarArray)
			{
				// Get element
				var element = this.data.elements[elementId];
				
				// Check if element exists
				if (element == undefined)
				{
					console.log('ERROR: Element "' + element + '" does not exist');
					continue;
				}
				
				// Add to similar array
				similarArray.push(element);
			}
			
			// Add similar arrays to elements
			for (var elementA of similarArray)
			{
				for (var elementB of similarArray)
				{
					if (elementA != elementB)
					{
						elementA.similars.push(elementB);
					}
				}
			}
		}
		
		// Get stats
		this._loadStats();
	}
	
	/** 
	 * Sets a group as the current one.
	 *
	 * @param {String} id Id of the group.
	 */
	Game.prototype.setCurrentGroup = function (id)
	{
		// Check if group exists
		if (this.data.groups[id] == undefined)
		{
			console.log('ERROR: Group "' + id + '" does not exist');
			return;
		}
		else
		{
			this.currentGroup = this.data.groups[id];
		}
	}
	
	/** 
	 * Gets the score.
	 *
	 * @returns {Number} Number between 0 and 100 representing a score.
	 */
	Game.prototype.getScore = function ()
	{
		var score = 0;
		if (this.currentGroup != undefined)
		{
			score = this.currentGroup.getScore();
		}
		return score;
	}
	
	/**
	 * Gets a new set of options.
	 *
	 * @returns {Object} Object of options.
	 */
	Game.prototype.getOptions = function ()
	{
		// Empty options array
		this.options = [];
		
		var q = this.currentGroup.getOptions(6);
		this.solution = q.solution;
		this.options = q.options;
		
		return this.options;
	};
	
	/**
	 * Select an option, updating stats and view.
	 * 
	 * @param {String} id Id of the selected option.
	 */
	Game.prototype.selectOption = function (id)
	{
		var selectedOption = this.data.elements[id];
		
		// Update stats
		if (selectedOption == this.solution)
		{
			this.solution.right++;
		}
		else
		{
			this.solution.wrong++;
			selectedOption.wrong++;
		}
		
		// Save stats
		this._saveStats();
		
		// Update view
		if (selectedOption == this.solution)
		{
			$('div#' + id).addClass('correct');
			
			// Set timeout
			timeout = 500;
		}
		else
		{
			$('div#' + id).addClass('incorrect');
			$('div#' + this.solution.id).addClass('correct');
			
			// Set timeout
			timeout = 1500;
		}
		
		// Load a new question
			setTimeout(function(){
				reload();
			}, timeout);
	};
	
	/**
	 * Reset the stats.
	 */
	Game.prototype.resetStats = function ()
	{
		for (var i in this.data.elements)
		{
			var e = this.data.elements[i];
			
			e.right = 0;
			e.wrong = 0;
		}
		
		this._saveStats();
	}
	
	/**
	 * Private function to save stats to local storage.
	 *
	 * @private
	 */
	Game.prototype._saveStats = function ()
	{
		var stats = {};
		
		for (var id in this.data.elements)
		{
			var e = this.data.elements[id];
			
			stats[id] = {};
			stats[id].right = e.right;
			stats[id].wrong = e.wrong;
		}
		
		localStorage.setItem('stats', JSON.stringify(stats));
		
		this._loadStats();
	}
	
	/**
	 * Private function to load stats from local storage.
	 * 
	 * @private
	 */
	Game.prototype._loadStats = function ()
	{
		var stats = JSON.parse(localStorage.getItem('stats'));
		
		for (var id in stats)
		{
			this.data.elements[id].right = stats[id].right;
			this.data.elements[id].wrong = stats[id].wrong;
		}
	}
}

/** 
 * Represents a group of elements.
 *
 * @constructor
 * @property {String} id Id of the group.
 * @property {String} name Name of the group.
 * @property {Array} elements Array of elements of the group.
 */
function Group ()
{

	this.id = '';
	this.name = '';
	this.elements = [];
	
	this._prevsolution = {};
	this._solution = {};
	this._options = [];
	
	/**
	 * Gets the number of elements in this group.
	 *
	 * @returns {Number} Number of elements.
	 */
	Group.prototype.getNumberOfElements = function ()
	{
		return this.elements.length;
	}
	
	/**
	 * Gets a solution and an array of options from the group.
	 *
	 * @param {Integer} num Number of elements.
	 * @returns {Object} Object of solution and array of options.
	 */
	Group.prototype.getOptions = function (num)
	{
		// Save previous solution
		this._prevsolution = this._solution;
		
		// Reset options array
		this._options = [];
		
		// Get solution
		while (this._solution == this._prevsolution)
		{
			this._solution = this._getRandomElement();
		}
		
		// Include solution in options array
		this._options.push(this._solution);
		
		// Fill the rest of the options array
		while (this._options.length < num)
		{
			console.log(this._options.length);
			var e = this._getRandomElement();
			if (this._options.indexOf(e) == -1)
			{
				this._options.push(e);
			}
		}
		
		// Shuffle options array 
		this._options = shuffle(this._options);
		
		var options = {};
		options.solution = this._solution;
		options.options = this._options;
		
		return options;
	}
	
	/**
	 * Private function to get random elements.
	 *
	 * @returns {Element} Random element.
	 * @private
	 */
	Group.prototype._getRandomElement = function ()
	{
		var weights = [];
		var total = 0;

		// Calculate weights
		for (var e of this.elements)
		{
			var weight = 100;

			if (e.right > e.wrong)
			{
				// Give less weight to options that have been guessed correctly
				weight /= (e.right - e.wrong + 1);
			}
			else if (e.right < e.wrong)
			{
				// Give more weight to options that have been guessed incorrectly
				weight *= (e.wrong - e.right + 1);
			}

			/*
			weight *= Math.pow(0.5, e.right);
			weight *= Math.pow(4, e.wrong);

			// Give more weight to options similar to solution
			if (this._solution != this._prevsolution)
			{
				if (this._solution.similars != undefined && this._solution.similars.indexOf(e) != -1)
				{
					var count = this._solution.similars.length;
					weight *= (50 / count);
				}
			}
			*/
			
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
		var keys = Object.keys(this.elements);
		return this.elements[keys[i]];
	}
	
	/** 
	 * Gets the score of the group.
	 *
	 * @returns {Number} Number between 0 and 100 representing a score.
	 */
	Group.prototype.getScore = function ()
	{
		var score = 0;
		
		for (var e of this.elements)
		{
			score += e.getScore();
		}
		
		var score = score / this.getNumberOfElements();
		if (isNaN(score))
		{
			score = 0;
		}
		score = Math.round(score * 10) / 10;
		
		return score;
	}
}

/**
 * Represents an element.
 *
 * @constructor
 * @property {String} id Id of the element.
 * @property {String} name Name of the element.
 * @property {Integer} right Number of times this element was selected correctly.
 * @property {Integer} wrong Number of times this element was selected incorrectly.
 * @property {Array} similar Array of similar elements to this element.
 */
function Element ()
{
	this.id;
	this.name;
	this.right = 0;
	this.wrong = 0;
	this.similars = [];
	
	/** 
	 * Gets the score of the element.
	 *
	 * @returns {Number} Number between 0 and 100 representing a score.
	 */
	Element.prototype.getScore = function ()
	{
		var score = 100 * this.right / (this.right + this.wrong);
		if (isNaN(score))
		{
			score = 0;
		}
		score = Math.round(score * 10) / 10;
		
		return score;
	}
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