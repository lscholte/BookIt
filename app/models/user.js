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

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
	var user = this;

	//fixes weird case where an undefined value, instead of an empty string, was being sent
	if (typeof password == 'undefined'){
		password = "";
	}

	return bcrypt.compareSync(password, user.password);
};

UserSchema.methods.setName = function(name){
	this.name = name;
};

UserSchema.methods.getName = function(){
	return this.name;
};

UserSchema.methods.getUserType = function(){
	return this.userType;
};

UserSchema.methods.setBannedUntil = function(date){
	this.bannedUntil = date;
};

UserSchema.methods.getBannedUntil = function(){
	return this.bannedUntil;
};

UserSchema.methods.getBooking = function(){
	return this.bookingID;
};

UserSchema.methods.setBooking = function(booking){
	this.bookingID = booking.toString();
}

UserSchema.methods.isBanned = function(){
	if(this.bannedUntil == null){
		return false;
	}
	else{
		var currentDate = new Date();
		return this.bannedUntil.getTime() > currentDate.getTime();
	}
};


module.exports = mongoose.model('User', UserSchema);