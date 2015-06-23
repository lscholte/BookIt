
//not all require's are listed here yet
var bodyParser 	= require("body-parser"),
    jwt		= require("jswebtoken");

module.exports = function(app, express){

	var apiRouter = express.Router();

	apiRouter.get('/', function(req, res){
		res.json(message : 'user base page');
	});

	//---------------------------
	//no specified user
	apiRouter.route('/users')

		//user creation
		.post(function(req, res){})

		//get all users
		.get(function(req, res){});
	

	//---------------------------
	//with a specified user
	apiRouter.route('/users/:id)

		//return the specific user
		.get(function (req, res) {})

		//update the user's restrictions
		.post(function (req, res){})
		
		//remove the specific user
		.delete(function (req, res));


	//=========================================
	
	
	apiRouter.get('/', function(req, res){
		res.json(message: 'booking base page');
	});
	//---------------------------
	//no specified booking
	apiRouter.route('/bookings')
		
		//create a booking
		.post(function(req, res){})

		//get all bookings
		.get(function(req, res){});

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
