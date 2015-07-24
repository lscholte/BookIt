angular.module('calendarService', [])

	.factory('Calendar', function($http){

		var calendarFactory = {};

		//Get All Bookings
		calendarFactory.all = function(){
			return $http.get('/api/bookings');
		};

		calendarFactory.range = function(start, end){
				return $http.get('/api/bookings?startDate=' + start + '&endDate=' + end);
		};

		return calendarFactory;

	});