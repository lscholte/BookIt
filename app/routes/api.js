
//not all require's are listed here yet
var bodyParser 	= require("body-parser"),
    jwt		= require("jsonwebtoken");
var User = require('../models/user');
var Booking = require('../models/booking');
var Room = require('../models/room');

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
				if (req.body.bannedUntil) user.bannedUntil = new Date(req.body.bannedUntil);
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
		.delete(function (req, res){
			User.remove({
				username: req.params.id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});


	//=========================================
	//
	//Bookings below	
	//
	//---------------------------
	//no specified booking
	apiRouter.route('/bookings')
		
		//create a booking
		//ToDo: see if there's a better way than these nested asychronous functions
		.post(function(req, res){
			
			var booking = new Booking();		
			booking.startDate = new Date(parseInt(req.body.startDate));
			booking.endDate = new Date(parseInt(req.body.endDate));
			
			//Turn userName into user object so we can get its reference
			User.findOne({username: req.body.username}, function(err, user){
				
				//Check user doesn't have restriction
				if(user.isBanned()){
					res.status(401).send('User unable to create booking until ' + user.getBannedUntil.toTimeString());
				}
				
				//Check that the booking isn't too long
				var duration = (booking.getEndDate().getTime() - booking.getStartDate().getTime())/(60*60*1000);
				if(user.getUserType() == 'student' && duration != 1){
					res.status(401).send('Students can only book rooms for 1 hour');
					return;	
				}
				else if(user.getUserType() == 'staff_faculty' && (duration != 1 || duration != 2 || duration != 3)){
					res.status(401).send('Staff and Faculty can book rooms for either 1 hour, 2 hours or 3 hours');
					return;
				}
				
				//Check that booking falls within hours of operation
				
				
				
				booking.user = user._id;
				//turn room number into room object so we can get its reference
				Room.findOne({roomNumber: req.body.roomNumber}, function(err, room){
					
					//Check room is available
					
					booking.room = room._id;
					
					//save the booking
					booking.save(function(err) {
						if (err) {
							res.send(err);
						}
		
						// return a message
						res.json({ message: 'Booking created!' });
					});
				});
			});
		})

		//get all bookings
		.get(function(req, res){
			Booking.find().populate('room user').exec(function(err, bookings){
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
			Booking.findById(req.params.id).populate('room user').exec(function(err, booking) {
				if (err) res.send(err);

				// return that user
				res.json(booking);
			});
		})

		//remove the specific booking
		.delete(function(req, res){
			Booking.remove({_id: req.params.id}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});


	//__________________________
	//booking router with equipement
	
	apiRouter.route('/bookings/equipment/:id')
		
		//update the equipment on a booking
		.put(function(req, res){})
		
		//remove the equipment from a booking
		.delete(function(req, res){});
	
	return apiRouter;
};
