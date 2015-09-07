/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User schema
 */
var UserSchema = new Schema({    
    first: { type: String, required: true },
    last: { type: String},
    email: { type: String, required: true, unique: true },
    salt: { type: String },
    hash: { type: String },
    reset_password_token: { type: String,
                            default: function() { return crypto.randomBytes(127).toString('hex').toString(); },
                            required: true, index: { unique: true } },                            
    reset_password_sent_at: { type: Date, default: Date.now },
    roles: Array,
    lastLogin: { type: Date, default: Date.now }
});


/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

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

/**
 * Statics
 */

UserSchema.statics.hasExpired = function() {
    var now = new Date();
    return (now - reset_token_at) > 2;
};

/**
 * Register
 */

mongoose.model('User', UserSchema);
