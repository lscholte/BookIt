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
                        callback("A requested piece of equipment is not available during your booking time");
                        return;
                    }
                    
                    if(equipmentIds.length > 0) {
                        $http.put('/api/bookings/equipment/' + bookingID, {equipmentID:equipmentIds}).success(function(data, status, headers, config){
                            callback("Your booking has been successfully updated");
                        }).error(function(data, status, headers, config) {
                            //can't get booking
                            callback(null, "Failed to add equipment to booking for unknown reason");
                            return;
                        });
                    }
                    callback("Your booking has been successfully updated");
                });
            });
            
         
            

            
            
            
            
            
            
//            
//            $http.get('/api/bookings/' + bookingID).success(function(data, status, headers, config) {
//                var bookedEquipment = data.equipment; //booked equipment array
//                var startDate = data.startDate; //String
//                var endDate = data.endDate; //String
//                
//                for(var i = 0; i < equipment.length; ++i) {
//                    for(var j = 0; j < bookedEquipment.length; j++) {
//                        if(equipment[i] == bookedEquipment[j].equipmentType) {
//                            equipment.splice(i, 1);
//                            break;
//                        }
//                    }
//                }
//                
//                console.log(equipment);
//                
//                $http.get('/api/equipment?startDate=' + startDate + '&endDate=' + endDate).success(function(data, status, headers, config) {
//                    
//                    var equipmentIds = [];
//                    for(var i = 0; i < equipment.length; i++){
//                        for(var j = 0; j < data.length; j++){
//                            if(equipment[i] == data[j].equipmentType){
//                                equipmentIds.push(data[j]._id);
//                                break;
//                            }
//                        }
//                    }
//                    
//                    if(equipmentIds.length != equipment.length){
//                        callback("A requested piece of equipment is not available during your booking time");
//                        return;
//                    }
//                    
//                    $http.put('/api/bookings/equipment/' + bookingID, {equipmentID:equipmentIds}).success(function(data, status, headers, config){
//                        callback("Your booking has been successfully updated");
//                    }).error(function(data, status, headers, config) {
//                        //can't get booking
//                        callback(null, "Failed to add equipment to booking for unknown reason");
//                        return;
//                    });
//                });
//
//                
//                
//            }).error(function(data, status, headers, config) {
//                //can't get booking
//                callback(null, "Can't get the booking");
//                return;
//            });
        };

		return quickBookFactory;

	});