angular.module('adminCtrl', ['calendarService'])

	.controller('AdminController', function($scope, $http, Calendar, $location) {

		var vm = this;

		Calendar.all().success(function(data){
			vm.bookings = data;
		});

		vm.editBookings() = function(){
			$location.path('/admin/editbookings');
		}

	});
