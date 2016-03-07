"use strict";
var express = require("express");
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.locals.pretty = true

var MongoClient = require('mongodb').MongoClient;

// mongod URI: localhost:27017
// switch to 'test' database

var mongod_URI = "mongodb://localhost:27017/test";

var viewpath = __dirname + '/views/';

var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
var possibleDriveHours = {AM: [5,6,7,8,9,10], PM: [3,4,5,6,7,8]};

app.use(express.static("static"));

var resultsSoFar = require('./startingdata').data;

app.get("/",function(req,res){
  var dataForIndex = {
    weekdays: weekdays,
    possibleDriveHours: possibleDriveHours,
    peoplesTimes: resultsSoFar.parseddata,
    formResults: resultsSoFar.rawdata,
  };
  res.render(viewpath + "index.jade", dataForIndex);
});

app.get("/czar", function (req, res) {

  var dataForCzar = {
    weekdays: weekdays,
    possibleDriveHours: possibleDriveHours,
    peoplesTimes: resultsSoFar.parseddata,
    formResults: resultsSoFar.rawdata,
  };

  res.render(viewpath + "czar.jade", dataForCzar);
});


//app.get("/czar",function(req,res){
//  var output = "";
//  MongoClient.connect(mongod_URI, function(err, db) {
//    if (err != null) {
//      console.error(err);
//    }
//    var cursor = db.collection('weeklyCommutes').find();
//    cursor.each(function(err, doc) {
//       if (doc != null) {
//         console.log(doc.name);
//         output = output + JSON.stringify(doc) + "\n";
//       }
//    });
//    console.log("output: " + output);
//    res.send(output);
//  });
//});

app.post("/times", function(req,res){
  resultsSoFar.rawdata.push(req.body);

  // example:
  //peoplesTimes: [ {day: 'Monday', times: [
  // { halfday: 'AM', people: [
  //   {name: 'Adam', driveStatus: 'can', canGos: [{time:400, canGo:'selected'},   {time:415, canGo:'unselected'}]},
  //   {name: 'Bob', driveStatus: 'can',  canGos: [{time:400, canGo:'unselected'}, {time:415, canGo:'selected'}]}
  // ]},
  // { halfay: 'pm', people: [
  //   {name: 'Bob', driveStatus: 'can',  canGos: [{time:400, canGo:'selected'},   {time:415, canGo:'unselected'}]}
  //   {name: 'Adam', driveStatus: 'can', canGos: [{time:400, canGo:'unselected'}, {time:415, canGo:'selected'}]},
  // ]},
  //]}]

  //for (var dayIdx=0; dayIdx<weekdays.length; dayIdx++) {
  //  var day = weekdays[dayIdx];
  //  var dayData = {day: day, times: []};
  //  for (var ampm in possibleDriveHours) {
  //    dayData.times.push({halfday: ampm, people: []});
  //  }

  //  dataForCzar.peoplesTimes.push(dayData);
  //}
  //for (var resultIdx=0; resultIdx<resultsSoFar.length; resultIdx++) {
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

  //weeklyCommuteFormBody = req.body;
  //MongoClient.connect(mongod_URI, function(err, db) {
  //  if (!err) {
  //    console.log("Connected to " + mongod_URI);
  //  }
  //  insertWeeklyCommuteDocument(db, weeklyCommuteFormBody, function() {
  //    db.close();
  //  });
  //});

  // TODO: Send them to special confirmation page
  res.redirect("/czar");
});

app.get('/schedule', function(req,res) {
  res.render(viewpath+"schedule.jade");
});

app.get('*', function(req,res) {
  res.render(viewpath+"404.jade");
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
