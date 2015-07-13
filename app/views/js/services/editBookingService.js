angular.module('editBookingService', [])

	.factory('EditBooking', function($http){

		var quickBookFactory = {};

		quickBookFactory.editBooking = function(bookingID, startDate, endDate, equipment, callback) {
            
            
            
            //get booking
            //get the equipment associated with booking
            //remove the booking's equipment from the requested equipment
            
            $http.delete('/api/bookings/equipment/' + bookingID).success(function(data, status, headers, config) {
                $http.get('/api/equipment?startDate=' + startDate.getTime() + '&endDate=' + endDate.getTime()).success(function(data, status, headers, config) {
                    var equipmentIds = [];
                    for(var i = 0; i < equipment.length; i++){
                        for(var j = 0; j < data.length; j++){
                            if(equipment[i] == data[j].equipmentType){
                                equipmentIds.push(data[j]._id);
                                break;
                            }
                        }
                    }
                    
                    if(equipmentIds.length != equipment.length){
                        callback("A requested piece of equipment is not available during your booking time", false);
                        return;
                    }
                    
                    if(equipmentIds.length > 0) {
                        $http.put('/api/bookings/equipment/' + bookingID, {equipmentID:equipmentIds}).success(function(data, status, headers, config){
                            callback("Your booking has been successfully updated", true);
                        }).error(function(data, status, headers, config) {
                            //can't get booking
                            callback(null, "Failed to add equipment to booking for unknown reason", false);
                            return;
                        });
                    }
                    callback("Your booking has been successfully updated", true);
                });
            });
        };

		return quickBookFactory;

	});