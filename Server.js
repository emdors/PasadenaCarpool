"use strict";
var express = require("express");
var bodyParser = require('body-parser');
var fs = require('fs');
var server = require('http').createServer(app)
var async = require('async');

var app = express();

//Things needed for passport authetification
var util = require( 'util' )
var cookieParser = require('cookie-parser');
var passport = require( 'passport' )
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var session = require( 'express-session' )

//Things needed to access data in database
var dbComm = require('./DBcommunicator');

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
var google_secrets = require('./google_secrets.json');
var examplePreferences = require('./examplePreferences.json')
try {
  var per_server_settings = require('./data/settings.json');
} catch(e) {
  var per_server_settings = {};
}

var viewpath = __dirname + '/views/';
var datapath = __dirname + '/data/'
var schedulepath = datapath + '/schedules/'
var userdatapath = datapath + '/users/';
var histdatapath = datapath + '/statistics/'

var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
var possibleDriveHours = {AM: [5,6,7,8,9,10], PM: [3,4,5,6,7,8]};

var exampleResults = require('./exampleData').data;
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.locals.pretty = true

app.use(express.static("static"));
app.use(session({ secret: 'secret', key: 'user', cookie: { secure: false }, resave: false, saveUninitialized: false}));


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID:     google_secrets.web.client_id,
    clientSecret: google_secrets.web.client_secret,
    //NOTE :
    //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
    //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/
    //then edit your /etc/hosts local file to point on your private IP.
    //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
    //if you use it.
    callbackURL: google_secrets.web.redirect_uris[per_server_settings.google_server_uri_num || 0],
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      fs.access(userdatapath + profile.email, function (err) {
        if (err) {
          return done(false)
        }else{
          return done(null, profile.email);
        }
      });
    });
  }
));
app.use( passport.initialize());
app.use( passport.session());


app.get("/", ensureAuthenticated ,function(req,res){
  
  dbComm.parseData(undefined, function(parsed) {
    var dataForIndexPage = {
      user: req.user,
      weekdays: weekdays,
      possibleDriveHours: possibleDriveHours,
      peoplesTimes: parsed
    };
    //check to see if the preferences are empty and if
    //they are redurect them to the preferences page
    dbComm.getPreferences(req.user, function(preferences){
      if (preferences.name == ""){
        res.redirect("/preferences");
      }else{
        res.render(viewpath + "index.jade", dataForIndexPage);
      } 
    }); 
    
  });
});

app.get("/czar", ensureAuthenticated, function(req, res) {

  dbComm.parseData(undefined, function(parsed) {
    var dataForCzarPage = {
      user: req.user,
      weekdays: weekdays,
      possibleDriveHours: possibleDriveHours,
      peoplesTimes: parsed,
      isNextWeek: true
    };

    res.render(viewpath + "czar.jade", dataForCzarPage);
  });
});

app.get("/czarThisWeek", ensureAuthenticated, function(req, res) {
  dbComm.parseData(new Date, function(parsed) {
    var dataForCzarPage = {
      user: req.user,
      weekdays: weekdays,
      possibleDriveHours: possibleDriveHours,
      peoplesTimes: parsed,
      isNextWeek: false
    };

    res.render(viewpath + "czar.jade", dataForCzarPage);
  });
});

app.get("/dynamic/nextweekSchedule.js", ensureAuthenticated, function(req, res) {
  dbComm.getSchedule(undefined, function(sch) {
    res.send("var cars = " + JSON.stringify(sch));
  });
});

app.get("/dynamic/thisweekSchedule.js", ensureAuthenticated, function(req, res) {
  dbComm.getSchedule(new Date(), function(sch) {
    res.send("var cars = " + JSON.stringify(sch) + ';');
  });
});
app.get("/dynamic/currentUser.js", ensureAuthenticated, function(req, res) {
  res.send('var user = "' + req.user + '";');
});
app.get("/dynamic/allPreferences.js", ensureAuthenticated, function(req, res) {
  //res.set('Content-Type', 'application/javascript');
  dbComm.getAllPreferences(function(allPreferences) {
    res.send("var allPreferences = " + JSON.stringify(allPreferences));
  });
});

app.get("/dynamic/examplePreferences.js", ensureAuthenticated, function(req, res){
  res.send("var allPreferences = " + JSON.stringify(examplePreferences))
});

app.get("/dynamic/exampleCars.js", ensureAuthenticated, function(req, res){
  res.send("var cars = {\"Monday\":{},\"Tuesday\":{},\"Wednesday\":{},\"Thursday\":{},\"Friday\":{}}");
});

app.post("/times", ensureAuthenticated, function(req,res){

  var thisWeeksScheduleFilename = dbComm.userDataFileName();

  fs.writeFile(userdatapath+req.user+'/schedules/'+thisWeeksScheduleFilename,
      JSON.stringify(req.body), function(err) {
        if (err) {
          console.log(err);
        }
      });

  // TODO: Send them to special confirmation page
  res.redirect("/schedule");
});

