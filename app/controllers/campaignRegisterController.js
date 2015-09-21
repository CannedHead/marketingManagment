var CampaignRegister = require('../models/campaignRegister');

module.exports = {

	createCampaignRegister: function(req, res, next){

	  	var newR = new CampaignRegister({
			campaign:   req.body.campaign,
			fields: req.body.fields
		});

		newR.save(function(err,campaignr){
			if(!err) {
				return res.json(200,{error: false, message:'New campaign resgister has been created', register:campaignr});
			} else {
				console.log('ERROR: ' + err);
				return res.json(500,{error:true, message:'Server connection error. Please try later'});
			}
		});
	},

	readCampaignRegisters: function(req, res, next){

		CampaignRegister.find({campaign:req.param.campaignid}).sort({created: -1}).exec(function(err,campaigns) {
			if (err){
				console.log('ERROR: ' + err);
				return res.json(500,{error:true, message:'Server connection error. Please try later'});
			} 
			if(!campaign){
				return res.json(404,{error:true, message:'CampaignRegister not found'});
			} else {
				return res.json(200,{error: false, campaigns: campaigns});
			}
		});

	},

	readCampaignRegisterById: function(req,res,next){
		CampaignRegister.findById(req.param.id,function(err,campaignr){ 
			if (err){
				console.log('ERROR: ' + err);
				return res.json(500,{error:true, message:'Server connection error. Please try later'});
			} 
			if(!campaign){
				return res.json(404,{error:true, message:'CampaignRegister not found'});
			} else {
				return res.json(200,{error: false, register: campaignr});
			}
		});
	},

	updateCampaignRegister: function(req, res, next){

		CampaignRegister.findById(req.param.id, function(err, register) {
			if(err){
			   console.log('ERROR: ' + err);
			   return res.json(500,{error:true, message:'Server connection error. Please try later'});
			}
			if (!register){
			    return res.json(404,{error:true, message:'Register not found'});
			} else {

				register.fields = req.body.fields || register.fields;
				register.updated = Date.now();

				register.save(function (err, c){
				  if(err){
				  	console.log('ERROR: ' + err);
				  	res.json(500,{error: true, message:'Server connection error. Please try later'});		
				  } else {
				  	res.json(200,{error: flase, message:'Register has been updated', register: c});
				  }				  
				});

			}
		});  
	},

	deleteCampaignRegister: function(req, res, next){
		CampaignRegister.findById(req.params.id, function(err, register) {
			if(err){
				console.log('ERROR: ' + err);
				return res.json(500,{error:true, message:'Server connection error. Please try later'});
			}
			if(!register){
				return res.json(404,{error:true, message:'CampaignRegister not found'});
			} else {
	            register.remove(function(err) {
	                if(!err) {
	                    console.log('CampaignRegister has been removed');
	                    return res.json(200,{error: false, message: 'Register has been removed'});
	                } else {
	                    console.log('ERROR: ' + err);
	                    return res.json(500,{error:true, message:'Server connection error. Please try later'});
	                }
	            })
	        }
        });
	}
	
}