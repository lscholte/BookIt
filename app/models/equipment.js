var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EquipmentSchema = new Schema({
	id: {type: Number, required: true, index: {unique: true}},
	equipmentType: {type: String, required: true, enum: ['laptop', 'projector']}
});

EquipmentSchema.methods.getId = function(){
	// Return the id of this piece of equipment
	return this.id;
};

EquipmentSchema.methods.setEquipmentType = function(equipmentType){
	// Update the equipment type
	// Unused
	this.equipmentType = equipmentType;
};

EquipmentSchema.methods.getEquipmentType = function(){
	// Get the kind of equipment this object represents
	// Unused, but should be
	return this.equipmentType;
};

module.exports = mongoose.model('Equipment', EquipmentSchema, 'Equipment');