
var bodyParser = require("body-parser"),
    jwt        = require("jsonwebtoken"),
    User       = require('../models/user'),
    Booking    = require('../models/booking'),
    Room       = require('../models/room'),
    Equipment  = require('../models/equipment'),
    config     = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;


module.exports = function(app, express){

	var apiRouter = express.Router();
	//The commands below are accessed from http://localhost:8080/api/<route>

	apiRouter.get('/', function(req, res){
		res.json({message: 'Last we saw, our API was here. Have you seen it?'});
	});

	//========================================
	// Authentication for login is handled below

	//---------------------------
	// API route for login authentication

	apiRouter.post('/authenticate', function(req, res) {
		console.log("Looking for user "+req.body.username);

		// find the user
		// select the names and password explicitly since mongoose is not returning it by default
		User.findOne({
			username: req.body.username
		}).select('name username password bookingID userType').exec(function(err, user) {

			if (err) res.send(err);

			// no user with that username was found
			if(!user) {
				res.json({
					success: false,
					message: 'Invalid Username'
				});
			}

			else if (user) {

				// check if password matches
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success: false,
						message: 'Incorrect password.'
					});
				}

				else {

					// if user is found and password is right
					// create a token
					var token = jwt.sign(
					{
						name: user.name,
						userType: user.userType,
						username: user.username,
						bookingID: user.bookingID
					},
					superSecret,
					{
								expiresInMinutes: 720 // expires in 12 hours
							});

					// return the information including token as JSON
					res.json({
						success: true,
						message: 'The gods smile upon you, enjoy your token!',
						token: token
					});
				}
			}
		})
	});

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		//do logging
		console.log("API hit from " + req.connection.remoteAddress + " at " + Date());

		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		// decode token
		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, superSecret, function(err, decoded) {
				if (err) {
					return res.json({ success: false, message: "This system doesn't trust you. What could you be doing in your life to cause token authentication failure?"});
				}

				else{
					// if everything is good, save to request for use in other routes
					req.decoded = decoded;
					next(); // make sure we go to the next routes and don't stop here
				}
			});
		}

		else{

			// if there is no token
			// return an HTTP response of 403 (access forbidden) and an error message
			return res.status(403).send({
				success: false,
				message: 'No token provided. What are you even trying to do?'
			});
		}
	});

	apiRouter.get('/me', function(req, res){
		User.findOne({username: req.decoded.username}, function(err, data){
			if(err){
				console.log(err);
			}
			res.send(data);
		});
		//res.send(req.decoded);
	});

	//=========================================
	// Users are handled below

	//---------------------------
	// API route without a specified user
	apiRouter.route('/users')

		// New user creation
		.post(function(req, res){
			var user = new User();			// Create a new instance of the User model
			user.name = req.body.name;  		// Using info from the request set the users name, ...
			user.username = req.body.username;	// 	 ... username, ...
			user.password = req.body.password;	// 	 ... password, ...
			user.userType = req.body.userType;	//	 ... and user type.

			user.save(function(err) {
				if (err) {
					switch (err.code){
					// Switch for catching errors on user creation: eg. username and password requirements
						case 11000:
							return res.json({success: false, message: 'That username is taken!'});
							break;
						default:
							res.send(err);
							break;
					}
				}

				// Return a message
				res.json({ message: 'User created!' });
			});
		})

		// Get and return all users
		.get(function(req, res){
			// Find operation with no matching arguement - returns all
			User.find({}, function(err, users) {
				if (err) res.send(err);

				// Return the users
				res.json(users);
			});
		});


	//---------------------------
	// API route with a specified user
	apiRouter.route('/users/:username')

		// Return the specific (:username) user
		.get(function (req, res) {
			User.findOne({username: req.params.username}, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		//update the user's information
		.post(function (req, res){
			User.findOne({username: req.params.username}, function(err, user) {

				if (err) res.send(err);

				if(!user){
					res.status(404).send('The database exploded, thus ' + req.params.username + ' was not found.');
					return;
				}

				// Tells if the req.body is an empty object
				if (!Object.keys(req.body).length) {
					res.status(401).send("Nothing to update, make sure you're sending informaton as x-www-form-urlencoded, not just form-data!");
					return;
				}

				// Update user fields from the information in the reqest, if it exisits
				for (e in req.body) {
					switch (e) {
						case 'name':
							user.name = req.body.name;
							break;

						case 'username':
							user.username = req.body.username;
							break;

						case 'password':
							user.password = req.body.password;
							break;

						case 'bannedUntil':
							user.bannedUntil = new Date(req.body.bannedUntil);
							break;

						case 'bookingID':
							user.bookingID = req.body.bookingID;
							break;

						case 'userType':
							user.userType = req.body.userType;
							break;

						default:
							res.status(401).send({error: "The key: \'" + e + "\' doesn't exist in the user object!",
													message: "Other valid keys may OR may not have been updated!"
												});
							return;
							break;
					}
				};

				// Save the user
				user.save(function(err) {
					if (err) res.send(err);

					// Return a message
					res.status(200).json({ message: 'Thanks for wasting our server time, the user is updated...' });
				});
			});
		})

		// Remove the specific user
		.delete(function (req, res){
			User.remove({username: req.params.username}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully obliterated ' + req.params.username });
			});
		});

	//=========================================
	// Bookings are handled below

	//---------------------------
	// API route with no specified booking
	apiRouter.route('/bookings')

		// Create a booking
		//ToDo: see if there's a better way than these nested asychronous functions
		.post(function(req, res){

			var booking = new Booking();
			booking.setStartDate(new Date(parseInt(req.body.startDate)));
			booking.setEndDate(new Date(parseInt(req.body.endDate)));

			// Turn userName into user object so we can get its reference
			User.findOne({username: req.body.username}, function(err, user){

				// User doesn't exist
				if(!user){
					res.status(401).send('Where\'s ' + req.body.username + "? Oh wait, I was looking for waldo..");
					return;
				}

				// Check user doesn't have restriction
				if(user.isBanned()){
					res.status(401).send('User unable to create booking until ' + user.getBannedUntil().toLocaleString() + ' because they cancelled a booking with less than 5 hours notice');
					return;
				}

				// Check if the user has a booking already, and that that booking is for the future
				if (user.getBooking()){
					Booking.findById(user.bookingID, function(err, booking){
						if (err){
							console.log("Error finding user's booking: ");
							console.log(err);
						}
						// The beginning of a booking is for the future
						if(booking.getStartDate() >= Date()){
							res.status(401).send({error: "This user already has a booking in their name, delete it then try again.", booking: booking._id});
							return;
						}
					});
					/*res.status(401).send({error: "This user already has a booking in their name, delete it then try again.", booking: booking._id});
					return;*/
				}

				// Check that the booking isn't too long
				// Note: this checks that bookings are exactly 1, 2, or 3 hours long. This may be too restrictive
				// also allows student to create a 2 hour booking if the starttime is less thabn 2 hours away
				var duration = (booking.getEndDate().getTime() - booking.getStartDate().getTime())/(60*60*1000);
				if(user.getUserType() == 'student' && (duration != 1 && ((booking.getStartDate().getTime() - new Date().getTime())/60000 < 120 && duration > 2))){
					res.status(401).send('Students can only book rooms for 1 hour, or 2 hours if the start of the booking is 2 hours or less away');
					return;
				} else if(user.getUserType() == 'staff_faculty' && ((duration != 1 && duration != 2 && duration != 3) && ((booking.getStartDate().getTime() - new Date().getTime())/60000 < 120 && duration > 4))){
					res.status(401).send('Staff and Faculty can book rooms for either 1 hour, 2 hours or 3 hours');
					return;
				}

				// Check that booking falls within hours of operation
				var day = booking.getStartDate().getDay();
				if((day > 0 && day <6 && (booking.getStartDate().getHours() < 8 || booking.getEndDate().getHours() > 22)) || ((day == 0 || day == 6) && (booking.getStartDate().getHours() < 11 || booking.getEndDate().getHours() > 18))){
					res.status(401).send('Rooms only available 8:00am - 10:00pm Monday-Friday and 11:00am - 6:00pm Saturday-Sunday');
					return;
				}

				booking.user = user._id;

				//turn room number into room object so we can get its reference
				Room.findOne({roomNumber: req.body.roomNumber}, function(err, room){

					//Check room is available
					//Get the count of all bookings that use the same room and have:
					//	startTime <= booking.startTime && endTime >= booking.endTime or
					//	startTime >= booking.startTime && startTime < booking.endTime or
					//	endTime > booking.startTime && endTime <= booking.endTime
					Booking.count({room: room._id, $or:[{$and: [{startDate: {$lte:booking.getStartDate()}}, {endDate: {$gte:booking.getEndDate()}}]}, {$and:[{startDate: {$gte:booking.getStartDate()}}, {startDate: {$lt:booking.getEndDate()}}]}, {$and:[{endDate: {$gt:booking.getStartDate()}}, {endDate: {$lte:booking.getEndDate()}}]}]}, function(err, count){

						if(err){
							console.log(err);
						}

						if(count > 0){
							res.status(401).send('This room is already in use during this time slot');
							return;
						}

						//Otherwise this room is available!
						booking.room = room._id;

						//save the booking
						booking.save(function(err, booking) {
							if (err) {
								res.send(err);
								return;
							}
							user.bookingID = booking._id;
							user.save(function(err, user){
								if (err){
									res.send(err);
									return;
								}
								// Return a message
								res.json({ message: 'Booking created! You did something right!', id: booking._id});
							});
						});
					});
				});
			});
		})

		// Get all bookings
		.get(function(req, res){

			var query;

			// If there is a start time and end time specified in the req find only the bookings for that period
			if(req.query.startDate && req.query.endDate){
				var start = new Date(parseInt(req.query.startDate, 10));
				var end = new Date(parseInt(req.query.endDate, 10));
				query = Booking.find({$or:[{$and: [{startDate: {$lte:start}}, {endDate: {$gte:end}}]}, {$and:[{startDate: {$gte:start}}, {startDate: {$lt:end}}]}, {$and:[{endDate: {$gt:start}}, {endDate: {$lte:end}}]}]});
			}
			else{
				query = Booking.find();
			}

			// Ensure that bookings are returned with refrence to actual room, user, and equipment objects.
			query.populate('room user equipment').exec(function(err, bookings){
				if (err) res.send(err);

				// return the bookings
				res.json(bookings);
			});
		});

	//---------------------------
	// API route with a booking specified
	apiRouter.route('/bookings/:id')

		// Get the specific booking
		.get(function(req, res){
			Booking.findById(req.params.id).populate('room user equipment').exec(function(err, booking) {
				if (err) res.send(err);

				// return that booking
				res.json(booking);
			});
		})

		// Remove the specific booking
		.delete(function(req, res){
			// Find the booking
			Booking.findById(req.params.id, function (err, booking){
				if (err || !booking) {
					res.status(401).send({message: "Either there was an error, or that's not a real booking. Don't ask me!", error: err, booking: booking});
					return;
				}
				// The owner of the booking has a refrence to update too, they're doubly-linked
				User.findById(booking.user, function(err, user){
					if (err) res.send(err);
					user.bookingID = null;
					user.save(function(err, user){
						Booking.remove({_id: booking._id}, function(err, numRemoved){
							// Return a message
							res.json({ message: 'The booking was thrown towards a singularity. Good luck getting it back...' });
						});
					});
				});
			});
		});


	//---------------------------
	// API route with equipment specified

	apiRouter.route('/equipment')

		//Get equipment that is available during the specified time period
		.get(function(req, res){

			if(req.query.startDate && req.query.endDate){
				//Get all equipment books that occur at the same time:
				//	startTime < booking.startTime && endTime > booking.endTime
				//	startTime > booking.startTime && startTime < booking.endTime
				//	endTime > booking.startTime && endTime < booking.endTime
				Booking.find({$or:[{$and: [{startDate: {$lte:req.query.startDate}}, {endDate: {$gte:req.query.endDate}}]}, {$and:[{startDate: {$gte:req.query.startDate}}, {startDate: {$lt:req.query.endDate}}]}, {$and:[{endDate: {$gt:req.query.startDate}}, {endDate: {$lte:req.query.endDate}}]}]}).select('equipment').populate('equipment').exec(function(err, bookings){
					var equipmentList = [];
					bookings.forEach(function(booking){
						equipmentList.concat(booking.equipment);
					});

					//get all equipment so we can calculate available equipment
					var unusedEquipment = [];
					Equipment.find({}, function(err, allEquipment){

						if(err){
							console.log(err);
						}

						//for every piece of equipment, check if it's in list of used equipment. If it's not, append it to unused equipment list
						allEquipment.forEach(function(item){
							var itemFound = false;
							//we have to use this loop instead of array.includes() because we're comparing objects
							for(var i=0; i < equipmentList.length; i++){
								if(equipmentList[i].getId() == item.getId()){
									itemFound = true;
									break;
								}
							}

							if(!itemFound){
								unusedEquipment.push(item);
							}
						});
						// Return the equipment currently not in use
						res.json(unusedEquipment);
					});

				});
			}else{
				res.status(400).send("Please specify a startDate and an endDate for the query.");
			}
		});

	apiRouter.route('/bookings/equipment/:bookingID')

		//update the equipment on a booking
		.put(function(req, res){
			if(req.body.equipmentID){
				Booking.findById(req.params.bookingID).exec(function(err, booking) {
					if (err) res.send(err);

					// If the body contains an array, there are likely multiple items to add
					if (req.body.equipmentID instanceof Array){

						// Iterate through the items in the body
						for (var i in req.body.equipmentID){
							Equipment.findById(req.body.equipmentID[i]).exec(function(err, equip) {
								if (err) res.send(err);

								// Iterate through all equipment already attached to booking, check that none are
								// the pieces of equipment we're trying to add.
								for (var i = 0; i < booking.equipment.length; i++ ){
									var e = booking.equipment[i];
									if (e.toString() == equip._id.toString()){
										res.status(400).send("That equipment is already attached to this booking");
										return;
									}
								}
								// There can only be two pieces of equipment /per booking
								if (booking.equipment.length < 2){
									booking.equipment.push(equip);
									booking.save(function(err){
										if (err) res.send(err);
									});
								} else {
									res.status(400).send({success: "false", message: "There are already two pieces of equipment booked!"});
									return;
								}
							});
						}
						// Have finished with all the equipment from the body, time to save the updated
						// booking.
						res.json(booking);

					// Else there is only one item to add
					} else {
						// Find the equipment object
						Equipment.findById(req.body.equipmentID).exec(function(err, equip) {
							if (err) res.send(err);
							//TODO disallow same types of equipment, this only disallows the same piece equipment
							for (var i = 0; i < booking.equipment.length; i++ ){
								var e = booking.equipment[i];
								if (e.toString() == equip._id.toString()){
									res.status(400).send("That equipment is already attached to this booking");
									return;
								}
							}
							// There can only be two pieces of equipment /per booking
							if (booking.equipment.length < 2){
								booking.equipment.push(equip);
								booking.save(function(err){
									if (err) res.send(err);
								});
							} else {
								res.status(400).send({success: "false", message: "There are already two pieces of equipment booked!"});
								return;
							}
							// Have finished with all the equipment from the request body, time to save the updated booking.
							res.json(booking);
						});
					}
				});
			} else {
				res.status(400).send({message : "Specify an equipmentID in the body to add, else use /DELETE to remove all equipment" });
			}
		})

		// Remove the equipment from a booking
		.delete(function(req, res){
			// Find the booking
			Booking.findById(req.params.bookingID).exec(function(err, booking) {
				if (err) res.send(err);
				// Overwrite anything that was stored in this booking's equipment array with an empty array
				booking.equipment = [];
				booking.save(function(err){
					res.status(200).send({message : "Removed all equipment on booking, send equipmentID in /PUT body to add", booking : booking});
				});
			});
		});

	apiRouter.route('/rooms')

		//returns a list of unused rooms for a given time slot
		.get(function(req, res){
			if(req.query.startDate && req.query.endDate){
				// Get all room bookings that occur at the same time:
				//	startTime < booking.startTime && endTime > booking.endTime
				//	startTime > booking.startTime && startTime < booking.endTime
				//	endTime > booking.startTime && endTime < booking.endTime
				var start = new Date(parseInt(req.query.startDate, 10));
				var end = new Date(parseInt(req.query.endDate, 10));
				// This one liner finds all bookings that are in active within at least any part of the specified time
				Booking.find({$or:[{$and: [{startDate: {$lte:start}}, {endDate: {$gte:end}}]}, {$and:[{startDate: {$gte:start}}, {startDate: {$lt:end}}]}, {$and:[{endDate: {$gt:start}}, {endDate: {$lte:end}}]}]}).select('room').populate('room').exec(function(err, bookings){
					// Assemble the list of rooms that are currently in use
					var roomList = [];
					bookings.forEach(function(booking){
						roomList.push(booking.room);
					});

					// Assemble a list of all the empty rooms
					var emptyRooms = [];
					Room.find({}, function(err, allRooms){
						if(err) console.log(err);

						// For every room, check if it's in list of used rooms. If it's not, return it
						allRooms.forEach(function(item){
							var roomFound = false;
							// We have to use this loop instead of array.includes() because we're comparing objects
							for(var i=0; i < roomList.length; i++){
								if(roomList[i].getRoomNumber() == item.getRoomNumber()){
									roomFound = true;
									break;
								}
							}

							// Send this room back! it's empty!
							if(!roomFound){
								emptyRooms.push(item);
								return;
							}
						});
						res.json(emptyRooms);
					});
				});
			}else{
				res.status(400).send("Please specify a startDate and an endDate for the query.");
			}
		});

		return apiRouter;
	};
