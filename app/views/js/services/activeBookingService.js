angular.module('activeBookingService', [])

	.factory('ActiveBooking', function(){

		var activeBookingFactory = {};

		activeBookingFactory.activeBooking = false;

		activeBookingFactory.setActiveBooking = function(value){
			activeBookingFactory.activeBooking = value;
		};

		activeBookingFactory.getActiveBooking = function(){
			return activeBookingFactory.activeBooking;
		}

		return activeBookingFactory;
	});