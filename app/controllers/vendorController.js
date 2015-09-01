var Vendor = require('../models/vendor');
var Sale = require('../models/sale');

module.exports = {
		
	createVendor: function(req, res, next) {
	
		if (req.body.nit === undefined) {
	    console.log('missing parameter: nit');
	    return next("nit not found")
	 	}
		if (req.body.nombre === undefined) {
	    console.log('missing parameter: nombre');
	    return next("nombre not found")
	  	}
		if (req.body.apellido === undefined) {
	    console.log('missing parameter: apellido');
	    return next("numInt not found")
	  	}
		if (req.body.identificacion === undefined) {
	    console.log('missing parameter: id');
	    return next("id not found")
	  	}
		if (req.body.cargo === undefined) {
	    console.log('missing parameter: cargo');
	    return next("cargo not found")
	  	}
		if (req.body.email === undefined) {
	    console.log('missing parameter: email');
	    return next("email not found")
	 	}
		if (req.body.celular === undefined) {
	    console.log('missing parameter: celular');
	    return next("celular not found")
	 	} 
	 	if (req.body.ciudad === undefined) {
	    console.log('missing parameter: ciudad');
	    return next("ciudad not found")
	 	} 	
	 	if (req.body.direccion === undefined) {
	    console.log('missing parameter: direccion');
	    return next("direccion not found")
	 	} 
	 	if (req.body.pa === undefined) {
	    console.log('missing parameter: pa');
	    return next("pa not found")
	 	} 				
		
		// Build new vendedor if not
        var newV = new Vendor ({
                distribuidor: req.body.distribuidor,
                nit: req.body.nit,
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                identificacion: req.body.identificacion,
                cargo: req.body.cargo,
                email: req.body.email,
                celular: req.body.celular,
                ciudad: req.body.ciudad,
                direccion: req.body.direccion,
                pa: req.body.pa
            });
            
        newV.save(function(err){
            
            if (err) {throw err;}
            
            // Redirect back to router
            return next();
        });
	},

    createVendorDummy: function(req, res, next) {
        
        // Build new vendedor if not
        var newV = new Vendor ({
                nit: '1098670991',
                nombre: 'pedro',
                apellido: 'rodriguez',
                identificacion: '3051979',
                cargo: 'jefe vendedores',
                email: 'padre@gmail.com',
                celular: '3164828057',
                ciudad: 'medellin'
            });
            
        newV.save(function(err){
            
            if (err) {throw err;}
            
            // Redirect back to router
            return next();
        });
    },

	readVendorByIden: function(iden, callback) {
        Vendor.findOne({ identificacion : iden}, function(err, vendor) {
            if (err) throw err;
            // Execute callback
            callback(null, vendor);
        });
    },

	readVendors: function(callback) {
        Vendor.find(function(err, rows) {
            if (err) throw err;
            // Execute callback
            callback(null, rows);
         });
    },

    readVendorsByDistribuidor: function(distribuidor, callback) {
        Vendor.find({distribuidor: distribuidor},function(err, rows) {
            if (err) throw err;
            // Execute callback
            callback(null, rows);
         });
    },

    readVendorsByNIT: function(nit, callback) {
        Vendor.find({nit:nit},function(err, rows) {
            if (err) throw err;
            // Execute callback
            callback(null, rows);
         });
    },
    
    updateVendedor: function(req,res,next){
        Vendor.findById(req.body.id, function(err, vendor){
            if (err) return next(err);
            if(!vendor){
                res.render('404');
            } else {
              var oldvendor = vendor.identificacion;

              vendor.nombre = req.body.nombre ||vendor.nombre;
              vendor.apellido = req.body.apellido || vendor.apellido;  
              vendor.identificacion = req.body.identificacion || vendor.identificacion;
              vendor.cargo = req.body.cargo || vendor.cargo;
              vendor.email = req.body.email || vendor.email;
              vendor.celular = req.body.celular || vendor.celular;
              vendor.ciudad = req.body.ciudad || vendor.ciudad;
              vendor.direccion = req.body.direccion || vendor.direccion;
              vendor.pa = req.body.pa || vendor.pa;
              
              vendor.save(function (err) {
                    if(err) {
                        console.error('ERROR!:'+err);
                    }
                    else{
                        if(vendor.identificacion != oldvendor){
                            Sale.update(
                               { vendedor : oldvendor},
                               { $set:{vendedor: vendor.identificacion}},
                               { multi: true}
                              , function(err){
                                if(err){
                                  throw err;
                                }
                                else{
                                  console.log('success changing ->' + oldvendor);
                                }                  
                            });                        
                        };
                    }
              });
              res.redirect('/admin/distribuidor/' + vendor.nit + '?distribuidor=' + vendor.distribuidor);                 
                          
            }
        });
    },
    deleteVendor: function(req,res,next) {
        Vendor.findById(req.params.id, function(err, vendor) {
            vendor.remove(function(err) {
                if(!err) {
                    console.log('Vendor has been removed');
                    res.json(200,{success:true});
                } else {
                    console.log('ERROR: ' + err);
                    res.json(200,{success:false, error: err});
                }
            })
        });
    },



};