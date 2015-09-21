var mongoose= require('mongoose');
var Schema= mongoose.Schema;

var campaignFieldSchema = new Schema({ 
	name: { type: String, required: true},
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }  	
},{ noId: true });

module.exports = mongoose.model('CampaignField', campaignFieldSchema);