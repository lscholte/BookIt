angular.module('bookingCtrl', ["activeBookingService"])

.controller('BookingController', function($scope, $location, Auth, ActiveBooking){
            
            this.days = [];
            this.selectedDay = null;
            //this.activeBooking = ActiveBooking.getActiveBooking();
            this.activeBooking = function(){
                return ActiveBooking.activeBooking;
            };
            
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