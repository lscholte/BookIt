var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BookingSchema = new Schema({
	startDate: {type: Date, required: true},
	endDate:  {type: Date, required: true}
});

module.exports = mongoose.model('Booking', BookingSchema);