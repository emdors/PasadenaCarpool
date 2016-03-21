"use strict";
var express = require("express");
var bodyParser = require('body-parser');

var fs = require('fs');

var app = express();
var server = require( 'http' ).createServer( app )

var MongoClient = require('mongodb').MongoClient;

// mongod URI: localhost:27017
// switch to 'test' database

var mongod_URI = "mongodb://localhost:27017/test";

//Things needed for passport authetification

var util = require( 'util' )
var cookieParser = require('cookie-parser');
var passport = require( 'passport' )
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var session = require( 'express-session' )


// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
var GOOGLE_CLIENT_ID      = "279399539426-1i0aea9npr8tjb8j9r9g0ol91jh8206v.apps.googleusercontent.com"
  , GOOGLE_CLIENT_SECRET  = "P9DYLvxckP9hzzqcy8JnH9i2";

var viewpath = __dirname + '/views/';

var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
var possibleDriveHours = {AM: [5,6,7,8,9,10], PM: [3,4,5,6,7,8]};

var resultsSoFar = require('./startingdata').data;




app.use(cookieParser());
app.use( bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.locals.pretty = true

app.use(express.static("static"));
app.use(session({ secret: 'secret', key: 'user', cookie: { maxAge: 60000, secure: false }}));


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
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    //NOTE :
    //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
    //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/ 
    //then edit your /etc/hosts local file to point on your private IP. 
    //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
    //if you use it.
    callbackURL: "http://devbox.example.com:3005/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      console.log(profile.email)
      fs.readFile(__dirname + '/data/' + profile.email, function (err, data) {
        if (err) {
          return done(false)
          
        }else{
          console.log(data);
          return done(null, profile.email);
        }
      });
    });
  }
));
app.use( passport.initialize());
app.use( passport.session());


app.get("/", ensureAuthenticated ,function(req,res){
  var dataForIndex = {
    user: req.user,
    weekdays: weekdays,
    possibleDriveHours: possibleDriveHours,
    peoplesTimes: resultsSoFar.parseddata,
    formResults: resultsSoFar.rawdata,
  };
  res.render(viewpath + "index.jade", dataForIndex);
});

app.get("/czar", ensureAuthenticated ,function (req, res) {

  var dataForCzar = {
    user: req.user,
    weekdays: weekdays,
    possibleDriveHours: possibleDriveHours,
    peoplesTimes: resultsSoFar.parseddata,
    formResults: resultsSoFar.rawdata,
  };

  res.render(viewpath + "czar.jade", dataForCzar);
});

app.post("/times", ensureAuthenticated, function(req,res){
  resultsSoFar.rawdata.push(req.body);
    var result = req.body;
    for (var dayIdx=0; dayIdx<weekdays.length; dayIdx++) {
      var day = weekdays[dayIdx];
      for (var ampm in possibleDriveHours) {
        var thisPersonsTimes = result[day+ampm+'Times'];
        var canGos = [];

        for (var hrIdx = 0; hrIdx<possibleDriveHours[ampm].length; hrIdx++) {
          var hr = possibleDriveHours[ampm][hrIdx];
          for (var min=0; min<60; min += 15) {
            var hrMin = hr*100 + min;
            var canGo = thisPersonsTimes.indexOf(hrMin) != -1;
            canGos.push({time:hrMin, canGo: canGo});
          }
        }
        // Using filter instead of find because node on Knuth does not have find
        // Also why I'm using the function(x) {return y;} syntax rather than x=>y
        resultsSoFar.parseddata.filter(
            //d => d.day == day
            function(d) { return d.day == day; }
          )[0].times.filter(
            //hd => hd.halfday == ampm
            function (hd) { return hd.halfday == ampm; }
          )[0].people.push({
            name: result.name,
            driveStatus: result[day + 'DriveStatus'],
            canGos: canGos
          });
      }
    }
  //}

  for (var dayIdx=0; dayIdx<resultsSoFar.parseddata.length; dayIdx++) {
    var dayData = resultsSoFar.parseddata[dayIdx];
    for (var ampmIdx=0; ampmIdx<dayData.times.length; ampmIdx++) {
      var ampmdata = dayData.times[ampmIdx];
      // Sort the people by their earliest/latest 'selected' entry (earliest if
      // PM, latest if AM)
      ampmdata.people.sort(function(p1, p2) {
        for (var canGoIdx=0; canGoIdx<p1.canGos.length; canGoIdx++) {
          var realIdx = ampmdata.halfday == 'AM'?
            p1.canGos.length-canGoIdx-1 : canGoIdx;
          if (p1.canGos[realIdx].canGo) return -1;
          if (p2.canGos[realIdx].canGo) return 1;
        }
        return 0;
      });
    }
  }



  //console.log(req.body);
  console.log(resultsSoFar);

  // TODO: Send them to special confirmation page
  res.redirect("/czar");
});

app.post("/newUser", ensureAuthenticated, function(req,res){
  

  fs.writeFile(__dirname+"/data/"+req.body.email, "", function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  }); 
  res.redirect("/newUser", { user: req.user })
});

app.get('/login', function(req, res){
  res.render(viewpath+'login.jade', { user: req.user });
});


app.get('/schedule', ensureAuthenticated, function(req,res) {
  res.render(viewpath+"schedule.jade",{ user: req.user });
});

app.get('/noEmail', function(req,res) {
  res.render(viewpath+"noEmail.jade");
});

app.get('/newUser', ensureAuthenticated , function(req, res){
  res.render(viewpath+"addUser.jade")
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

// mongodb objects are referred to as "documents"
var insertWeeklyCommuteDocument = function(db, weeklyCommuteFormBody, callback) {
  db.collection('weeklyCommutes').insertOne(weeklyCommuteFormBody, function(err, result) {
    console.log("Inserted a weekly commute document into weeklyCommutes collection");
    callback(result);
  });
};

var findWeeklyCommutes = function(db, callback) {
   var cursor = db.collection('weeklyCommutes').find();
   var docs = [];
   
   console.log(docs)
   return docs;
};

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}