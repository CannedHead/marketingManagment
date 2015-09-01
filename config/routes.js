var adminController = require('../app/controllers/adminController');
var userController = require('../app/controllers/userController');
var vendorController = require('../app/controllers/vendorController');
var saleController = require('../app/controllers/saleController');
var campanaController = require('../app/controllers/campanaController');


function isLoggedIn(req, res, next) {

	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

// -----------------------------------------------------------------

function ensureAdmin(req, res, next) {
	if (req.isAuthenticated()) {
    	if (req.user.hasRole('admin')) {
      		return next();
    	} else {
    		return res.redirect('/');
    	}
 	} 	
};

// -----------------------------------------------------------------

function ensureCliente(req, res, next) {

 	if (req.isAuthenticated()) {
    	if (req.user.hasRole('renoboy') || req.user.hasRole('admin')) {
      		return next();
    	} else{
    		return res.redirect('/');
    	}
 	}
};

// -----------------------------------------------------------------

module.exports = function(router, passport) {

router.route('/')
	.get(function(req, res) {
		res.render('login', {
			logged: req.isAuthenticated(),
			user : req.user 
		});   
	});

// -----------------------------------------------------------------

router.route('/login')
	.get(function(req,res){
		res.redirect('/'); 
	})
	.post(passport.authenticate('local', { successRedirect: '/dash',
                                   		   failureRedirect: '/failed-login'}));

// -----------------------------------------------------------------

router.route('/logout')
	.get(function(req, res) {
		req.logout();
        res.redirect('/'); 
	});

// -----------------------------------------------------------------

router.route('/welcome')
	.get(userController.showResetPasswordWelcome)
	.post(userController.resetPasswordWelcome);

// -----------------------------------------------------------------

router.route('/reset-password')
	.get(userController.showResetPassword)
	.post(userController.resetPassword);

// -----------------------------------------------------------------

router.route('/change-password')
	.post(userController.changePassword);

// -----------------------------------------------------------------
router.route('/update-password')
	.post(userController.updatePassword);

// -----------------------------------------------------------------

router.route('/failed-login')
	.get(function(req, res) {
			res.render('login', {error: 'Usuario o contraseña invalidos.'});	    
	});

// -----------------------------------------------------------------

router.route('/config')
	.get(function(req, res) {
			res.render('config',{
                user: req.user,
                admin : req.user.hasRole('admin')              
          	});	    
	});

// -----------------------------------------------------------------

router.route('/config-success')
	.get(function(req, res) {
			res.render('config',{
                user: req.user,
                admin : req.user.hasRole('admin'),
                success: true              
          	});	    
	});

// -----------------------------------------------------------------

router.route('/dash')
	.get(function(req, res) {

		if (req.user.hasRole('admin')) {
			res.redirect('/admin');
			
		} else if(req.user.hasRole('renoboy')){
			userController.updateUserLastLogin(req.user._id);			
			res.redirect('/vendedores');
		} else{
			res.redirect('/');
		}	    
	});


// -----------------------------------------------------------------
// -----------------------------------------------------------------
// API
// -----------------------------------------------------------------
// -----------------------------------------------------------------


// Ventas API

// Query para leer ventas por Campana
router.route('/api/salesByCampana')
	.get(function(req,res){
	      saleController.readSalesByCampana(req.query.id,function(err,ventas){
	        if(err){
	          res.json(200,{success: false, err: {code: 'Se ha presentado un error!'}}); 
	        }
	        else{
	          res.json(200,{success: true, ventas: ventas});
	        }
	      });  
	});

// Query para leer venta por vendedor por Campana
router.route('/api/readSaleByVendorCampana')
	.get(saleController.readSaleByVendorCampana);

router.route('/api/readSalesByCampanaDistributer')
	.get(function(req,res){
	      saleController.readSalesByCampanaDistributer(req.query.campana, req.query.distributer,function(err,ventas){
	        if(err){
	          res.json(200,{success: false, err:'Se ha presentado un error!'}); 
	        }
	        else{
        	  res.json(200,{success: true, ventas: ventas});
	        }
	      });  
	});
// Campanas API

// Query para traer todas las campanas
router.route('/api/readCampanas')
	.get(function(req,res){
	      campanaController.readCampanas(function(err,campanas){
	        if(err){
	          res.json(200,{success: false, err: 'Se ha presentado un error!'}); 
	        }
	        else{
	          res.json(200,{success: true, campanas:campanas});
	        }
	      });  
	});

// Query para traer todas las campanas
router.route('/api/readCampanaById')
	.get(function(req,res){
	      campanaController.readCampanaById(req.query.campana,function(err,campana){
	        if(err){
	          res.json(200,{success: false, err: 'Se ha presentado un error!'}); 
	        }
	        else{
	          res.json(200,{success: true, campana:campana||{} });
	        }
	      });  
	});

// Query para saber si hay alguna campana activa
router.route('/api/isCampanaActive')
	.get(campanaController.isCampanaActive);



// -----------------------------------------------------------------
// -----------------------------------------------------------------
// Vendedores
// -----------------------------------------------------------------
// -----------------------------------------------------------------

router.route('/vendedores')
	.post(vendorController.createVendor, function(req,res){
		res.redirect('/vendedores');
	})
	.get(ensureCliente,function(req, res) {
		vendorController.readVendorsByDistribuidor(req.user._id, function(err,vendedores){
			if(err){console.log(err)};
			res.render('vendedores',{
                user: req.user,
                vendors: vendedores                
          	});
		});		
	});

// -----------------------------------------------------------------

router.route('/vendedores/nuevo')
	.get(ensureCliente,function(req, res) {
		res.render('newvendor',{
			user: req.user,
			vendors: {},
			admin: req.user.hasRole('admin')
		});
	});

// -----------------------------------------------------------------

router.route('/vendedores/venta')
	.post(saleController.postSale)
	.patch(saleController.updateSale)
	.get(ensureCliente,function(req, res) {
		vendorController.readVendorsByNIT(req.user.nit, function(err,vendedores){
			if(err){console.log(err)};
			res.render('vendedores',{
                user: req.user,
                vendors: vendedores                
          	});
		});		
	});

// -----------------------------------------------------------------

router.route('/vendedores/venta/:vendorid')
	.get(ensureCliente,function(req, res) {
		campanaController.getCampanaActive(function(err,campana){
			res.render('newsale',{
				user: req.user,
				vendor: req.params.vendorid,
				admin: req.user.hasRole('admin'),
				campana: campana[0] || {}
			});
		});
	});

// -----------------------------------------------------------------

router.route('/vendedores/historial/:vendorid')
	.get(ensureCliente,function(req, res) {
		saleController.readSalesById(req.user.nit,req.params.vendorid, function(err,ventasreg){
			if(err){console.log(err)};
			res.render('historial',{
				user: req.user,
				ventas: ventasreg,
				vendor: req.params.vendorid,
				admin: req.user.hasRole('admin'),
				general : false,
				total: false
			});
		});		
	});
	
// -----------------------------------------------------------------

router.route('/vendedores/historial/range/:vendorid')
	.post(ensureCliente, function(req, res) {
		saleController.readSalesByRangeId(req.user.nit,req.params.vendorid, req.body.start, req.body.end,function(err,ventasRange){
			if(err){console.log(err)};
			res.render('historial',{
				user: req.user,
				ventas: ventasRange,
				vendor: req.params.vendorid,
				admin: req.user.hasRole('admin'),
				general : false,
				total: false
			});
		});		
	});

// -----------------------------------------------------------------

router.route('/vendedores/historial/general/:nit')
	.get(ensureCliente,function(req, res) {
		campanaController.getCampanaActive(function(err,campana){		
			if(err){
				console.log(err)
			}
			else if(!campana[0]){
				res.render('historial',{
					user: req.user,
					campana: {},
					ventas: {},
					vendor: req.params.vendorid,
					admin: req.user.hasRole('admin'),
					general : true,
					total: false				
				});
			}else
			{
				saleController.readSalesByCampanaDistributer(campana[0]._id, req.user._id, function(err,ventasreg){	
					if(err){
						console.log(err)
					}
					res.render('historial',{
						user: req.user,
						campana: campana[0] || {},
						ventas: ventasreg || {},
						vendor: req.params.vendorid,
						admin: req.user.hasRole('admin'),
						general : true,
						total: false				
					});
				});
			}
		});		
	});

// -----------------------------------------------------------------

router.route('/vendedores/historial/general/range/:nit')
	.post(ensureCliente, function(req, res) {
		saleController.readSalesByRangeNIT(req.params.nit, req.body.start, req.body.end,function(err,ventasRange){
			if(err){console.log(err)};
			res.render('historial',{
				user: req.user,
				ventas: ventasRange,
				vendor: req.params.vendorid,
				admin: req.user.hasRole('admin'),
				general : true,
				total: false
			});
		});		
	});


// -----------------------------------------------------------------
// -----------------------------------------------------------------
// Admin
// -----------------------------------------------------------------
// -----------------------------------------------------------------

router.route('/admin')
	.get(ensureAdmin, function(req, res) {
		userController.readUsers( function(err,distributers){
			if(err){console.log(err)};
			res.render('admin/index',{
				user: req.user,
				distributers: distributers
			});
		});		
	});

// -----------------------------------------------------------------

router.route('/admin/nuevo-distribuidor')
	.post(userController.createUser)
	.get(ensureAdmin,function(req, res) {
		userController.readUsers( function(err,userss){
			if(err){console.log(err)};
			//console.log(req.user);
			res.render('admin/newdistributor',{
				user: req.user,
				users: userss
			});
		});		
	});



// -----------------------------------------------------------------

router.route('/admin/nuevo-vendedor/:nit')
	.get(ensureCliente,function(req, res) {
		userController.readUserById(req.query.distribuidor,function(err,distributer){
			if(err){console.log(err)};
			res.render('admin/newvendor',{
				user: distributer,
				admin: req.user.hasRole('admin')
			});
		});		
	})
	.post(vendorController.createVendor,function(req,res){
		res.redirect('/admin/distribuidor/' + req.params.nit + '?distribuidor=' + req.body.distribuidor);
	});

router.route('/admin/vendedor/rm/:id')
	.post(vendorController.deleteVendor);

router.route('/admin/vendedor/edit/:id')
	.get(ensureAdmin,function(req, res) {
		vendorController.readVendorByIden(req.params.id,function(err,vend){
			if(err){console.log(err)};
			res.render('admin/editvendor',{
				user: req.user,
				vendor: vend 
			});
		});		
	})
	.post(vendorController.updateVendedor);
// -----------------------------------------------------------------

router.route('/admin/vendedores/historial/:nit/:vendorid')
	.get(ensureCliente,function(req, res) {
		saleController.readSalesById(req.params.nit,req.params.vendorid, function(err,ventasreg){
			if(err){console.log(err)};
			res.render('historial',{
				user: req.user,
				ventas: ventasreg,
				nit: req.params.nit,
				vendor: req.params.vendorid,
				admin: req.user.hasRole('admin'),
				general : false,
				total: false
			});
		});		
	});	

// -----------------------------------------------------------------

router.route('/admin/vendedores/historial/range/:nit/:vendorid')
	.post(ensureAdmin, function(req, res) {
		console.log(req.body.start);
		saleController.readSalesByRangeId(req.params.nit,req.params.vendorid, req.body.start, req.body.end,function(err,ventasRange){
			if(err){console.log(err)};
			res.render('historial',{
				user: req.user,
				ventas: ventasRange,
				vendor: req.params.vendorid,
				admin: req.user.hasRole('admin'),
				nit: req.params.nit,
				general : false,
				total: false
			});
		});		
	});

// -----------------------------------------------------------------

router.route('/admin/vendedores/historial/total')
	.get(ensureAdmin,function(req, res) {
		saleController.readAllSales(function(err,ventasreg){
			campanaController.readCampanas(function(err,campanas){
				if(err){console.log(err)};
				res.render('admin/historialTotal',{
					user: req.user,
					ventas: ventasreg,
					campanas: campanas || {},
					total: true,
					general: false,
					admin: req.user.hasRole('admin')							
				});
			});
		});		
	});

// -----------------------------------------------------------------

router.route('/admin/vendedores/historial/total/range')
	.post(ensureCliente, function(req, res) {
		saleController.readSalesByRange(req.body.start, req.body.end,function(err,ventasRange){
			if(err){console.log(err)};
			res.render('admin/historialTotal',{
				user: req.user,
				ventas: ventasRange,
				total: true,
				general: false,
				admin: req.user.hasRole('admin')				
			});
		});		
	});
// -----------------------------------------------------------------


router.route('/admin/vendedores/venta/:nit/:vendorid')
	.get(ensureCliente,function(req, res) {
		campanaController.getCampanaActive(function(err,campana){
			res.render('newsale',{
				user: req.user,
				campana: campana[0] || {},
				distribuidor : req.query.distribuidor,
				nit: req.params.nit,
				vendor: req.params.vendorid,
				admin: req.user.hasRole('admin')
			});
		});
	});

// -----------------------------------------------------------------

router.route('/admin/vendedores/venta/:nit')
	.post(saleController.postSale, function(req,res){
		res.redirect('/admin/distribuidor/' + req.params.nit);			
	})
	.patch(saleController.updateSale);

// -----------------------------------------------------------------
// ---------------------- DISTRIBUIDORES ---------------------------
// -----------------------------------------------------------------

router.route('/admin/distribuidor/edit/:id')
	.get(ensureAdmin,function(req, res) {
		userController.readUser(req.params.id,function(err,distributer){
			if(err){console.log(err)};
			res.render('admin/editdistributor',{
				user: req.user,
				dist: distributer
			});
		});		
	});

router.route('/admin/distribuidor/rm/:id')
	.get(userController.deleteUser, function(req,res){
		res.redirect('/admin');
	});

// -----------------------------------------------------------------

router.route('/admin/editar-distribuidor')
	.post(userController.updateUser);

// -----------------------------------------------------------------

router.route('/admin/distribuidor/:nit')
	.get(ensureAdmin,function(req, res) {
		vendorController.readVendorsByDistribuidor(req.query.distribuidor,function(err,vendors){
			if(err){console.log(err)};
			res.render('admin/vendors',{
				user: req.user,
				distribuidor: req.query.distribuidor,
				nit: req.params.nit,
				vendors: vendors
			});
		});		
	});

// -----------------------------------------------------------------

router.route('/admin/distribuidor/permiso/:id')
	.get(ensureAdmin,function(req, res) {
		
		adminController.changePermission(req.params.id,function(err){
			if(err){console.log(err)};
			userController.readUsers( function(err,users){
				if(err){console.log(err)};
				res.redirect('/admin');
			});
		});
		
	});

// -----------------------------------------------------------------

router.route('/admin/distribuidores/bloquearTodos')
	.get(ensureAdmin,adminController.blockAll, function(req, res) {
		userController.readUsers( function(err,users){
			if(err){console.log(err)};
			res.redirect('/admin');
		});
		
	});

// -----------------------------------------------------------------

router.route('/admin/distribuidores/permitirTodos')
	.get(ensureAdmin,adminController.allowAll, function(req, res) {
		userController.readUsers( function(err,users){
			if(err){console.log(err)};
			res.redirect('/admin');
		});
		
	});

// -----------------------------------------------------------------

router.route('/admin/distribuidor/permisoVentas/:id')
	.get(ensureAdmin,function(req, res) {
		
		adminController.changePermissionVentas(req.params.id,function(err){
			if(err){console.log(err)};
			userController.readUsers( function(err,users){
				if(err){console.log(err)};
				res.redirect('/admin');
			});
		});
		
	});

// -----------------------------------------------------------------

router.route('/admin/distribuidores/bloquearVentas')
	.get(ensureAdmin,adminController.blockAllVentas, function(req, res) {
		userController.readUsers( function(err,users){
			if(err){console.log(err)};
			res.redirect('/admin');
		});
		
	});

// -----------------------------------------------------------------

router.route('/admin/distribuidores/permitirVentas')
	.get(ensureAdmin,adminController.allowAllVentas, function(req, res) {
		userController.readUsers( function(err,users){
			if(err){console.log(err)};
			res.redirect('/admin');
		});
		
	});

// -----------------------------------------------------------------

router.route('/admin/config')
	.get(function(req, res) {
		res.render('admin/config', {
            users: {}                
      	});
	});

// -----------------------------------------------------------------

router.route('/admin/historialDistribuidor/:id')
	.get(ensureCliente,function(req, res) {
		userController.readUserById(req.params.id, function(err,user){
			campanaController.getCampanaActive(function(err,campana){		
				if(err){
					console.log(err)
				}
				else if(!campana[0]){
					res.render('admin/historialDistribuidor',{
						user: user,
						campana: {},
						ventas: {},
						vendor: req.params.vendorid,
						admin: req.user.hasRole('admin'),
						general : true,
						total: false				
					});
				}else
				{
					saleController.readSalesByCampanaDistributer(campana[0]._id, req.params.id, function(err,ventasreg){	
						if(err){
							console.log(err)
						}
						res.render('admin/historialDistribuidor',{
							user: user,
							campana: campana[0] || {},
							ventas: ventasreg || {},
							vendor: req.params.vendorid,
							admin: req.user.hasRole('admin'),
							general : true,
							total: false				
						});
					});
				}
			});		
		});
	});

// -----------------------------------------------------------------
// -------------------------- CAMPAÑAS -----------------------------
// -----------------------------------------------------------------

router.route('/admin/campanas')
	.get(ensureAdmin,function(req, res) {
		campanaController.readCampanas(function(err,campanas){
			res.render('admin/campanas/campanas',{
				user: req.user,
				campanas: campanas ||{}
			});
		});
	})
	.post(ensureAdmin,campanaController.createCampana)
	.delete(campanaController.deleteCampana)
	.patch(campanaController.toggleCampana);

router.route('/admin/campanas/nueva')
	.get(ensureAdmin,function(req, res) {
		campanaController.readCampanas(function(err,campana){
			res.render('admin/campanas/new',{
				user: req.user,
				campana: campana[0]||{}
			});
		});
	});

router.route('/admin/campana/:id')
	.get(ensureAdmin,function(req, res) {
		campanaController.readCampanaById(req.params.id, function(err,camp){
			if(err || !camp){
				res.render('Ha sucedido un error en la conexión');
			} else {
				saleController.readSalesByCampana(req.params.id,function(err,ventas){			
					if(err || !ventas){
						res.render('Ha sucedido un error en la conexión');
					} else {
						res.render('admin/campanas/campana',{
							user: req.user,
							campana: camp,
							ventas: ventas
						});
					}
				});
			}
		});
	});

router.route('/admin/historialTotal')
	.get(ensureAdmin,function(req, res) {
		campanaController.readCampanas(function(err,campanas){
			if(err || !campanas){
				res.render('Ha sucedido un error en la conexión');
			} else {
				saleController.readAllSales(function(err,ventas){			
					if(err || !ventas){
						res.render('Ha sucedido un error en la conexión');
					} else {
						res.render('admin/historialTotal',{
							user: req.user,
							campanas: campanas,
							ventas: ventas
						});
					}
				});
			}
		});
	});

router.route('/admin/config')
	.get(function(req, res) {
			res.render('admin/config',{
                user: req.user,
                admin : req.user.hasRole('admin')              
          	});	    
	});

// -----------------------------------------------------------------
// ------------------------ VENDEDORES -----------------------------
// -----------------------------------------------------------------

router.route('/admin/vendedores')
	.get(function(req, res) {
	  adminController.findAllVendorsUsers( function(err,v){
	    res.render('admin/listado',{
			user: req.user,
			nit: req.params.nit,
			vendors: v
		});
	  });  
	});

};
