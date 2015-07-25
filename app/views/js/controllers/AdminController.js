angular.module('adminCtrl', ['calendarService'])

.controller('AdminController', ['$scope', '$http', 'Calendar', '$location', function($scope, $http, Calendar, $location) {

	var vm = this;

	vm.selectedBooking = {
		user: {name: "---", username: "---"},
		startTime: "---",
		endTime: "---",
		room: "---",
		equipment: "---"
	};

	vm.resetSelectedBooking = function() {
		vm.selectedBooking = {
			user: {name: "---", username: "---"},
			startTime: "---",
			endTime: "---",
			room: "---",
			equipment: "---"
		};
	};

	Calendar.all().success(function(data){
		vm.bookings = data;
	});

	vm.editBookings = function(){
		$location.path("/admin/editbookings");
	};

	vm.isABooking = function(room, startingTime){
		bookingTime = new Date(Calendar.date);
		bookingTime.setHours(startingTime, 0, 0, 0);
		bookingsList = vm.bookings;
		// This is a naive solution: it's only checking start times, not by duration
		for(var i in bookingsList)
			if(bookingsList[i].room.roomNumber == room)
				if(bookingsList[i].startDate == bookingTime.toISOString())
					return true;
		return false;
	};

	vm.getBooking = function(room, startingTime){
		bookingTime = new Date(Calendar.date);
		bookingTime.setHours(startingTime, 0, 0, 0);
		bookingsList = vm.bookings;
		for(var i in bookingsList){
			var b = bookingsList[i];
			if(b.room.roomNumber == room){
				if(b.startDate == bookingTime.toISOString()){
					var shown = vm.selectedBooking;

					shown.user = {name: b.user.name, username: b.user.username};

					shown.startTime = (new Date(b.startDate)).toLocaleTimeString();
					shown.endTime = (new Date(b.endDate)).toLocaleTimeString();

					shown.room = b.room.roomNumber;

					shown.equipment = b.equipment.length == 0 ? "None" : b.equipment;
					if (shown.equipment != "None") {
						if (shown.equipment.length == 2) {
							shown.equipment = b.equipment[0].equipmentType == "laptop" ? "Laptop" : "Projector";
							shown.equipment += " and ";
							shown.equipment += b.equipment[1].equipmentType;
						} else {
							shown.equipment = shown.equipment[0].equipmentType == "laptop" ? "Laptop" : "Projector";
						}
					}
					return;
	}	}	}	vm.resetSelectedBooking() };
}]);
