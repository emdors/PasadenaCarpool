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

// Get the filename for the user data for the given week. If there's no
// argument, use *next* week. Returns string like 2016-03-21, the date of the
// Monday starting that week.
function userDataFileName(dateInput) {
  var date;

  if (typeof dateInput === 'string' && dateInput.length) {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    date = new Date();
    date.setDate(date.getDate() + 7);
  }

  // Magic to set the day to the previous Monday...
  date.setDate(date.getDate() - date.getDay() + 1);

  // Return it in right format
  return date.getFullYear() + '-' + ('0'+(date.getMonth()+1)).slice(-2) + '-' + ('0'+date.getDate()).slice(-2);
}

function parseHistoricalData(callback) {
  fs.readFile(histdatapath + 'test.json', 'utf8', function(err, data) {
    if (err || !data) {
      // Build empty schedule, with an empty object for each day
      var sch = {};
      for (var weekdayIdx=0; weekdayIdx<weekdays.length; ++weekdayIdx) {
        sch[weekdays[weekdayIdx]] = {};
      }
      callback(sch);
    } else {
      var data_full = JSON.parse(data)
      callback(data_full);
    }
  });
}

//Pass in the date of data which we want to parse, undefined is nextweeks data
function parseData(dateToParse, parseDataCallback) {
  fs.readdir(userdatapath, function(err, files) {
    if (err) {
      console.log('Failed reading the user data directory');
      process.exit(1);
    }
    //If the data we want to pull up is
    var thisWeeksScheduleFilename = userDataFileName(dateToParse);
    //console.log(thisWeeksScheduleFilename);

    async.map(files, function(userEmail, callback) {
      var fullFilename = userdatapath + userEmail + '/schedules/'
                         + thisWeeksScheduleFilename;
      fs.readFile(fullFilename, 'utf8', function(err, data) {
        if (err) {
          console.log('Got error (' + fullFilename + ')');
          callback(null, undefined);
        } else {
          //get the preferenence data
          getPreferences(userEmail, function(preferences){
            var dataForCallback = {
              email: preferences.email,
              prefEmail: preferences.prefEmail,
              name: preferences.name,
              numPassengers: preferences.numPassengers,
              phoneNumber: preferences.phoneNumber
            };
            
            var scheduleData = JSON.parse(data)
            for(var key in scheduleData) dataForCallback[key] = scheduleData[key];

            var newScheduleData = {}
            for(var key in scheduleData) {
              if (key != 'name' && key != 'email' && key != 'numPassengers') {
                newScheduleData[key] = scheduleData[key];
              }
            }
            fs.writeFile(fullFilename, JSON.stringify(newScheduleData));

            callback(err, dataForCallback);
          });
        }
      });
    }, function(err, allResultsUnfiltered) {
      //console.log(allResultsUnfiltered);
      var allResults = allResultsUnfiltered.filter(function(r) { return r !== undefined; });
      var parsedResults = [];
      for (var dayIdx=0; dayIdx<weekdays.length; ++dayIdx) {
        parsedResults.push({"day":weekdays[dayIdx], "times":[{"halfday": "AM", "people" : []}, {"halfday":"PM", "people":[]}]});
      }

      for (var resultIdx=0; resultIdx < allResults.length; ++resultIdx) {
        var result = allResults[resultIdx];

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
            parsedResults.filter(
                //d => d.day == day
                function(d) { return d.day == day; }
              )[0].times.filter(
                //hd => hd.halfday == ampm
                function (hd) { return hd.halfday == ampm; }
              )[0].people.push({
                name: result.name,
                notes: result[day + 'notes'],
                driveStatus: result[day + 'DriveStatus'],
                canGos: canGos,
                numPassengers: result.numPassengers,
                email: result.email,
                prefEmail: result.prefEmail,
                phoneNumber: result.phoneNumber
              });
          }
        }

        for (var dayIdx=0; dayIdx<parsedResults.length; dayIdx++) {
          var dayData = parsedResults[dayIdx];
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
      }

      parseDataCallback(parsedResults);
    });
  });
}

function getPreferences(userEmail, preferencesCallback){
  var fullFilename = userdatapath + userEmail + "/preferences"
  fs.readFile(fullFilename, 'utf8', function(err, data) {
    if (err) {
      console.log('Got error (' + fullFilename + ')');
      preferencesCallback(undefined);
    } else {
        var myData;
        try{
          myData = JSON.parse(data)
          if(myData.prefEmail == undefined){
            myData.prefEmail = userEmail
          }
          myData.email = userEmail
        }
        catch(e){
          myData = {
            name: "",
            phoneNumber: "",
            numPassengers: "",
            email: userEmail,
            prefEmail: userEmail
          }
        }
      //console.log(myData)
      preferencesCallback(myData);
    }
  });
}


