var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// user schema
var UserSchema = new Schema({
	name: String,
	bannedUntil: Date,
	bookingID: String,
	userType: { type: String, required: true, enum: ['student', 'staff_faculty', 'admin']},
	username: { type: String, required: true, index: { unique: true }},
	password: { type: String, required: true, select: false }
});

// hash the password before the user is saved
UserSchema.pre('save', function(next) {
	var user = this;

	// hash the password only if the password has been changed or user is new
	if (!user.isModified('password')) return next();

	// generate the hash
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);

		// change the password to the hashed version
		user.password = hash;
		next();
	});
});

UserSchema.methods.comparePassword = function(password) {
	// method to compare a given password with the database hash
	var user = this;

	//fixes weird case where an undefined value, instead of an empty string, was being sent
	if (typeof password == 'undefined'){
		password = "";
	}

	return bcrypt.compareSync(password, user.password);
};

UserSchema.methods.setName = function(name){
	// Update the user's name
	this.name = name;
};

UserSchema.methods.getName = function(){
	// Return the user's name
	return this.name;
};

UserSchema.methods.getUserType = function(){
	// Return the type of user this object represents
	return this.userType;
};

UserSchema.methods.setBannedUntil = function(date){
	// Used when a booking is deleted near it's start time
	// Set the date that the ban on this user should expire
	this.bannedUntil = date;
};

UserSchema.methods.getBannedUntil = function(){
	// Return the date and time that this user is banned until
	return this.bannedUntil;
};

UserSchema.methods.getBooking = function(){
	// Get the booking associated with this user
	return this.bookingID;
};

UserSchema.methods.setBooking = function(booking){
	// Associate this user with a booking object
	this.bookingID = booking.toString();
}

UserSchema.methods.isBanned = function(){
	// Return a boolean result stating if this user is banned or not
	if(this.bannedUntil == null){
		return false;
	}
	else{
		var currentDate = new Date();
		return this.bannedUntil.getTime() > currentDate.getTime();
	}
};


module.exports = mongoose.model('User', UserSchema);