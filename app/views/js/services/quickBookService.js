angular.module('quickBookService', [])

	.factory('quickBook', function($http){
		
		var quickBookFactory = {};
		
		//startDate and endDate expected as javascript Date Objects. equipment is somthing like [laptop, projecter] to book both a laptop and a projector. returns booking id if succesful
		quickBookFactory.book = function(startDate, endDate, username, equipment, callback){
			//Find rooms
			$http.get('/api/rooms?startDate=' + startDate.getTime() + '&endDate=' + endDate.getTime()).success(function(data, status, headers, config){
				//there's no rooms in this timeslot
				if(data.length == 0){
					callback(null, "There are no available rooms during the requested time period");
				}
				//else make the booking
				$http.post('/api/bookings', {startDate: startDate.getTime(), endDate: endDate.getTime(), username: username, roomNumber: data[0].roomNumber}).success(function(data, status, headers, config){
					var bookingID = data.id;
					//if the booking has equipment...
					if(equipment.length > 0){
						//get list of unused equipment
						var equipmentIds = [];
						$http.get('/api/equipment?startDate=' + startDate.getTime() + '&endDate=' + endDate.getTime()).success(function(data, status, headers, config){
							for(var i = 0; i < equipment.length; i++){
								for(var j = 0; j < data.length; j++){
									if(equipment[i] == data[j].equipmentType){
										equipmentIds.push(data[j]._id);
										break;
									}
								}
							}
							$http.put('/api/bookings/equipment/' + bookingID, {equipmentID:equipmentIds}).success(function(data, status, headers, config){
                                callback(bookingID, null);
							});
						});
					}
					else{
						 callback(bookingID, null);
					}
				}).error(function(){
                    callback(null, "Something went wrong");
				});	
			});			
		};
		
		return quickBookFactory;
		
	});