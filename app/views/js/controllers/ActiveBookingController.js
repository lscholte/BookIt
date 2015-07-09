angular.module('activeCtrl', [])

.controller('ActiveBookingController', function($rootScope, $location, $http, Auth) {

	var vm = this;
	vm.oneCall = true;

	Auth.getUser().then(function(user){
		vm.user = user.data;
	});

	vm.hasBooking = function() {
		if (vm.user.bookingID) {
			vm.populateBooking();
			return true;
		} else {
			return false;
		}
	};

	vm.populateBooking = function(){
		if (vm.oneCall){
			vm.oneCall = false;
			$http.get("/api/bookings/" + vm.user.bookingID).success(function(data){
				console.log(data);
				var own = vm.booking = {};
				own.startTime = (new Date(data.startDate)).toLocaleTimeString();
				own.endTime = (new Date(data.endDate)).toLocaleTimeString();
				own.date = (new Date(data.startDate)).toDateString();
				own.roomNumber = data.room.roomNumber;
				own.equipment = data.equipment.length == 0 ? "None" : data.equipment;
			});
		}
	};
});