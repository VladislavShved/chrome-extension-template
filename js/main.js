/*
** file: js/main.js
** description: javascript code for "html/main.html" page
*/

jQuery.each( [ "put", "delete" ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback
    });
  };
});

function init_main () {
	chrome.storage.sync.get('userid', function(items) {
		var userid = items.userid;
		if (userid != null) {
			$.get('https://chrome-counter-backend.herokuapp.com/counters/', {id: userid}).success(function(result) {
				if (result != null) {
					$('#main-count-wrapper').show()
					$counter = $('#main-counter')
					$counter.text(result.count_number)
				}
			})
		}
	})
    $('html').hide().fadeIn('slow');
}

function getRandomToken() {
    // E.g. 8 * 32 = 256 bits token
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
    return hex;
}

function main_button_click() {
	$('#main-count-wrapper').show()
	$counter = $('#main-counter')
	currentValue = $counter.text()
	new_counter = false
	if (currentValue == '') {
		new_counter = true
		$counter.text('1')
	} else {
		currentValue = parseInt(currentValue) + 1
		$counter.text(currentValue)
	}
	chrome.storage.sync.get('userid', function(items) {
		var userid = items.userid;
		if (userid) {
		    useToken(userid);
		} else {
		    userid = getRandomToken();
		    chrome.storage.sync.set({userid: userid}, function() {
		        useToken(userid);
		    });
		}
		function useToken(userid) {
			if (new_counter == true) {
				$.post('https://chrome-counter-backend.herokuapp.com/counters/', { id: userid, value: 1 }).success(function(result) {
					console.log(result)
				})
			} else {
				$.put('https://chrome-counter-backend.herokuapp.com/counters/' + userid, { value: currentValue }).success(function(result) {
					console.log(result)
				})
			}
		}
	});	
}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);
document.getElementById('main-button').addEventListener('click', main_button_click)