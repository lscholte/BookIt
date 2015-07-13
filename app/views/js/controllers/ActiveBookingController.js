angular.module('activeCtrl', ["activeBookingService", "editBookingService"])

.controller('ActiveBookingController', function($rootScope, $location, $window, $http, Auth, ActiveBooking, EditBooking) {

	// Set some scope variables to help clean things up
	var vm = this;
	vm.activeBookingService = ActiveBooking;
    vm.equipmentTypes = ["Projector", "Laptop"];

    // This is a bit of a hacky boolean to stop a page from trying to run the call to populate bookings more than once
	vm.oneCall = true;

	// Get the user for whom we're to display an active booking.
	Auth.getUser().then(function(user){
		vm.user = user.data;
	});

	// Boolean getter for changing page display states, returns true if a user has a booking, false otherwise.
	vm.hasBooking = function() {
		if (vm.user && vm.user.bookingID) {
			vm.populateBooking();
			ActiveBooking.setActiveBooking(true);
			return true;
		} else {
			ActiveBooking.setActiveBooking(false);
			return false;
		}
	};

	// Called when hasBooking() returns true. Sets scope variables for angular to use to display on main page
	vm.populateBooking = function(){
		if (vm.oneCall){
			vm.oneCall = false;
			$http.get("/api/bookings/" + vm.user.bookingID).success(function(data){
				if(new Date(data.endDate).getTime() > new Date().getTime()){
					// Nest this information in a new object
					var own = vm.booking = {};
					own.startDate = data.startDate; //for checking for ban
                    own.endDate = data.endDate;
					own.startTime = (new Date(data.startDate)).toLocaleTimeString();
					own.endTime = (new Date(data.endDate)).toLocaleTimeString();
					own.date = (new Date(data.startDate)).toDateString();
					own.roomNumber = data.room.roomNumber;

					// Logic for beautifying the booked equipment shown to the user
					own.equipment = data.equipment.length == 0 ? "None" : data.equipment;
					if (own.equipment != "None") {
						if (own.equipment.length == 2) {
							own.equipment = data.equipment[0].equipmentType == "laptop" ? "Laptop" : "Projector";
							own.equipment += " and ";
							own.equipment += data.equipment[1].equipmentType;
						} else {
							own.equipment = own.equipment[0].equipmentType == "laptop" ? "Laptop" : "Projector";
						}
					};
					// Tell the service that a booking is active, and the above fields are set.
					ActiveBooking.setActiveBooking(true);
					return true;
				}
				else{
                    vm.deleteBooking();
					return false;
				}
			});
		}
	};

	vm.deleteBooking = function(){
		// Delete the active booking
		$http.delete("/api/bookings/" + vm.user.bookingID).success(function(data){
			// Slap this user with a ban! (If they're deleting a booking to close to it's start time)
			if((new Date(vm.booking.startDate).getTime() - new Date().getTime())/(60*60*1000) < 5 ){
				var banDate = new Date();
				banDate.setDate(banDate.getDate() + 1);
				$http.post('/api/users/' + vm.user.username, {bannedUntil:banDate.getTime()}).success(function(){});
			}
			// Remove the properties used to test for an active booking
			vm.user.bookingID = null;
			vm.booking = {};
			ActiveBooking.setActiveBooking(false);
		});
	};

    vm.editBooking = function() {
    	// Pass information around (to the service) then update the view
        EditBooking.editBooking(vm.user.bookingID, new Date(vm.booking.startDate), new Date(vm.booking.endDate), vm.editedEquipment, function(result, success) {
            vm.editBookingResult = result;
            if(success) {
                vm.editBookingResult = result;
                $window.location.href = '/main';
            }
            vm.editBookingResult = result;
        });
        vm.editBookingResult = null;
    }

    vm.updateEquipment = function(type) {
        type = type.toLowerCase();
        var index = vm.editedEquipment.indexOf(type);
        if(index == -1) {
            vm.editedEquipment.push(type);
        }
        else {
            vm.editedEquipment.splice(index, 1);
        }
    }
});