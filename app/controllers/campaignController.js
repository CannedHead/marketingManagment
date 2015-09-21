var Campaign = require('../models/campaign');
var CampaignField = require('../models/campanaField');

module.exports = {

	createCampaign: function(req, res, next){
	  	var newC = new Campaign({
			name:   req.body.name,
			fields: req.body.fields,
			active: req.body.active
		});

		newC.save(function(err,campaign){
			if(!err) {
				return res.json(200,{error: false, message:'New campaign has been created', campaign:campaign);
			} else {
				console.log('ERROR: ' + err);
				return res.json(500,{error:true, message:'Server connection error. Please try later'});
			}
		});
	},

	readCampaigns: function(req, res, next){
		Campaign.find().sort({created: -1}).exec(function(err,campaigns) {
			if (err){
				console.log('ERROR: ' + err);
				return res.json(500,{error:true, message:'Server connection error. Please try later'});
			} 
			if(!campaign){
				return res.json(404,{error:true, message:'Campaign not found'});
			} else {
				return res.json(200,{error: false, campaigns: campaigns);
			}
		});
	},

	readCampaignById: function(req,res,next){
		Campaign.findById(req.param.id,function(err,campaign){ 
			if (err){
				console.log('ERROR: ' + err);
				return res.json(500,{error:true, message:'Server connection error. Please try later'});
			} 
			if(!campaign){
				return res.json(404,{error:true, message:'Campaign not found'});
			} else {
				// Execute callback
				return res.json(200,{error: false, campaign: campaign);
			}
		});
	},

	readActiveCampaigns: function(req, res, next){
		Campaign.find({active: true},function(err,campaigns){
			if (err){
				console.log('ERROR: ' + err);
				return res.json(500,{error:true, message:'Server connection error. Please try later'});
			} else {
				return res.json(200,{error: false, campaigns: campaigns);
			}
		});
	}, 

	updateCampaign: function(req, resext, next){
		Campaign.findById(req.param.id, function(err, campaign) {
			if(err){
			   console.log('ERROR: ' + err);
			   return res.json(500,{error:true, message:'Server connection error. Please try later'});
			}
			if (!campaign){
			    return res.json(404,{error:true, message:'Campaign not found'});
			} else {

				campaign.name = req.body.name || campaign.name;
				campaign.active = req.body.active || campaign.active ;
				campana.update = Date.now();

				campaign.save(function (err, c){
				  if(err){
				  	console.log('ERROR: ' + err);
				  	res.json(500,{error: true, message:'Server connection error. Please try later'});		
				  } else {
				  	res.json(200,{error: flase, message:'Campaign has been updated', campaign: c});
				  }				  
				});

			}
		});  
	},

	deleteCampaign: function(req, res, next){
		Campaign.findById(req.params.id, function(err, campaign) {
			if(err){
				console.log('ERROR: ' + err);
				return res.json(500,{error:true, message:'Server connection error. Please try later'});
			}
			if(!campaign){
				return res.json(404,{error:true, message:'Campaign not found'});
			} else {
	            campaign.remove(function(err) {
	                if(!err) {
	                    console.log('Campaign has been removed');
	                    return res.json(200,{error: false, message: 'Campaign has been removed');
	                } else {
	                    console.log('ERROR: ' + err);
	                    return res.json(500,{error:true, message:'Server connection error. Please try later'});
	                }
	            })
	        }
        });
	}
	
}