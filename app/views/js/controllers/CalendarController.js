angular.module('calendarCtrl', ['calendarService'])

.controller('CalendarController', function($scope, Calendar){

	var vm = this;
	vm.date = new Date();

	Calendar.all().success(function(data){
		vm.bookings = data;
	});

	vm.getBookingCount = function(day){
		day = new Date(day);
		var count;

		//Figure out how many booking slots are available hypothetically, then subtract bookings that are already made
		//ToDo: ideally the initial value for count would use an api call for calculation
		if(day.getDay() == 0 || day.getDay() == 6){
			count = 70; // On weekends rooms open 11-6 (7 hours), and there's 10 rooms, so 70 = 7*10
		}
		else{
			count = 140; //weekdays, rooms open 8-10 (14 hours), and there's 10 rooms, so 140 = 14*10
		}

		for(var index in vm.bookings){
			var bookingDate = new Date(vm.bookings[index].startDate).toDateString();
			var desiredDate = day.toDateString();
			if( bookingDate == desiredDate){
				count--;
			}
		}
		return count;
	};

	vm.weekStart = function(){
  		var day = vm.date.getDay();
     	var diff = vm.date.getDate() - day;
  		return new Date(vm.date.setDate(diff));
	};

	vm.weekEnd = function(){
  		var day = vm.date.getDay();
     	var diff = vm.date.getDate() - day;
  		return new Date(vm.date.setDate(diff + 6));
	};

	vm.nextWeek = function(){
		vm.date.setDate(vm.date.getDate() + 7);
	};

	vm.lastWeek = function(){
		vm.date.setDate(vm.date.getDate() - 7);
	};

});