// -----------------------------------------------------------------
// Modules
// -----------------------------------------------------------------

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var moment = require('moment');
moment.lang('es');

// -----------------------------------------------------------------
// Schema
// -----------------------------------------------------------------

var UserSchema = new Schema({
    
    first: { type: String, required: true },
    last: { type: String},

    email: { type: String, required: true, unique: true },
    salt: { type: String },
    hash: { type: String },

    reset_password_token: { type: String,
                            default: function() { return crypto.randomBytes(127).toString('hex').toString(); },
                            required: true, index: { unique: true }},                            
    reset_password_sent_at: { type: Date, default: Date.now },

    roles: Array,
    nit: String,
    city: String,
    lastLogin: { type: Date, default: Date.now },
    permission: {type: Boolean, default: true},
    permissionVentas: {type: Boolean, default: true},
});

// -----------------------------------------------------------------
// Methods
// -----------------------------------------------------------------

UserSchema.statics.hashPassword = function (passwordRaw, fn) {  
  var salt = this.salt = bcrypt.genSaltSync(10);
  bcrypt.hash(passwordRaw, salt, fn);
};

UserSchema.methods.verifyPassword = function (password, fn) {
  bcrypt.compare(password, this.hash, fn);
};

UserSchema.methods.hasRole = function (role) {
  for (var i = 0; i < this.roles.length; i++) {
    if (this.roles[i] === role) {
      return true;
    }
  };
  return false;
};

UserSchema.statics.hasExpired = function() {
    var now = new Date();
    return (now - reset_token_at) > 2;
};

// -----------------------------------------------------------------
// Virtuals
// -----------------------------------------------------------------

UserSchema.virtual('fullname').get(function () {
  return this.name.first + ' ' + this.name.last;
});

UserSchema.virtual('password').get(function () {
  return this._password;
})

.set(function (password) {
  this._password = password;
  var salt = this.salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(password, salt);
});

UserSchema.virtual('fechainformat').get(function () {
   var dateWrapper = moment(this.lastLogin).format('hh:mm a, MMMM DD, YYYY');
   return dateWrapper;
});

// User authentication method
UserSchema.static('authenticate', function(email, password, callback) {
  // Find a user in the database
  this.findOne({ email: email }, function(err, user) {
      if (err) { return callback(err); }
      
      // Return false if no user found
      if (!user) { return callback(null, false); }
      
      // Verify password if user found
      user.verifyPassword(password, function(err, passwordCorrect) {
        if (err) { return callback(err); }
        
        // Return false if incorrect password
        if (!passwordCorrect) { return callback(null, false); }
        
        // Return user if successful
        return callback(null, user);
      });
  });
});

 // Password verification method
UserSchema.method('verifyPassword', function(password, callback) {
   
 // Compare given password with saved
 bcrypt.compare(password, this.hash, callback);
});


module.exports = mongoose.model('User', UserSchema);