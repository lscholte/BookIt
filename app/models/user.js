var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// user schema 
var UserSchema   = new Schema({
	name: String,
	userType: {type: String, required: true, enum: ['student', 'staff_faculty', 'admin']},
	bannedUntil: Date,
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

	return bcrypt.compareSync(password, user.password);
};

//Todo: add setters, getters for variables

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

UserSchema.methods.isBanned = function(){
	var currentDate = new Date();
	return this.bannedUntil.now() > currentDate.now();
};


module.exports = mongoose.model('User', UserSchema);