var Sale = require('../models/sale');
var vendorController = require('../controllers/vendorController');
var userController = require('../controllers/userController');
module.exports = {
		
	postSale: function(req, res, next) {
    console.log('duplicados:' + req.body.duplicados);
		Sale.find({$and :[{ campana: req.body.campana}, { vendedor: req.body.vendor}]}, function(err, rows){
          if(err){
        		console.log(err);
        		res.json(200,{success:false,message:'Hubo un error en la conexion al servidor.'})
        	}
        	else if(rows[0] && req.body.duplicados == 'false'){
        		res.json(200,{success:false, duplicate:true, ventas: rows[0]._id });
        	}
        	else{
        		console.log('Create new sale');
        		userController.readUserById(req.body.distribuidor,function(err,distributer){
        			if(err){
        				res.json(200,{success:false,message:'Hubo un error en la conexion al servidor.'})
        			}	else if(distributer){
        				vendorController.readVendorByIden(req.body.vendor,function(err,vendor){
  							if(err){
  								res.json(200,{success:false,message:'Hubo un error en la conexion al servidor.'})
  							}
  							else{
  								// Build new vendedor if not
  					        	var newS = new Sale ({
  					                campana: req.body.campana,
                            //distribuidorid:distributer._id, [distribuidor-> Ya Guarda el ID ] 
  					                distribuidor: req.body.distribuidor,
  					                nit: req.body.nit,
  					                nomDist: distributer.first,
  					                ciudad: distributer.city,
  					                vendedor: req.body.vendor,
  					                nomVend: vendor.nombre + ' ' + vendor.apellido,
  					                cargoVend: vendor.cargo,
  					                emailVend: vendor.email,
  					                celularVend: vendor.celular,
  					                fields: req.body.fields
  					            });
  				            
  						        newS.save(function(err,s){					            
						            if (err){
						            	res.json(200,{success:false,message:'Hubo un error en la conexion al servidor.'})
						            }else{
                          console.log('Create Sale Succesfully!');
                          console.log(s);
										      res.json(200,{success:true, message:'El registro se ha realizado satisfactoriamente'})
    									  }
      								});
  						    }
						});	
        			}
        		});        		
        	}		 	
     	});
	},

	readAllSales: function(callback){
    	Sale.find({}).sort({fecha: -1}).exec( function(err, rows) {
      	if (err) throw err;
		 	// Execute callback
	  		callback(null, rows);
     	});
  },

	readSalesById: function(nitu,vend, callback){
        
    	Sale.find({vendedor : vend , nit : nitu}).sort({fecha: -1}).exec( function(err, rows) {
      	if (err) throw err;
		 	// Execute callback
	  		callback(null, rows);
     	});
  },

  readSalesByNIT: function(nit, callback) {
      
  	Sale.find({nit : nit}).sort({fecha: -1}).exec( function(err, rows) {
    	if (err) throw err;
	 	// Execute callback
  		callback(null, rows);
   	});
  },

  readSalesByRange: function(start,end,callback) {
      
  	Sale.find({fecha: {$gte: start, $lt: end}}).sort({fecha: -1}).exec( function(err, rows){
    	if (err) throw err;
	 	// Execute callback
  		callback(null, rows);
   	});
  },

  readSalesByRangeId: function(nitu,vend,start,end,callback) {
      
  	Sale.find({vendedor : vend , nit : nitu, fecha: {$gte: start, $lt: end}}).sort({fecha: -1}).exec( function(err, rows){
    	if (err) throw err;
	 	// Execute callback
  		callback(null, rows);
   	});
  },

  readSalesByRangeNIT: function(nit,start,end,callback) {
  	Sale.find({nit : nit, fecha: {$gte: start, $lt: end}}).sort({fecha: -1}).exec( function(err, rows){
    	if (err) throw err;
	 	// Execute callback
  		callback(null, rows);
   	});
  },

  readSalesByCampana: function(campana,callback) {
  	Sale.find({campana: campana},function(err, rows){
    	if (err) throw err;
	 	// Execute callback
  		callback(null, rows);
   	});
  },

  readSalesByCampanaDistributer: function(campana, distributer,callback) {
    Sale.find({$and :[{ campana: campana}, { distribuidor: distributer}] },function(err, rows){
        if (err) throw err;
        callback(null, rows);
    });
  },

  readSalesByDistributer: function(distributer,callback) {
    Sale.find({distribuidor: distributer},function(err, rows){
        if (err) throw err;
        callback(null, rows);
    });
  },

  readSaleByVendorCampana: function(req,res) {
    	Sale.find({$and :[{ campana: req.query.campana}, { vendedor: req.query.vendor}]}, function(err, sale){
      	if(err){
      		res.json(200,{success:false,message:'Hubo un error en la conexion al servidor.'});
      	}
      	else if(!sale[0]){
      		res.json(200,{success:false,message:'Hubo un error en la conexion al servidor.'});
      	}
      	else{
      		res.json(200,{success:true, sale:sale[0]});
      	}
   	});
  },

  updateSale: function(req, res, next){

  	Sale.findOne({_id: req.body.id},function(err, venta){
  		if(err){
  			res.json(404,{success:false, message:'Ha ocurridoo un error en el sistema. Por favor intentelo mas tarde.'});
  		} else {
  			if(venta){
  				venta.fields = req.body.fields || venta.fields;
  				venta.save(function (err) {
	                if(!err) {
	                    res.json(200,{success:true, message:'La informacion ha sido actualizada correctamente.'});
	                } else {
	                	res.json(404,{success:false, message:'Ha ocurridoo un error en el sistema. Por favor intentelo mas tarde.'});
	                }
	            });
  				
  			} else {
  				res.json(200,{success:false, message:'No se encontro ningun registro de venta en el sistema.'});
  			}
  		}
  	});
  }


};