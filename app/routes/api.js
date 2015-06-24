
//not all require's are listed here yet
var bodyParser 	= require("body-parser"),
    jwt		= require("jsonwebtoken");
var User = require('../models/user');
var Booking = require('../models/booking');

module.exports = function(app, express){

	var apiRouter = express.Router();
	//The commands below are accessed from http://localhost:1337/api/<route>
	
	apiRouter.get('/', function(req, res){
		res.json({message: 'user base page'});
	});

	//---------------------------
	//no specified user
	apiRouter.route('/users')

		//user creation
		.post(function(req, res){
			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)
			user.userType = req.body.userType;

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else 
						return res.send(err);
				}

				// return a message
				res.json({ message: 'User created!' });
			});
		})

		//get all users
		.get(function(req, res){
			console.log('Getting stuff!');
			User.find({}, function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});
	

	//---------------------------
	//with a specified user
	apiRouter.route('/users/:id')

		//return the specific user
		.get(function (req, res) {
			User.findOne({username: req.params.id}, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		//update the user's restrictions
		.post(function (req, res){
			User.findOne({username: req.params.id}, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;
				if (req.body.bannedUntil) user.bannedUntil = req.body.bannedUntil;
				if(req.body.userType) user.userType = req.body.userType;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})
		
		//remove the specific user
		.delete(function (req, res){});


	//=========================================
	//
	//Bookings below	
	//
	//---------------------------
	//no specified booking
	apiRouter.route('/bookings')
		
		//create a booking
		.post(function(req, res){})

		//get all bookings
		.get(function(req, res){
			Booking.find({}, function(err, bookings) {
				if (err) res.send(err);

				// return the users
				res.json(bookings);
			});
		});

	//--------------------------
	//with a specified booking
	apiRouter.route('/bookings/:id')

		//get the specific booking
		.get(function(req, res){
			Booking.findById(req.params.id, function(err, booking) {
				if (err) res.send(err);

				// return that user
				res.json(booking);
			});
		})

		//remove the specific booking
		.delete(function(req, res){});


	//__________________________
	//booking router with equipement
	
	apiRouter.route('/bookings/equipment/:id')
		
		//update the equipment on a booking
		.put(function(req, res){})
		
		//remove the equipment from a booking
		.delete(function(req, res){});
	
	return apiRouter;
}
