angular.module('calendarService', [])

	.factory('Calendar', ['$http', function($http){

		var calendarFactory = {};

		calendarFactory.date = new Date();

		//Get All Bookings
		calendarFactory.all = function(){
			return $http.get('/api/bookings');
		};

		calendarFactory.range = function(start, end){
			var path = '/api/bookings?startDate=' + start + '&endDate=' + end;
			console.log(path);
			return $http.get(path);
		};

		return calendarFactory;

	}]);