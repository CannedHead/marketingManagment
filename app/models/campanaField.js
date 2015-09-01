var mongoose= require('mongoose');
var Schema= mongoose.Schema;

var campanaFieldSchema = new Schema({ 
	name: { type: String, required: true},
	value: { type: Number, required: true}
}, { noId: true });

module.exports = mongoose.model('CampanaField', campanaFieldSchema);