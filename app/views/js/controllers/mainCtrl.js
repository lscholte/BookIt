angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $location, Auth) {

	var vm = this;

	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	// check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();

		// get user information on route change
		Auth.getUser()
			.success(function(data) {
				vm.user = data;
			});
	});

	// function to handle login form
	vm.doLogin = function() {

		// clear the error = '';
		vm.error = '';

		// call the Auth.login() function
		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {

				// if a user successfully logs in redirect to main page
				if(data.success)
					$location.path('/main');
				else
					vm.error = data.message;
			});
	};

	// function to handle logging out
	vm.doLogOut = function() {
		Auth.logout();
		// reset all user info
		vm.user = {};
		$location.path('/login');
	};
});