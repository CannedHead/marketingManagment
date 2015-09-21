var passport = require('passport');
var User = require('../models/user.js');
var mailer = require('../../mailers/mailer');
var crypto = require('crypto');
var _ = require('underscore');

function randomNumber () {
    return Math.floor(Math.random() * (9999 - 1000) + 1000);
}

module.exports = {

    createUser: function(req, res, next) { 
        if (req.body.name === undefined) {
            console.log('missing parameter:first name');
            return next("fname not found")
        }
        if (req.param('email') === undefined  ) {
            console.log('missing parameter:email');
            return next("email not found")
        }
        if (req.param('password') === undefined  ) {
            console.log('missing parameter:email');
            return next("email not found")
        }
        if (req.param('passwordconf') === undefined  ) {
            console.log('missing parameter:email');
            return next("email not found")
        }

        var pswd = req.param('password');
        var pswd_conf = req.param('passwordconf')
        
        if(pswd == pswd_conf){

            var user = new User({
                name:     req.body.name,
                email:    req.body.email,
                password: req.body.password
            });

            user.save(function(err) {
                if(!err) {
                    console.log('New user has been created');
                    req.user = user;
                    mailer.welcome(user);                        
                    res.redirect('/admin');                  
                } else {
                    console.log('ERROR: ' + err);
                    res.json(201,{ message: "User already exists"},user);
                    return next();
                }
            });   
        }
    },

    readUsers: function(callback) {
    
        User.find({ roles: { $nin: [ "admin" ] } }, function(err, rows) {
            if (err) throw err;
            // Execute callback
            callback(null, rows);
        });
    },

    readUser: function(id, callback) {
        
        User.findOne({ roles: { $nin: [ "admin" ] }, _id: id }, function(err, rows) {
            if (err) throw err;
            // Execute callback
            callback(null, rows);
        });
    },


    readUserById: function(id, callback) {
        
        User.findById(id, function(err, rows){
            if (err) throw err;
            // Execute callback
            callback(null, rows);
        });
    },

    updateUser: function(req, res , next) {
        
        User.findById(req.body.id, function(err, user){
            if (err) return next(err);
            if(!user){
                res.render('404');
            } else {
              user.first = req.body.fname || user.first;
              user.last = req.body.lname || user.last;
              user.city = req.body.ciudad || user.ciudad;
              user.lastLogin = Date.now();

              if(user.email!=req.body.email){
                user.email = req.body.email || user.email;
                mailer.welcome(user);
              } 

              user.save(function (err) {
                    if(err) {
                        console.error('ERROR!:'+err);
                    }
              });

              res.redirect('/admin');                    
                          
            }
        });
    },

    updateUserLastLogin: function(id) {
        
        User.findById(id, function(err, user){
            if (err) return next(err);
            if(!user){
                res.render('404');
            } else {

              user.lastLogin = Date.now();
              user.save(function (err) {
                    if(err) {
                        console.error('ERROR!:'+err);
                    }
              });                   
                          
            }
        });
    },

    deleteUser: function(req,res,next) {
        User.findById(req.params.id, function(err, user) {
            user.remove(function(err) {
                if(!err) {
                    console.log('User has been removed');
                    return next();
                } else {
                    console.log('ERROR: ' + err);
                }
            })
        });
    },

    resetPassword: function(req,res,next){
        User.findOne({email:req.body.email}, function(err, user){
            if (err) return next(err);
            if(!user){
                console.log('ERROR: No se encontro al usuario en el sistema ' + req.body.email);
                res.render('login',{
                    error: 'Lo sentimos. No se encuentra ninguna cuenta asociada a ese correo electrónico.'                            
                });
            } else {
                // make the string url safe
                user.reset_password_token = crypto.randomBytes(48).toString('base64').replace(/\//g, '_').replace(/\+/g, '-')
                user.reset_password_sent_at = Date.now();
                user.save(function(err) {
                    if(!err) {
                        console.log('Reset token has been modified');
                        mailer.resetPassword(user);              
                        res.render('login',{
                            success: 'Se han enviado instrucciones para recuperar su cuenta a su correo electrónico.'                            
                        });       
                    } else {
                        console.log('ERROR: ' + err);
                        res.render('login',{
                            error: 'Error en la conexión. Por favor inténtalo mas tarde.'                            
                        });  
                    }
                });                                             
            }
        });
    },

    showResetPassword: function(req,res,next){
        User.findById(req.query.i, function(err, user){
            if (err) return next(err);
            if(!user){
                res.render('404');
            } else {
                if (user.reset_password_token==req.query.t){                    
                    user.reset_password_token = crypto.randomBytes(127).toString('hex').toString();
                    user.reset_password_sent_at = Date.now();
                    user.save();
                    res.render('reset-password', {
                        logged: req.isAuthenticated(),
                        nuser : user 
                    }); 
                }
                else{                   
                    res.render('404');
                }                           
            }
        });
    },

    resetPasswordWelcome: function(req,res,next){
        User.findOne({email:req.body.email}, function(err, user){
            if (err) return next(err);
            if(!user){
                console.log('ERROR: No se encontro al usuario en el sistema ' + req.body.email);
                res.render('login',{
                    error: 'Lo sentimos. No se encuentra ninguna cuenta asociada a ese correo electrónico.'                            
                });
            } else {
                // make the string url safe
                user.reset_password_token = crypto.randomBytes(48).toString('base64').replace(/\//g, '_').replace(/\+/g, '-')
                user.reset_password_sent_at = Date.now();
                user.save(function(err) {
                    if(!err) {
                        console.log('Reset token has been modified');
                        mailer.resetPassword(user);              
                        res.render('login',{
                            success: 'Se han enviado instrucciones para recuperar su cuenta a su correo electrónico.'                            
                        });       
                    } else {
                        console.log('ERROR: ' + err);
                        res.render('login',{
                            error: 'Error en la conexión. Por favor inténtalo mas tarde.'                            
                        });  
                    }
                });                                             
            }
        });
    },

    showResetPasswordWelcome: function(req,res,next){
        User.findById(req.query.i, function(err, user){
            if (err) return next(err);
            if(!user){
                res.render('404');
            } else {
                if (user.reset_password_token==req.query.t){                    
                    user.reset_password_token = crypto.randomBytes(127).toString('hex').toString();
                    user.reset_password_sent_at = Date.now();
                    user.save();
                    res.render('welcome', {
                        logged: req.isAuthenticated(),
                        nuser : user 
                    }); 
                }
                else{                   
                    res.render('404');
                }                           
            }
        });
    },

    changePassword: function(req,res,next) {
        User.findById(req.body.id, function(err, user){
           if (err) {
                res.json(404,{message: "User not found"});
           }
           if(!user){
               res.json(404,{message: "User not found"});
           } else {
                
               /*user.verifyPassword(req.body.oldPassword), function(error, match){
                
                    console.log('que paso aca');
                    if (error){
                        return res.json(200, {err: error , message: "Password updated"});
                    }
                   if (match) {
                */ 
                     user.password = req.body.newPassword;
                     user.save();
                     res.json(200, {message: "Password updated"});
                /*   } else {
                     res.json(200, {err: error , message: "Antigua contraseña no coincide"});
                   }

               }    */  
                       
           }
        });
    },

    updatePassword: function(req,res,next) {

        User.findById(req.body.id, function(err, user){
            if (err) return next(err);
            if(!user){
                res.render('404');
            } else {
              user.password = req.body.pass;
              user.save(function (err) {
                    if(err) {
                        console.error('ERROR!:'+err);
                    }
              });
              res.redirect('/login');                    
                          
            }
        });
    },

    

};