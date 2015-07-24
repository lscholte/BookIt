angular.module('calendarCtrl', ['calendarService'])

.controller('CalendarController', function($scope, Calendar){

	var vm = this;
	vm.date = new Date();
    vm.hours = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM"];

	//loads all the bookings
	Calendar.all().success(function(data){
		vm.bookings = data;
	});
    
    vm.getBookingCount = function(day, time){
        day = new Date(day);
        day = new Date(day.toDateString() + " " + time);
        console.log(day.toISOString());
        var hour = day.getHours();
        
        if((day.getDay() == 0 || day.getDay() == 6) && (hour < 11 || hour > 17) || hour < 8 || hour > 21) {
            return "N/A";
        }
        
        var count = 10;
        
        for(var index in vm.bookings){
            var bookingDate = new Date(vm.bookings[index].startDate).toISOString();
            var desiredDate = day.toISOString();
            if( bookingDate == desiredDate){
                --count;
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
		vm.date.setTime(vm.date.getTime() + 7*86400000);
	};

	//change current week to the previous week
	vm.lastWeek = function(){
		vm.date.setTime(vm.date.getTime() - 7*86400000);
	};

	vm.currentDay = function(){
		return vm.date.toDateString();
	};

	vm.nextDay = function(){
		vm.date.setTime(vm.date.getTime() + 86400000);
	};

	vm.prevDay = function(){
		vm.date.setTime(vm.date.getTime() - 86400000);
	};

	vm.isABooking = function(room, startingTime){

		bookingsList = vm.booking;
		for(booking in bookingsList){
			console.log(booking.startTime + " == " + startingTime + " :: " + booking.startTime == startingTime);
			if(booking.room == room){
				if(booking.startTime == startingTime){
					return "O";
				}
			}
		}
		return "X";
	};
});