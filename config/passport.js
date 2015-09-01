var LocalStrategy   = require('passport-local').Strategy;
var User       		= require('../app/models/user');

module.exports = function(passport) {

    // =========================================================================
    // PASSPORT SESSION SETUP ==================================================
    // =========================================================================
    
    // Used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
   
   /* 
    passport.use(new LocalStrategy(         
        { usernameField: 'email' },
        function (email, password, fn) {
            User.findOne({'email': email}, function (err, usr) {
                if (err) {
                   return fn(err, false, { message: 'An Error occured' });
                }                
                if (!usr) {
                   return fn(err, false, { message: 'Unknown email address ' + email });
                }
                User.authenticate(email, password, function (err, valid) {
                    console.log('jaja '+valid);
                    if (err) {
                     return fn(err);
                    }
                    // if the password is invalid return that 'Invalid Password' to
                    // the user
                    if (!valid) {
                     return fn(null, false, { message: 'Invalid Password' });
                    }
                    return fn(err, usr);
                });
            });
        }
    ));
    */

    passport.use(new LocalStrategy({
        usernameField: 'email'
    },function(email, password, done) {
        User.authenticate(email, password, 
            function(err, user) {
                return done(err, user)
            })
    }));

};