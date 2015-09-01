// -----------------------------------------------------------------
// Require modules
// -----------------------------------------------------------------
var express = require('express'),
    cookieParser = require('cookie-parser'),
    session      = require('express-session'),
    bodyParser = require('body-parser'),
    morgan         = require('morgan'),
    methodOverride = require('method-override'),
    mysql = require('mysql');


var mongoose = require('mongoose');
var passport = require('passport');
var app = express();
var mongoStore = require('connect-mongo')(session);

var http = require('http')
    server = http.createServer(app);


//Load config files
var config = require(__dirname + '/config/config.json');
require('./config/passport')(passport); 

// -----------------------------------------------------------------
// Configure Expresss
// -----------------------------------------------------------------

app.use(cookieParser()); 
app.use(session({
	secret: config.cookie_secret,
	// Set session to expire after 21 days
    cookie: { maxAge: new Date(Date.now() + 181440000)},cookie: { maxAge: 2628000000 },
	// Set up MongoDB session storage
    store: new mongoStore({url:config.db.mongodb}),
    //store: new mongoStore({url:config.db.test}),
	
})); //si
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
app.use(morgan('dev')); 
app.use(bodyParser());
app.use(methodOverride()); 
app.use(express.static(__dirname + '/public'));

// Set up passport
app.use(passport.initialize());
app.use(passport.session());

app.locals.moment = require('moment');

// -----------------------------------------------------------------
// Routes
// -----------------------------------------------------------------

var router = express.Router(); 
require('./config/routes')(router, passport);
app.use(router);

// -----------------------------------------------------------------
// Start app
// -----------------------------------------------------------------

server.listen(app.get('port'), function(){
  console.log("Listening on port " + app.get('port'));
});

// -----------------------------------------------------------------
// Database
// -----------------------------------------------------------------

//Initialize database: mongodb
//mongoose.connect(config.db.test , function(err, res) {
mongoose.connect(config.db.mongodb, function(err, res){    
	if(err) {
		console.log('ERROR: connecting to MongoDB Database. ' + err);
	} else {
		console.log('Connected to MongoDB Database');
	}
});

