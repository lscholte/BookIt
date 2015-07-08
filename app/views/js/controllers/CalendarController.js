angular.module('calendarCtrl', [])

.controller('CalendarController', function($scope, $location, Auth){
	
	this.date = new Date();
	
	this.weekStart = function(){
  		var day = this.date.getDay();
     	var diff = this.date.getDate() - day;
  		return new Date(this.date.setDate(diff));
	};
	
	this.weekEnd = function(){
  		var day = this.date.getDay();
     	var diff = this.date.getDate() - day;
  		return new Date(this.date.setDate(diff + 6));
	};
});