angular.module('appBookIt.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
           
          $routeProvider

          // Route for home page
        
          // Route for login page
          .when("/login", {

                 templateUrl : 'app/views/pages/login.html',
                 controller  : 'mainController',
                 controllerAs: 'login'

                 })

           // Route for main page
           .when("/main", {
                 
                 templateUrl : 'app/views/pages/main.html',
                 controller  : 'CalendarController',

                 });
         
           // Added to remove the # from URLs
           $locationProvider.html5Mode(true);
});