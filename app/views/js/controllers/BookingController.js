angular.module('bookingCtrl', ["activeBookingService"])

.controller('BookingController', function($scope, $location, Auth, ActiveBooking){
            
            this.days = [];
            this.startTimes = [];
            this.endTimes = []
            
            this.selectedDayText = "";
            this.selectedStartTimeText = "";
            this.selectedEndTimeText = "";
            
            this.startTime = null;
            this.endTime = null;
            
            //this.activeBooking = ActiveBooking.getActiveBooking();
            this.activeBooking = function(){
                return ActiveBooking.activeBooking;
            };
            
            this.setParameters = function() {
                this.setPotentialDays();
                this.setStartTimes();
                this.setEndTimes();
            };
            
            this.setPotentialDays = function() {
                var d = new Date();
            
                for(var i = 0; i < 14; ++i) {
                    this.days.push(d.toDateString())
                    d.setMilliseconds(d.getMilliseconds() + 86400000);
                }
                this.selectedDayText = this.days[0];
                this.setStartEndDay();
            };
            
            this.setStartEndDay = function() {
                this.startTime = new Date(this.selectedDayText);
                this.endTime = new Date(this.selectedDayText);
            }
            
            this.setStartTime = function() {
                this.startTime = new Date(this.startTime.toDateString() + " " + this.selectedStartTimeText);
            }
            
            this.setEndTime = function() {
                this.endTime = new Date(this.endTime.toDateString() + " " + this.selectedEndTimeText);
            }

            
            this.setStartTimes = function() {
                var day = new Date(this.selectedDayText);
                if(day.getDay() == 0 || day.getDay() == 6) {
                    this.startTimes = ["11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
                }
                else {
                    this.startTimes = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];
                }
                this.selectedStartTimeText = this.startTimes[0];
                this.setStartTime();
            
            };
            
            this.setEndTimes = function() {
                var hour = this.startTime.getHours() + 1;
                if(hour > 12) {
                    hour -= 12;
                    this.endTimes = [hour + ":00 PM"];
                }
                else {
                    if(hour == 12) {
                        this.endTimes = [hour + ":00 PM"];
                    }
                    else {
                        this.endTimes = [hour + ":00 AM"];
                    }
                }
                this.selectedEndTimeText = this.endTimes[0];
            };
            
            });