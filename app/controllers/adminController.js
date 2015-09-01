var Vendor = require('../models/vendor');
var User = require('../models/user');
var Registro = require('../models/registro');
var Sale = require('../models/sale');
var mailer = require('../../mailers/mailer');
var moment = require('moment-timezone');
var _ = require('underscore');

module.exports = {

    editCargo: function(req,res,next) {
      Vendor.update(
         { cargo : 'Asesor comercial '},
         { $set:{cargo: 'ASESOR COMERCIAL'}},
         { multi: true }
        , function(err){
          if(err){
            throw err;
          }
          else{
            console.log('success!!');
          }                  
      });
      return next(); 
    },    

    addDistribuidores: function(req,res,next) {
        User.find({ roles: { $nin: [ "admin" ] } }, function(err, distribuidores) {
            if (err){
              throw err;
            }
            else{
              _.each(distribuidores,function(v,i){
                Vendor.find({nit: v.nit}, function(err, vendedores){
                  if (err){
                    throw err;
                  }
                  else{
                    Vendor.update(
                       { nit : v.nit},
                       { $set:{distribuidor: v._id}},
                       { multi: true }
                      , function(err){
                        if(err){
                          throw err;
                        }
                        else{
                          console.log('success ->' + v.nit);
                        }                  
                    });
                  }                   
                });
              });
              return next();
            }
        });
    },    

    integracionDistribuidor2014: function(req,res,next) {
      Sale.find({}, function(err, sales) {
          if (err){
            throw err;
          }
          else{
            _.each(sales,function(s,i){
              Vendor.findOne({identificacion: s.vendedor}, function(err, vendedor){
                if (err){
                  throw err;
                }
                else{
                  if(vendedor && moment(s.fecha).format('YYYY') == '2014'){
                    console.log(s.nomDist, vendedor.distribuidor, moment(s.fecha).format('YYYY'));               
                    Sale.update(
                       { vendedor : s.vendedor},
                       { $set:{distribuidor: vendedor.distribuidor}},
                       { multi: true }
                      , function(err){
                        if(err){
                          throw err;
                        }
                        else{
                          console.log('success ->' + s.vendedor);
                        }                  
                    });
                  }
                }                   
              });
            });
            return next();
          }
      });
    },   

    integracionCampana2014: function(req,res,next) {
      Sale.find({}, function(err, sales) {
          if (err){
            throw err;
          }
          else{
            _.each(sales,function(s,i){
              if( moment(s.fecha).format('YYYY') == '2014' && s.nit == '890403648'){
                Sale.update(
                   { _id : s.id},
                   { $set:{campana: '558c1bd99af0e803006a496c'}},
                   { multi: true }
                  , function(err){
                    if(err){
                      throw err;
                    }
                    else{
                      console.log('success ->' + s.id);
                    }                  
                });
              }

            });
            return next();
          }
      });
    },   

    integracionFormato2014: function(req,res,next) {
      Sale.find({}, function(err, sales) {
          if (err){
            throw err;
          }
          else{
            var ss;
            var s;
            for(i=0 ; i< sales.length; i++){
              ss = JSON.stringify(sales[i]);
              s = JSON.parse(ss);

              if( moment(s.fecha).format('YYYY') == '2014'){
                fields = [];
                fields[0] = {
                  "name": 'busconv',
                  "value": s.busconv
                };
                fields[1] = {
                  "name": 'busrad',
                  "value": s.busrad
                };
                fields[2] = {
                  "name": 'camionconv',
                  "value": s.camionconv
                };
                fields[3] = {
                  "name": 'camionrad',
                  "value": s.camionrad
                };

                Sale.update(
                   { _id : s._id},
                   { $set:{fields: fields}},
                   { multi: true }
                  , function(err){
                    if(err){
                      throw err;
                    }
                    else{
                      console.log('success ->' + s._id);
                    }                  
                });
              }

            };
            return next();
          }
      });
    }, 

    /*
    findAllVendorsUsers:function(callback){
      
      Registro.remove().exec();

      Vendor.find({},function (err, vendors) {
        vendors.map(function(vendor) {
          var v = vendor.toObject();
          User.findOne( { "nit": v.nit } , function(err, u){
            if(err) return next(err);
            if(u){
              var reg = new Registro({
                  nit: v.nit, 
                  distribuidorfirst: u.first, 
                  distribuidorlast: u.last, 
                  cc: v.identificacion,
                  nombre: v.nombre, 
                  apellido: v.apellido, 
                  cargo: v.cargo,
                  email: v.email,
                  celular : v.celular,
                  direccion: v.direccion, 
                  ccvendedor: v.identificacion,
                  ciudad: v.ciudad 
              });
              callback(null, reg);
            }
          });
        });
      });
      

      Registro.find({}, function(err, rows) {
        if (err) throw err;
        // Execute callback
        callback(null, rows);
      });
    },
    */

    findAllVendorsUsers:function(callback){
      Vendor.find({},function (err, vendors) {
            if (err) return next(err);
            else callback(null,vendors);
      });
    }, 
 
    changePermission: function(id,callback) {
        User.findOne({_id:id}, function(err, user){
            if (err) return next(err);
            if(!user){
                console.log('user with id '+id+' not found.');
                callback(null);
            }else{
              //flip value of permission
              user.permission = !user.permission;
              
              //save changes
              user.save(function (err) {
                    console.log('se cambio el permiso de '+id+' exitosamente por ' + user.permission);
                    if(err) {console.error('ERROR!:'+err);}
              });
              callback(null);                    
                          
            }
        });
    },

    changePermissionVentas: function(id,callback) {
        User.findOne({_id:id}, function(err, user){
            if (err) return next(err);
            if(!user){
                console.log('user with id '+id+' not found.');
                callback(null);
            }else{
              //flip value of permission
              user.permissionVentas = !user.permissionVentas;
              
              //save changes
              user.save(function (err) {
                    console.log('se cambio el permiso de '+id+' exitosamente por ' + user.permissionVentas);
                    if(err) {console.error('ERROR!:'+err);}
              });
              callback(null);                    
                          
            }
        });
    },

    blockAll: function(req,res,next) {
        User.find({}, function(err, users){
            if (err) return next(err);
            if(!users){
                console.log('no hay usuarios con este modelo');
                return next('No hay usuarios en este base de datos');
            }else{
              
                  _.each(users, function(user){
                      //flip value of permission
                      user.permission = false;
                      
                      //save changes
                      user.save(function (err) {
                            if(err) {
                                console.error('ERROR!:'+err);
                                throw err;
                            }
                      });

                  });
              
             return next();                    
                          
            }
        });
    },

    blockAllVentas: function(req,res,next) {
        User.find({}, function(err, users){
            if (err) return next(err);
            if(!users){
                console.log('no hay usuarios con este modelo');
                return next('No hay usuarios en este base de datos');
            }else{
              
                  _.each(users, function(user){
                      //flip value of permission
                      user.permissionVentas = false;
                      
                      //save changes
                      user.save(function (err) {
                            if(err) {
                                console.error('ERROR!:'+err);
                                throw err;
                            }
                      });

                  });
              
             return next();                    
                          
            }
        });
    },

    allowAll: function(req,res,next) {
        User.find({}, function(err, users){
            if (err) return next(err);
            if(!users){
                console.log('no hay usuarios con este modelo');
                return next('No hay usuarios en este base de datos');
            }else{
              
                  _.each(users, function(user){
                      //flip value of permission
                      user.permission = true;
                      
                      //save changes
                      user.save(function (err) {
                            if(err) {
                                console.error('ERROR!:'+err);
                                throw err;
                            }
                      });

                  });
              
             return next();                    
                          
            }
        });
    },

    allowAllVentas: function(req,res,next) {
        User.find({}, function(err, users){
            if (err) return next(err);
            if(!users){
                console.log('no hay usuarios con este modelo');
                return next('No hay usuarios en este base de datos');
            }else{
              
                  _.each(users, function(user){
                      //flip value of permission
                      user.permissionVentas = true;
                      
                      //save changes
                      user.save(function (err) {
                            if(err) {
                                console.error('ERROR!:'+err);
                                throw err;
                            }
                      });

                  });
              
             return next();                    
                          
            }
        });
    },    

};