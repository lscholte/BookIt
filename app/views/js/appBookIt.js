var app = angular.module('BookIt', ['ngRoute']);

app.config(function($routeProvider, $locationProvider){
           
           $routeProvider
           
           // Route for home page
           .when("/", {
                 templateUrl: 'app/views/pages/login.html'
                 })
           
           .when("/main", {
                 templateUrl: 'app/views/pages/main.html'
                 });
           
           // Added to remove the # from URLs
           $locationProvider.html5Mode(true);
           })