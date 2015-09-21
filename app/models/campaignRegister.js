var mongoose= require('mongoose');
var Schema= mongoose.Schema;

var registerFieldSchema = new Schema({name: String, value: String },{ noId: true });

var CampaignRegisterSchema   = new Schema({ 
  campaign: { type: String, required: true},
  fields: [registerFieldSchema],
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }  
});

module.exports = mongoose.model('CampaignRegister', CampaignRegisterSchema);
