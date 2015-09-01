var Campana = require('../models/campana');
var CampanaField = require('../models/campanaField');
var moment = require('moment-timezone');
var mailer = require('../../mailers/mailer');
var CronJob = require('cron').CronJob;

module.exports = {

	createCampana: function(req, res, next){
	  	var newC = new Campana({
			nombre: req.body.name,
			fechaApertura: moment(req.body.start).tz('America/Bogota'), 
			fechaCierre: moment(req.body.end).tz('America/Bogota'),
			duplicados: req.body.duplicados,
			fields: req.body.fields
		});

		newC.save(function(err,campana){
			if(!err) {
				console.log('Nueva campana has been created');              
				// create Job
				var hours = moment(req.body.end).diff(moment(),'hours');				
				console.log('Campaña will deactivate after ' + hours + 'hours.');
				//new CronJob( new Date(moment(req.body.end).tz('America/Bogota')),function(){
				new CronJob( new Date(moment().add(hours,'minutes')),function(){
				  	mailer.close(campana.nombre);
				  	campana.active = false;
				  	campana.save(function (err){
					  if (err){
					  	throw err;		
					  }else{
					  	console.log('campana succesfully deactivated!');
					  }					  
					});
				}, null, true, 'America/Bogota');
				
				// JSON response
				return res.json(200,{success: true});
			} else {
				console.log('ERROR: ' + err);
				return res.json({success: false, error:'Se ha producido un error en la conexión. Intentelo mas tarde'});
			}
		});
	},

	readCampanas: function(callback){
		Campana.find().sort({fechaApertura: -1}).exec(function(err,campanas) {
			if (err){
				throw err;
			}
			else{
				// Execute callback
				callback(null,campanas);
			}
		});
	},

	isCampanaActive: function(req,res){
		Campana.find({active: true},function(err,campanas) {
			if (err){
				res.json({success: false, err: "Ha sucedido un error en la conexion."});	
			}
			else if(!campanas[0]){
				res.json({success: false, err: "El registro de ventas se encuentra deshabilitado."});	
			}
			else{
				res.json({success: true});
			}
		});
	},

	getCampanaActive: function(callback){
		Campana.find({active: true},function(err,campana){
			if (err){
				throw err;
			}
			else{
				// Execute callback
				callback(null,campana);
			}
		});
	},  

	readCampanaById: function(id, callback){
		Campana.findById(id,function(err,campana){ 
			if (err){
				callback(err,[]);
			} else {
				// Execute callback
				callback(null,campana);
			}
		});
	},

	updateCampana: function(req, res){
		Campana.findById(req.query.id, function(err, campana) {
		  if(err){
			  res.json({success: false, err: err});
		  }
		  if (!campana){
			  res.json({success: false, err: "Campana not found"});
		  } else {
			campana.nombre = req.body.nombre || campana.nombre,
			campana.fechaCierre = req.body.fechaCierre || campana.fechaCierre;

			campana.save(function (err){
			  if (err){
			  	res.json({success: false, err: err});		
			  }
			  else{
			  	res.json({success: true});
			  }
			  
			});
		}
		});  
	},

	toggleCampana: function(req, res){
		Campana.findById(req.body.id, function(err, campana) {
		  if(err){
			  res.json({success: false, err: err});
		  }
		  if (!campana){
			  res.json({success: false, err: "Campana not found"});
		  } else {
			campana.active = !campana.active,
			campana.save(function (err, campana){
			  if (err){
			  	res.json({success: false, err: err});		
			  }
			  else{
				if(campana.active){
					Campana.update(
					   { _id : {$nin : [campana._id] }},
					   { $set:{ active: false}},
					   { multi: true }
						, function(err){
							if(err){
								console.log(err);
							}
							else{
								res.json({success: true});
							}
					});
				}else{
					res.json({success: true});	
				}		  	
			  }		  
			});
		}
		});  
	},

	deleteCampana: function(req, res){
		Campana.remove({ _id : { $in: req.body.campanas } }, function(err, bear) {
			if (err){
				console.log(err);
				res.json({success: false, err: err});	
			}else{
				res.json({success: true});
			}
		});
	}
};