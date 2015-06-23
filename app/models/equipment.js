var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EquipmentSchema = new Schema({
	id: {type: Number, required: true, index: {unique: true}},
	equipmentType: {type: String, required: true, enum: ['laptop', 'projector']}
});

EquipmentSchema.methods.getId = function(){
	return this.id;
};

EquipmentSchema.methods.setEquipmentType = function(equipmentType){
	this.equipmentType = equipmentType;
};

EquipmentSchema.methods.getEquipmentType = function(){
	return this.equipmentType;
};

module.exports = mongoose.model('Equipment', EquipmentSchema);