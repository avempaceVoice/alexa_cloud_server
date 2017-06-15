var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require('ejs-locals');
var routes = require('./routes/index');
var helmet = require('helmet')
var users = require('./routes/users');
var session = require('express-session');
var request = require('request');
var passport = require('passport');
var flash = require('connect-flash');
var req = require('request');
var cookie = require("cookie");
var sessionStorage = require('express-mysql-session');
var config = require('./config/dbconfig.json');
require('./config/passport')(passport);
//var flash    = require('connect-flash');

/**
 *
 * session storage configuration for postgres database
 * to do this we have to execute table.sql in our database
 * table.sql is in the connnect-pg-simple module
 *
 */
//var pg= require('pg');
//var StoreSession = require('connect-pg-simple')(session);


/**
 *
 * initialize express
 * @type {*|exports}
 */
var app = express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet())
app.use(session({ secret: 'a4f8071f-c873-4447-8ee2', name: 'nsIdForsession', saveUninitialized: true, resave: true }));

/**
 * Passport config
 *
 */


app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(function(req, res, next) {


    next();
});

/**
 *
 * route configuration
 */

app.use('/', routes);
app.use('/users', users);

app.use(function(req, res, next) {

    console.log('verifying identity')
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullUrl)

    if (fullUrl == 'http://www.baidu.com/cache/global/img/gs.gif' || fullUrl == 'http://www.baidu.comhttp://www.baidu.com/cache/global/img/gs.gif') {

        console.log('intrusion try')
        res.end()
    } else {
        next()
    }


})




// catch 404 and forward to error handler
app.use(function(req, res, next) {

    res.locals.user = null;
    res.send('error  ');

});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log('error log ', err)
        res.status(err.status || 500);

        res.locals.user = null;
        res.send('error erreur');
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);

    res.locals.user = null;
    res.send('error');
});



module.exports = app;