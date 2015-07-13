var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RoomSchema = new Schema({
	roomNumber: {type: Number, required: true, index: {}}
});

RoomSchema.methods.setRoomNumber = function(roomNumber){
	// Update the number associated with this room
	// Unused
	this.roomNumber = roomNumber;
};

RoomSchema.methods.getRoomNumber = function(){
	// Get the number that labels and identifies this room
	return this.roomNumber;
};

module.exports = mongoose.model('Room', RoomSchema);