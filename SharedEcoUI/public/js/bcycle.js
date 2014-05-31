// bcycle api

(function(){
	$(window).load(function() {
		se.bcycle.getLocations();
	});
	$(document).ready(function() {
	});

	se = {};
	se.bcycle = {};
	se.bcycle.key = '3F3448DE-7D56-4B22-AA2E-B78FE395B411';

	flyoutViewTemplate = $("#flyout_view");
	flyoutViewTemplate = _.template( flyoutViewTemplate.html() );

	se.bcycle.getLocations = function(artistName) {
		var urlBcycle = 'https://publicapi.bcycle.com/api/1.0/ListProgramKiosks/36';

console.log(urlBcycle);

		$.ajaxSetup({
			headers: {
				'Host': 'publicapi.bcycle.com',
				'ApiKey': '3F3448DE-7D56-4B22-AA2E-B78FE395B411',
				'Cache-Control': 'no-cache'
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader('ApiKey', '3F3448DE-7D56-4B22-AA2E-B78FE395B411');
			}
		});

		$.ajax({
			type: 'get',
			dataType: 'jsonp',
			url: urlBcycle,
			success: function(xhr) {

console.log('success');
console.log(xhr);

			},
			error: function(xhr) {

console.log('error');
console.log(xhr);

			},
			fail: function(xhr) {

console.log('fail');
console.log(xhr);

			},
			complete: function(xhr){

console.log('complete');
console.log(xhr);

			},
			always: function(xhr){

console.log('always');
console.log(xhr);

			}

		});
	};
	
})();

