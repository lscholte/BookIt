var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BookingSchema = new Schema({
	user: {type : mongoose.Schema.ObjectId, ref : 'User' , required: true},
	room: {type : mongoose.Schema.ObjectId, ref : 'Room' , required: true},
	equipment: [{type : mongoose.Schema.ObjectId, ref : 'Equipment' }],
	startDate: {type: Date, required: true},
	endDate:  {type: Date, required: true}
});

BookingSchema.methods.setUser = function(user){
	// Set the booking's owner to another
	// Unused
	this.user = user._id;
};

BookingSchema.methods.getUser = function(){
	// Return a refrence to this booking's user
	// Unused
	return this.user;
};

BookingSchema.methods.setRoom = function(room){
	// Set a room given another
	// Unused
	this.room = room._id;
};

BookingSchema.methods.getRoom = function(){
	// Return a refrence to the room used for this booking
	// Unused
	return this.room;
};

BookingSchema.methods.setEquipment = function(equipment){
	// Set the equipment booked with this booking
	// Unused
	this.equipment = equipment;
};

BookingSchema.methods.getEquipment = function(){
	// Return a refrence to the equipment used in this booking
	// Unused
	return this.equipment;
};

BookingSchema.methods.setStartDate = function(date){
	// Set the start date and time to this booking
	this.startDate = date;
};

BookingSchema.methods.getStartDate = function(){
	// Return the date associated with the start of this booking
	return this.startDate;
};

BookingSchema.methods.setEndDate = function(date){
	// Set the end date and time of this booking
	this.endDate = date;
};

BookingSchema.methods.getEndDate = function(){
	// Return the date associated with the end of this booking
	return this.endDate;
};

module.exports = mongoose.model('Booking', BookingSchema);