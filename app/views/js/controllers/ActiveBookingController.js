angular.module('activeCtrl', ["activeBookingService"])

.controller('ActiveBookingController', function($rootScope, $location, $http, Auth, ActiveBooking) {

	var vm = this;
	vm.oneCall = true;
	vm.activeBookingService = ActiveBooking;
    
    vm.equipmentTypes = ["Projector", "Laptop"];

	Auth.getUser().then(function(user){
		vm.user = user.data;
	});

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

	vm.populateBooking = function(){
		if (vm.oneCall){
			vm.oneCall = false;
			$http.get("/api/bookings/" + vm.user.bookingID).success(function(data){
				if(new Date(data.endDate).getTime() > new Date().getTime()){
					var own = vm.booking = {};
					own.startDate = data.startDate; //for checking for ban
					own.startTime = (new Date(data.startDate)).toLocaleTimeString();
					own.endTime = (new Date(data.endDate)).toLocaleTimeString();
					own.date = (new Date(data.startDate)).toDateString();
					own.roomNumber = data.room.roomNumber;
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
		$http.delete("/api/bookings/" + vm.user.bookingID).success(function(data){
			// slap this user with a ban!
			if((new Date(vm.booking.startDate).getTime() - new Date().getTime())/(60*60*1000) < 5 ){
				var banDate = new Date();
				banDate.setDate(banDate.getDate() + 1);
				$http.post('/api/users/' + vm.user.username, {bannedUntil:banDate.getTime()}).success(function(){});
			}
			vm.user.bookingID = null;
			vm.booking = {};
			ActiveBooking.setActiveBooking(false);
			
		});
	};
});