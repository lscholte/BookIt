angular.module('calendarService', [])

	.factory('Calendar', function($http){

		var myFactory = {};

		myFactory.all = function(){
			return  $http.get('/api/bookings')
		};

		return myFactory;

	});