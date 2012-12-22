
$(function() {
	
	var counter = 1;
	var iterationLimit = 5; // only iterate this many deep
	var pause = 2500;
	var doneStrings = [];
	var wordObj = {};
	
	$('#question-list li a').click(function(event) {
		event.preventDefault();
		var query = $(this).text().toLowerCase();
		// reset some stuff
		counter = 1;
		$('#output').empty();
		doneStrings = [];
		wordObj = new Object;

		//start the root of the word obj
		wordObj[$.trim(query)] = {};
		getData(query);
	});
	
	var startTree = function(phraseArray) {

		console.log(phraseArray);
		counter++;
		
		// iterate over each phrase
		$.each(phraseArray, function(i, val) {
			var nextString = firstNwords(val, counter);
			var stringArr = val.split(' ');

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

			/*

			// don't append if it's already been done 
			if ($.inArray(val, doneStrings) === -1) {
			//	$('#output').append($('<li>').html(val));
			}
			
			// keep track of already quierred phrases
			doneStrings.push(val);
			*/
			if (counter <= iterationLimit) {
				setTimeout(function() {
					console.log('getting: ' + nextString);
					getData(nextString);
					
				}, pause += 2500);
			}
		});

		var newObj = jQuery.extend(true, {}, wordObj);
		console.log(newObj);
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
});