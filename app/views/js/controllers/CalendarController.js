angular.module('calendarCtrl', ['calendarService'])

.controller('CalendarController', function($scope, Calendar){

	var vm = this;
	vm.date = new Date();

	//loads all the bookings
	Calendar.all().success(function(data){
		vm.bookings = data;
	});

	// returns the number of available booking time slots on a given day
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
				var duration = Math.floor((new Date().getTime(vm.bookings[index].endDate) - bookingDate.getTime())/(60*60*1000));
				count-=duration;
			}
		}
		return count;
	};

	//Get date object for the Sunday of week specified by vm.date
	vm.weekStart = function(){
  		var day = vm.date.getDay();
     	var diff = vm.date.getDate() - day;
  		return new Date(vm.date.setDate(diff));
	};

	//Get date object for the Saturday of week specified by vm.date
	vm.weekEnd = function(){
  		var day = vm.date.getDay();
     	var diff = vm.date.getDate() - day;
  		return new Date(vm.date.setDate(diff + 6));
	};

	//Change current week to the next week
	vm.nextWeek = function(){
		vm.date.setDate(vm.date.getDate() + 7);
	};

	//change current week to the previous week
	vm.lastWeek = function(){
		vm.date.setDate(vm.date.getDate() - 7);
	};	

	vm.currentDay = function(){
		var day = vm.date.getDay();
		return new Date(vm.date.setDate(day));
	};

	vm.nextDay = function(){
		vm.date.setDate(vm.date.getDate() + 1);
	};

	vm.prevDay = function(){
		vm.date.setDate(vm.date.getDate() - 1);
	};

	vm.isABooking = function(room, startingTime){

		bookingsList = vm.booking;
		for(booking in bookingsList){
			if(booking.room == room){
				if(booking.startTime == startingTime)
					return "O";
			}
		}
		return "X";
	};
	
});