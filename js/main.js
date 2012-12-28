
$(function() {
	
	var counter = 1;
	var iterationLimit = 8; // only iterate this many deep
	var pause = 1000;
	var doneStrings = [];
	var wordObj = null;
	

	$('#question-list li a').click(function(event) {
		event.preventDefault();
		var query = $(this).text().toLowerCase();
		// reset some stuff
		counter = 1;
		$('#output').empty();
		doneStrings = [];

		// set the root of the word object
		wordObj = {
			name: query,
			children: []
		};
//		getData(query);
		outputToChart(parseStrings(rootWords[$.trim(query)]));
	});
	
	var startTree = function(phraseArray) {

		counter++;
		
		// iterate over each phrase
		$.each(phraseArray, function(i, val) {
			var nextString = firstNwords(val, counter);
			
			// keep track of already returned phrases
			doneStrings.push(val);
			
			if (counter <= iterationLimit) {
				setTimeout(function() {
					console.log('getting: ' + nextString);
					getData(nextString);			
				}, pause += 1000);
			}
		});

		if (counter === (iterationLimit - 1) * 5 + 2) {
			console.log('HIT ME!');
			outputToChart(parseStrings(doneStrings));
		}
	};
	
	var getData = function(string) {
		$.ajax({
			url: 'http://clients1.google.com/complete/search',
			dataType: 'jsonp',
			data: {
				q: string,
				nolabels: 't',
				client: 'psy',
				ds: ''
			},
			success: function(response) {
				//	console.log(response);
				// first clean the data a bit and isolate the strings to their own array 
				var wordArray = [];
				$.each(response[1], function(i,val) {
					wordArray.push(stripHtml(val[0]));
				//	wordArray.push(val[0]);
				});
				startTree(wordArray);
			}
		});
	};
	
	
	
	/* Helper functions */
	var stripHtml = function(html) {
	   var tmp = $('<div>');
	   tmp.html(html);
	   return tmp.text();
	};
	
	// returns first n words in a string
	var firstNwords = function(string, n) {
		var words = string.split(" ");
	    return words.slice(0, n).join(' ');
	};

	// returns returns the nth word in a string
	var nWord = function(string, n) {
		var words = string.split(" ");
	    return words[n - 1];
	};

	// removes duplicates from array and returns cleaned array
	var deDupArray = function(arr) {
		var uniqueNames = [];
		$.each(arr, function(i, el){
		    if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
		});
		return uniqueNames;
	};

	// creates the word hierarchy object from an array of sentences 
	var parseStrings = function(strings) {
		console.log(strings);

		var strings = deDupArray(strings);

		var wordBreakDown = {};
		// for each sentence
		$.each(strings, function(instance, value) {
			var next = wordObj.children;
			console.log(next);
			// for each word
			$.each(value.split(' '), function(i, val) {
				if (i > 0 && i < 5) { // skip the root word
					var inArray = false;
					$.each(next, function(i, word) {
						if (word.name === val) {
							inArray = true;
							next = next[i].children;
						}
					});
					if (!inArray){
						next.push({
							name: val,
							children: []
						});
						next = next[next.length - 1].children;
					}
				}
			});
		});
		return wordObj;
	};


	var outputToChart = function(input) {
		var container = $('#chart')

		container.empty()
		var width = container.width(),
		    height = container.height();

		var cluster = d3.layout.cluster()
		    .size([height, width - 160]);

		var diagonal = d3.svg.diagonal()
		    .projection(function(d) { return [d.y, d.x]; });

		var svg = d3.select("#chart").append("svg")
		    .attr("width", width)
		    .attr("height", height)
		  .append("g")
		    .attr("transform", "translate(40,0)");

		var root = input;

		var nodes = cluster.nodes(root),
		  links = cluster.links(nodes);

		var link = svg.selectAll(".link")
		  .data(links)
		.enter().append("path")
		  .attr("class", "link")
		  .attr("d", diagonal);

		var node = svg.selectAll(".node")
		  .data(nodes)
		.enter().append("g")
		  .attr("class", "node")
		  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

		node.append("circle")
		  .attr("r", 4.5);

		node.append("text")
		  .attr("dx", function(d) { return d.children ? -8 : 8; })
		  .attr("dy", 3)
		  .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
		  .text(function(d) { return d.name; });


		d3.select(self.frameElement).style("height", height + "px");
	};


	

	/*
	// creates a simple JS object showing the word hierarchy from a sentence string
	var createWordTreeObject = function(sentence) {
		// split sentence into an array of words
		var stringArr = sentence.split(' ');

		// start with root word
		var previous = wordObj[stringArr[0]];
		
		//iterate over each word in the sentence and create new objects as needed
		$.each(stringArr.splice(1, stringArr.length), function(i, value) {
			// if the object doesn't exist already, create one
			if (!previous[value]) {
				previous[value] = {};
			}
			previous = previous[value];
		});
	};

	// creates a data object suitable for D3 from a sentence string 
	var createD3Object = function(sentence) {
		// split sentence into an array of words
		var stringArr = sentence.split(' ');

		var phraseObj = {
			name: stringArr[0],
			children: [],
			index: 0
		};
		var next = phraseObj.children;
		
		//iterate over each word in the sentence and create new objects
		$.each(stringArr, function(i, val) {
			if (wordObj.name !== val) {

			}
		});
		
		wordObj = mergeRecursive(wordObj, phraseObj);
		console.log(wordObj)
	};
	*/
});