function getContactData(contactDataCallback){
  fs.readdir(userdatapath, function(err, files) {
    if (err) {
      console.log('Failed reading the user data directory');
      process.exit(1);
    }

    async.map(files, function(userEmail, callback) {
      if(userEmail !== undefined){
        getPreferences(userEmail, function(preferences){
          if(preferences == undefined){
            callback(null, undefined)

          }else{
            var dataForCallback = {
              prefEmail: preferences.prefEmail,
              name: preferences.name,
              numPassengers: preferences.numPassengers,
              phoneNumber: preferences.phoneNumber
            };
            callback(err, dataForCallback);
          }
        });
      }else{
        callback(null, undefined );
      }

    }, function(err, allResultsUnfiltered) {
      //console.log(allResultsUnfiltered);
      var filteredResults = allResultsUnfiltered.filter(function(r) { return r !== undefined; })
      contactDataCallback(filteredResults);
    });
  });

}

app.get("/", ensureAuthenticated ,function(req,res){
  
  parseData(undefined, function(parsed) {
    var dataForIndexPage = {
      user: req.user,
      weekdays: weekdays,
      possibleDriveHours: possibleDriveHours,
      peoplesTimes: parsed
    };
    //check to see if the preferences are empty and if
    //they are redurect them to the preferences page
    getPreferences(req.user, function(preferences){
      if (preferences.name == ""){
        res.redirect("/preferences");
      }else{
        res.render(viewpath + "index.jade", dataForIndexPage);
      } 
    }); 
    
  });
});

app.get("/czar", ensureAuthenticated, function(req, res) {

  parseData(undefined, function(parsed) {
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
  parseData(new Date, function(parsed) {
    var dataForCzarPage = {
      user: req.user,
      weekdays: weekdays,
      possibleDriveHours: possibleDriveHours,
      peoplesTimes: parsed,
      isNextWeek: false
    };

    console.log(JSON.stringify(parsed))

    res.render(viewpath + "czar.jade", dataForCzarPage);
  });
});

function getSchedule(day, callback) {
  fs.readFile(schedulepath + userDataFileName(day), 'utf8', function(err, data) {
    if (err || !data) {
      // Build empty schedule, with an empty object for each day
      var sch = {};
      for (var weekdayIdx=0; weekdayIdx<weekdays.length; ++weekdayIdx) {
        sch[weekdays[weekdayIdx]] = {};
      }
      callback(sch);
    } else {
      callback(JSON.parse(data));
    }
  });
}

app.get("/dynamic/nextweekSchedule.js", ensureAuthenticated, function(req, res) {
  getSchedule(undefined, function(sch) {
    res.send("var cars = " + JSON.stringify(sch));
  });
});
app.get("/dynamic/thisweekSchedule.js", ensureAuthenticated, function(req, res) {
  getSchedule(new Date(), function(sch) {
    res.send("var cars = " + JSON.stringify(sch) + ';');
  });
});
app.get("/dynamic/currentUser.js", ensureAuthenticated, function(req, res) {
  res.send('var user = "' + req.user + '";');
});
app.get("/dynamic/allPreferences.js", ensureAuthenticated, function(req, res) {
  //res.set('Content-Type', 'application/javascript');
  
  fs.readdir(userdatapath, function(err, files) {
    if (err) {
      console.log('Failed reading the user data directory');
      process.exit(1);
    }
    async.map(files, function(userEmail, callback) {
      getPreferences(userEmail, function(preferences){
        callback(undefined, preferences);
      });
    }, function(err, allPreferences) {
      var allPreferencesObj = {};
      for (var i=0; i<allPreferences.length; ++i) {
        allPreferencesObj[allPreferences[i].email] = allPreferences[i];
      }
      res.send("var allPreferences = " + JSON.stringify(allPreferencesObj));
    });
  });
});

app.get("/dynamic/examplePreferences.js", ensureAuthenticated, function(req, res){
  res.send("var allPreferences = " + JSON.stringify(examplePreferences))
});

app.get("/dynamic/exampleCars.js", ensureAuthenticated, function(req, res){
  res.send("var cars = {\"Monday\":{},\"Tuesday\":{},\"Wednesday\":{},\"Thursday\":{},\"Friday\":{}}");
});

app.post("/times", ensureAuthenticated, function(req,res){

  var thisWeeksScheduleFilename = userDataFileName();

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
app.get("/contact", ensureAuthenticated, function(req, res) {

  getContactData(function(parsed) {
    var contactInfo = {
      user: req.user,
      peoplesInfo: parsed
    };

    res.render(viewpath + "contactinfo.jade", contactInfo);
  });
});

app.get('/preferences', ensureAuthenticated, function(req, res){
  getPreferences(req.user, function(preferences){
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
  fs.writeFile(schedulepath + userDataFileName(), req.body.allCars);
  res.redirect('/czar')
});
app.post('/czarDataCurrent', ensureAuthenticated, function(req,res){
  //console.log(JSON.stringify(req.body));
  fs.writeFile(schedulepath + userDataFileName(new Date()), req.body.allCars);
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


