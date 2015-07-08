angular.module('bookingCtrl', [])

.controller('BookingController', function($scope, $location, Auth){
            
            this.date = new Date();
            this.hours = ["8:00", "9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00", "10:00"];
            
            
            this.days = [];
            
            this.setPotentialDays = function() {
                var d = new Date();
            
                for(var i = 0; i < 14; ++i) {
                    this.days.push(d.toDateString())
                    d.setMilliseconds(d.getMilliseconds() + 86400000);
                }
            }
            
            });