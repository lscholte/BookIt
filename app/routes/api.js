
//not all require's are listed here yet
var bodyParser 	= require("body-parser"),
    jwt		= require("jsonwebtoken");
var User = require('../models/user');
var Booking = require('../models/booking');

module.exports = function(app, express){

	var apiRouter = express.Router();

	apiRouter.get('/', function(req, res){
		res.json({message: 'user base page'});
	});

	//---------------------------
	//no specified user
	apiRouter.route('/users')

		//user creation
		.post(function(req, res){
		})

		//get all users
		.get(function(req, res){
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
			User.findOne({username: req.params.user_id}, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		//update the user's restrictions
		.post(function (req, res){})
		
		//remove the specific user
		.delete(function (req, res){});


	//=========================================
	
	
	apiRouter.get('/', function(req, res){
		res.json({message: 'booking base page'});
	});
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
		.get(function(req, res){})

		//remove the specific booking
		.delete(function(req, res){});


	//__________________________
	//booking router with equipement
	
	apiRouter.route('/bookings/equipment/:id')
		
		//update the equipment on a booking
		.put(function(req, res){})
		
		//remove the equipment from a booking
		.delete(function(req, res){});
	
	//returns user own info
	apiRouter.get('/me', function(req, res){
		res.send(req.decoded);
	});

	return apiRouter;
}
