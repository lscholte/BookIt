angular.module('bookingCtrl', [])

.controller('BookingController', function($scope, $location, Auth){
            
            this.days = [];
            this.selectedDay = null;
            
            this.setPotentialDays = function() {
                var d = new Date();
            
                for(var i = 0; i < 14; ++i) {
                    this.days.push(d.toDateString())
                    d.setMilliseconds(d.getMilliseconds() + 86400000);
                }
            }
            
            this.setSelectedDay = function(dayText) {
                this.selectedDay = new Date(dayText);
            }
            
            });