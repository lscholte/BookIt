angular.module('calendarCtrl', ['calendarService'])

.controller('CalendarController', function($scope, Calendar){
	
	var vm = this;
	vm.date = new Date();
	
	Calendar.all().success(function(data){
		vm.bookings = data;
	});
	
	this.getBookingCount = function(day){
		day = new Date(day);
		var count = 0;
		for(var index in vm.bookings){
			var bookingDate = new Date(vm.bookings[index].startDate).toDateString();
			var desiredDate = day.toDateString();
			if( bookingDate == desiredDate){
				count++;
			}
		}
		return count;
	};
	
	this.weekStart = function(){
  		var day = vm.date.getDay();
     	var diff = vm.date.getDate() - day;
  		return new Date(vm.date.setDate(diff));
	};
	
	this.weekEnd = function(){
  		var day = vm.date.getDay();
     	var diff = vm.date.getDate() - day;
  		return new Date(vm.date.setDate(diff + 6));
	};
	
});