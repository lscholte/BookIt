angular.module('bookingCtrl', ["activeBookingService"])

.controller('BookingController', function($scope, $location, Auth, ActiveBooking){
            
            //All of this stuff currently relates to
            //the quickbook feature, so maybe it is worth
            //making this the quickbook controller and
            //creating a new controller for the other
            //booking process
            
            this.dayDropdownItems = [];
            this.startTimeDropdownItems = [];
            this.endTimeDropdownItems = []
            
            this.selectedDayText = "";
            this.selectedStartTimeText = "";
            this.selectedEndTimeText = "";
            
            this.bookingStartTime = null;
            this.bookingEndTime = null;
            
            //this.activeBooking = ActiveBooking.getActiveBooking();
            this.activeBooking = function(){
                return ActiveBooking.activeBooking;
            };
            
            this.setDayDropdownItems = function() {
                var d = new Date();
            
                for(var i = 0; i < 14; ++i) {
                    this.dayDropdownItems.push(d.toDateString())
                    d.setMilliseconds(d.getMilliseconds() + 86400000);
                }
                this.selectedDayText = this.dayDropdownItems[0];
            };
            
            this.setBookingStartTime = function() {
                this.bookingStartTime = new Date(this.selectedDayText + " " + this.selectedStartTimeText);
            }
            
            this.setBookingEndTime = function() {
                this.bookingEndTime = new Date(this.selectedDayText + " " + this.selectedEndTimeText);
            }

            
            this.setStartTimeDropdownItems = function() {
                var day = new Date(this.selectedDayText);
                if(day.getDay() == 0 || day.getDay() == 6) {
                    this.startTimeDropdownItems = ["11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
                }
                else {
                    this.startTimeDropdownItems = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];
                }
                this.selectedStartTimeText = this.startTimeDropdownItems[0];
                this.setBookingStartTime();
            
            };
            
            this.setEndTimeDropdownItems = function() {
            
                var hour = this.bookingStartTime.getHours() + 1;
                if(hour > 12) {
                    hour -= 12;
                    this.endTimeDropdownItems = [hour + ":00 PM"];
                }
                else {
                    if(hour == 12) {
                        this.endTimeDropdownItems = [hour + ":00 PM"];
                    }
                    else {
                        this.endTimeDropdownItems = [hour + ":00 AM"];
                    }
                }
                this.selectedEndTimeText = this.endTimeDropdownItems[0];
                this.setBookingEndTime();
            };
            
            });