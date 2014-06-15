'use strict';

var dbname = process.env.DBNAME || 'default-db';
var port = process.env.PORT || 4000;

var traceur        = require('traceur');
var express        = require('express');
var less           = require('express-less');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var cookieSession  = require('cookie-session');
var initMongo      = traceur.require(__dirname + '/lib/init-mongo.js');
var initRoutes     = traceur.require(__dirname + '/lib/init-routes.js');

var cookieParser   = require('cookie-parser');
var passport       = require('passport');
var session        = require('express-session');
var flash          = require('connect-flash');
// var config = require('./config/oauth.js');
// var FacebookStrategy = require('passport-facebook').Strategy;



// // config
// passport.use(new FacebookStrategy({
//  clientID: config.facebook.clientID,
//  clientSecret: config.facebook.clientSecret,
//  callbackURL: config.facebook.callbackURL
// },
//   function(accessToken, refreshToken, profile, done) {
//     process.nextTick(function () {
//       return done(null, profile);
//     });
//   }
// ));


/* --- configuration    */
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

/* --- pipeline         */
app.use(initMongo);
app.use(initRoutes);
app.use(morgan({format: 'dev'}));
app.use(express.static(__dirname + '/static'));
app.use('/less', less(__dirname + '/less'));
app.use(bodyParser());
app.use(methodOverride());
app.use(cookieSession({keys:['SEC123', '321CES']}));


/* Passport Configuration */
app.use(cookieParser());
app.use(session({ secret: 'natdatpatsat'}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


/* --- http server      */
var server = require('http').createServer(app);
server.listen(port, function(){
  console.log('Node server listening. Port: ' + port + ', Database: ' + dbname);
});

/* --- socket.io        */
var sockets = traceur.require(__dirname + '/lib/sockets.js');
var io = require('socket.io')(server);
io.of('/app').on('connection', sockets.connection);

module.exports = app;
