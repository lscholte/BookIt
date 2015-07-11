angular.module('quickBookService', [])

	.factory('quickBook', function($http){
		
		var quickBookFactory = {};
		
		//startDate and endDate expected as javascript Date Objects. equipment is somthing like [laptop, projecter] to book both a laptop and a projector. returns booking id if succesful
		quickBookFactory.book = function(startDate, endDate, username, equipment){
			//Find rooms
			$http.get('/api/rooms?startDate=' + startDate.getTime() + '&endDate=' + endDate.getTime()).success(function(data, status, headers, config){
				//there's no rooms in this timeslot
				if(data.length == 0){
					return null;
				}
				//else make the booking
				$http.post('/api/bookings', {startDate: startDate.getTime(), endDate: endDate.getTime(), username: username, roomNumber: data[0].roomNumber}).success(function(data, status, headers, config){
					//if the booking has equipment...
					if(equipment.length > 0){
						//get list of unused equipment
						/*$http.get('/api/equipment').success(function(data, status, headers, config){
							for(var i = 0; i < equipment.length; i++){
								
							}
						});*/
					}
					else{
						return data.id;
					}
				}).error(function(){
					return null;
				});	
			});			
		};
		
		return quickBookFactory;
		
	});