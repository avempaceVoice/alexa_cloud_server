
var LocalStrategy   = require('passport-local').Strategy;
var connection = require('./../dbconnector/dbconnector')();
var cryptoConfig = require('./cryptConf.json')
//var passport = require('passport');



var CryptoJS = require("crypto-js");




// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {


        done(null, user.id);//for admn auth
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {


        connection.query("select * from users where id = "+id,function(err,rows){//for admn auth

            done(err, rows[0]);

        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form

            process.nextTick(function(){

                connection.query("SELECT * FROM users WHERE email = ?",email ,function(err,rows){

                    if(err)
                        return done(err);

                    if(!rows.length)
                        return done(null, false);

                    /*   if(!(rows[0].last_name  == last_name)){

                        return done(null, false);
                    }
                     if(!( rows[0].admin_password == admin_password)){
                     return done(null, false);
                     }*/


                    if(!( (CryptoJS.AES.decrypt(rows[0].password.toString(),cryptoConfig.cryptKey).toString(CryptoJS.enc.Utf8))  == password)){
                            console.log('password mismatch');
                        return done(null, false);

                    }
                    if(!(rows[0].flag == true)){
                        console.log('flag mismatch');
                        return done(null, false);
                    }






                        return done(null, rows[0]);

                    //  return done(null, rows[0]);

                });
            });



        }));

};
