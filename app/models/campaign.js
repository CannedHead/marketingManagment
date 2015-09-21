var mongoose= require('mongoose');
var Schema= mongoose.Schema;
var campaignFieldSchema = require('./campaignField');

var CampaignSchema   = new Schema({ 
  name: { type: String, required: true},
  fields: [campaignFieldSchema],
  active: {type: Boolean, default : false},
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', CampaignSchema);