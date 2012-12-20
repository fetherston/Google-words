
$(function() {
	
	var counter = 1;
	var iterationLimit = 5; // only iterate this many deep
	var pause = 2500;
	var doneStrings = [];
	
	$('#question-list li a').click(function(event) {
		event.preventDefault();
		var query = $(this).text();
		counter = 1;
		$('#output').empty();
		doneStrings = [];
		getData(query);
	});
	
	var startTree = function(wordArray) {

		console.log(wordArray);
		counter++;
		
		$.each(wordArray, function(i, val) {
			var nextString = returnNwords(val, counter);
			console.log('next: ' +  nextString);
			
			console.log(doneStrings);
			// don't append if it's already been done 
			if ($.inArray(val, doneStrings) === -1) {
				$('#output').append($('<li>').html(val));
			}
			
			// keep track of already quierred phrases
			doneStrings.push(val);
			
			if (counter <= iterationLimit) {
				setTimeout(function() {
					console.log('getting: ' + nextString);
					getData(nextString);
					
				}, pause += 2500);
			}
		});
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
	var returnNwords = function(string, n) {
		var words = string.split(" ");
	    return words.slice(0, n).join(' ');
	};
});