app.post("/newUser", ensureAuthenticated, function(req,res){

  fs.mkdir(userdatapath+req.body.email, function(err) {
    if(err) {
        console.log(err);
    }
    fs.mkdir(userdatapath+req.body.email+'/schedules', function(err) {
      if(err) {
          console.log(err);
      }
      fs.writeFile(userdatapath+req.body.email+'/preferences', "", function(err) {
        if(err) {
            console.log(err);
        }
        console.log("User " + req.body.email + " created");
      });
    });
  });

  res.redirect("/newUser")
});

app.get('/login', function(req, res){
  res.render(viewpath+'login.jade', { user: req.user });
});


app.get('/schedule', ensureAuthenticated, function(req,res) {
  res.render(viewpath+"schedule.jade", { user: req.user,
    userscars : [{ 'driver':'Louise', 'AM':{ 'time':'10:30 AM', 'passengers':['George', 'Alex', 'Johanna', 'Emel'] }, 'PM':{'time':'4:45 PM', 'passengers':['Harkness', 'Jessie']}},
                 { 'driver':'Louise', 'AM':{ 'time':'10:30 AM', 'passengers':['George', 'Alex', 'Johanna', 'Emel'] }, 'PM':{'time':'4:45 PM', 'passengers':['Harkness', 'Jessie']}}],
    allcars : [ { 'driver':'Louise', 'AM':{ 'time':'10:30 AM', 'passengers':['George', 'Alex', 'Johanna', 'Emel'] }, 'PM':{'time':'4:45 PM', 'passengers':['Harkness', 'Jessie']}}, { 'driver':'Louise', 'AM':{ 'time':'10:30 AM', 'passengers':['George', 'Alex', 'Johanna', 'Emel'] }, 'PM':{'time':'4:45 PM', 'passengers':['Harkness', 'Jessie']}} ] });
});

app.get('/noEmail', function(req,res) {
  res.render(viewpath+"noEmail.jade", { user: req.user });
});

app.get('/newUser', ensureAuthenticated , function(req, res){
  res.render(viewpath+"addUser.jade", { user: req.user })
});

app.get('/howToCzar', ensureAuthenticated, function(req, res){
  res.render(viewpath+"howToCzar.jade", { user: req.user })

});

app.get('/statistics', ensureAuthenticated, function(req, res){
  var fs = require("fs");
  var jsoncontent = fs.readFileSync(".\\data\\statistics\\test2.json");
  var dataForStatPage = JSON.parse(jsoncontent)
  res.render(viewpath+"statistics.jade", dataForStatPage)
});


app.get('/external', ensureAuthenticated, function(req, res){
  res.render(viewpath+"external.jade", { user: req.user })

});
app.get('/emergency', ensureAuthenticated, function(req, res){
  res.render(viewpath+"emergency.jade", { user: req.user })

});
app.get("/contact", ensureAuthenticated, function(req, res) {

  dbComm.getContactData(function(parsed) {
    var contactInfo = {
      user: req.user,
      peoplesInfo: parsed
    };

    res.render(viewpath + "contactinfo.jade", contactInfo);
  });
});

app.get('/preferences', ensureAuthenticated, function(req, res){
  dbComm.getPreferences(req.user, function(preferences){
    var dataForPref = {
      user: req.user,
      name: preferences.name,
      numPassengers: preferences.numPassengers,
      phoneNumber: preferences.phoneNumber,
      email: preferences.email,
      prefEmail: preferences.prefEmail
    };
    res.render(viewpath+"preferences.jade", dataForPref)
  }); 
});

app.post("/prefData", ensureAuthenticated, function(req,res){

  fs.writeFile(userdatapath+req.user+'/preferences',
      JSON.stringify(req.body), function(err) {
        if (err) {
          console.log(err);
        }
      });
  res.redirect("/");
});
app.get('/exampleCzar', ensureAuthenticated, function(req, res){
  var dataForCzar = {
    user: req.user,
    weekdays: ['Monday'],
    possibleDriveHours: possibleDriveHours,
    peoplesTimes: exampleResults.parseddata,
  };

  res.render(viewpath+"exampleCzar.jade", dataForCzar)
});

app.post('/example', ensureAuthenticated, function(req,res){

  res.redirect('/schedule')
});

app.post('/czarData', ensureAuthenticated, function(req,res){
  //console.log(JSON.stringify(req.body));
  fs.writeFile(schedulepath + dbComm.userDataFileName(), req.body.allCars);
  dbComm.updateStatistics(req.body.allCars, function(callback){
    console.log('Inside this function thing');
  })
  res.redirect('/czar')
});
app.post('/czarDataCurrent', ensureAuthenticated, function(req,res){
  //console.log(JSON.stringify(req.body));
  fs.writeFile(schedulepath + dbComm.userDataFileName(new Date()), req.body.allCars);
  dbComm.updateStatistics(req.body.allCars, function(callback){
    console.log('Inside this function thing');
  })
  res.redirect('/czar')
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google', passport.authenticate('google', { scope: [
       'https://www.googleapis.com/auth/plus.login',
       'https://www.googleapis.com/auth/plus.profile.emails.read']
}));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get( '/auth/google/callback',
      passport.authenticate( 'google', {
        successRedirect: '/',
        failureRedirect: '/noEmail'
}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('*', function(req,res) {
  res.render(viewpath+"404.jade",{ user: req.user });
});

app.listen(3005,function(){
  console.log("Live at Port 3005");
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}


