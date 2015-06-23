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
	this.user = user._id;
};

BookingSchema.methods.getUser = function(){
	return this.populate('user');
};

BookingSchema.methods.setRoom = function(room){
	this.room = room._id;
};

BookingSchema.methods.getRoom = function(){
	return this.populate('room');	
};

BookingSchema.methods.setEquipment = function(equipment){
	this.equipment = equipment;
};

BookingSchema.methods.getEquipment = function(){
	return this.populate('equipment');
};

BookingSchema.methods.setStartDate = function(date){
	this.startDate = date;
};

BookingSchema.methods.getStartDate = function(){
	return this.startDate;
};

BookingSchema.methods.setEndDate = function(date){
	this.endDate = date;
};

BookingSchema.methods.getEndDate = function(){
	return this.endDate;
};

module.exports = mongoose.model('Booking', BookingSchema);
