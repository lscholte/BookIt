var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RoomSchema = new Schema({
	roomNumber: {type: Number, required: true, index: {}}
});

RoomSchema.methods.setRoomNumber = function(roomNumber){
	this.roomNumber = roomNumber;
};

RoomSchema.methods.getRoomNumber = function(){
	return this.roomNumber;
};

module.exports = mongoose.model('Room', RoomSchema);