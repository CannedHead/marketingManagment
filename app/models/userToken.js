// -----------------------------------------------------------------
// Modules
// -----------------------------------------------------------------

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var UserToken;

// -----------------------------------------------------------------
// Schema
// -----------------------------------------------------------------

var UserTokenSchema = new Schema({
 	userId: {type: Schema.ObjectId, index: true},
 	token: {type: String, index: true},
 	reset_token_at: { type: Date, default: Date.now }
});

// -----------------------------------------------------------------
// Methods
// -----------------------------------------------------------------

UserTokenSchema.statics.new = function (userId, fn) {
 	var user = new UserToken();
 	crypto.randomBytes(48, function (ex, buf) {	   
	   var token = buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
	   user.token = userId + '|' + token.toString().slice(1, 24);
	   user.userId = userId;
	   user.save(fn);
	});
};

UserSchema.statics.hasExpired = function() {
    var now = new Date();
    return (now - reset_token_at) > 2;
};

module.exports = mongoose.model('UserToken', UserTokenSchema);