angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $window, $location, Auth) {

	var vm = this;
	vm.user;

	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	// check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();

		// get user information on route change
		Auth.getUser()
			.then(function(data) {
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
				// if a user successfully logs in redirect to the user's type page
				if(data.success){
					// **BUG** user has to press login twice to get to correct page
					// this has to do with how getUser is handled as a user has to be actually
					// logged in to have Auth.getUser() to work... need to find a work around
					vm.routeWorkaround();
				}
				else
					vm.error = data.message;
			});
	};

	// function to handle logging out
	vm.doLogOut = function() {
		Auth.logout();
		// reset all user info
		vm.user = {};
		$window.location.path = '/login';
		$window.location.reload();
	};

	vm.routeUserType = function() {
		Auth.getUser().then(function(user){
			vm.user = user.data;
		});
		if(vm.user.userType == 'admin')
			$location.path('/admin');
		else{
			$location.path('/main');
		}
	};

	vm.routeWorkaround = function() {
		if(vm.loginData.username == "mithrandir"){
			$location.path('/admin');
		}
		else{
			$location.path('/main');
		}
	}
});
