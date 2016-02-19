var express = require("express");
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.locals.pretty = true

var MongoClient = require('mongodb').MongoClient;

// mongod URI: localhost:27017
// switch to 'test' database

mongod_URI = "mongodb://localhost:27017/test";

var viewpath = __dirname + '/views/';

var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
var possibleDriveHours = {AM: [5,6,7,8,9,10], PM: [3,4,5,6,7,8]};

app.get("/",function(req,res){
  res.render(viewpath + "index.jade", {weekdays:weekdays, possibleDriveHours:possibleDriveHours});
});

app.use(express.static("static"));

var resultsSoFar = [
//{ name: 'Adam',
//  email: 'adunlap@hmc.edu',
//  numPassengers: '3',
//  MondayDriveStatus: 'can',
//  TuesdayDriveStatus: 'must',
//  WednesdayDriveStatus: 'can',
//  ThursdayDriveStatus: 'cannot',
//  FridayDriveStatus: 'can',
//  notes: 'This is a note!',
//  MondayAMTimes: '500,515,530,545,600,',
//  MondayPMTimes: '430,445,500,545,600,',
//  TuesdayAMTimes: '700,715,',
//  TuesdayPMTimes: '615,645,700,715,730,',
//  WednesdayAMTimes: '700,715,',
//  WednesdayPMTimes: '645,700,715,730,',
//  ThursdayAMTimes: '700,715,',
//  ThursdayPMTimes: '',
//  FridayAMTimes: '700,715,',
//  FridayPMTimes: '315,330,345,' },
//{ name: 'Person 2',
//  email: 'otheremail',
//  numPassengers: '3',
//  MondayDriveStatus: 'must',
//  TuesdayDriveStatus: 'must',
//  WednesdayDriveStatus: 'can',
//  ThursdayDriveStatus: 'can',
//  FridayDriveStatus: 'cannot',
//  notes: 'This is a note!',
//  MondayAMTimes: '515,530,545,600,',
//  MondayPMTimes: '430,445,545,600,',
//  TuesdayAMTimes: '700,715,',
//  TuesdayPMTimes: '615,700,715,730,',
//  WednesdayAMTimes: '700,715,',
//  WednesdayPMTimes: '615,645,700,715,730,',
//  ThursdayAMTimes: '700,715,',
//  ThursdayPMTimes: '600,',
//  FridayAMTimes: '700,',
//  FridayPMTimes: '315,345,' },
];

app.get("/czar", function (req, res) {

  var dataForCzar = {
    weekdays: weekdays,
    possibleDriveHours: possibleDriveHours,
    peoplesTimes: [],
    formResults: resultsSoFar,
  };
  // example:
  //peoplesTimes: [ {day: 'Monday', times: [
  // { halfday: 'AM', people: [
  //   {name: 'Adam', driveStatus: 'can', canGos: {400: 'selected', 415: 'unselected'}},
  //   {name: 'Bob', driveStatus: 'can',  canGos: {400: 'unselected', 415: 'selected'}}
  // ]},
  // { halfay: 'pm', people: [
  //   {name: 'Bob', driveStatus: 'can',  canGos: {400: 'selected', 415: 'unselected'}}
  //   {name: 'Adam', driveStatus: 'can', canGos: {400: 'unselected', 415: 'selected'}},
  // ]},
  //]}]

  for (var dayIdx=0; dayIdx<weekdays.length; dayIdx++) {
    var day = weekdays[dayIdx];
    var dayData = {day: day, times: []};
    for (var ampm in possibleDriveHours) {
      dayData.times.push({halfday: ampm, people: []});
    }

    dataForCzar.peoplesTimes.push(dayData);
  }
  for (var resultIdx=0; resultIdx<resultsSoFar.length; resultIdx++) {
    var result = resultsSoFar[resultIdx];
    for (var dayIdx=0; dayIdx<weekdays.length; dayIdx++) {
      var day = weekdays[dayIdx];
      for (var ampm in possibleDriveHours) {
        var thisPersonsTimes = result[day+ampm+'Times'];
        var canGos = {};

        for (var hrIdx = 0; hrIdx<possibleDriveHours[ampm].length; hrIdx++) {
          var hr = possibleDriveHours[ampm][hrIdx];
          for (var min=0; min<60; min += 15) {
            var hrMin = hr*100 + min;
            var canGo = thisPersonsTimes.indexOf(hrMin) != -1;
            canGos[hrMin] = canGo? 'selected' : 'unselected';
          }
        }
        dataForCzar.peoplesTimes.find(
            d => d.day == day
          ).times.find(
            hd => hd.halfday == ampm
          ).people.push({
            name: result.name,
            driveStatus: result[day + 'DriveStatus'],
            canGos: canGos
          });
      }
    }
  }

  for (var dayIdx=0; dayIdx<dataForCzar.peoplesTimes.length; dayIdx++) {
    var dayData = dataForCzar.peoplesTimes[dayIdx];
    for (var ampmIdx=0; ampmIdx<dayData.times.length; ampmIdx++) {
      var ampmdata = dayData.times[ampmIdx];
      // Sort the people by their earliest 'selected' entry
      ampmdata.people.sort(function(p1, p2) {
        for (var times in p1.canGos) {
          if (p1.canGos[times] == 'selected') return -1;
          if (p2.canGos[times] == 'selected') return 1;
        }
        return 0;
      });
    }
  }

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
  resultsSoFar.push(req.body);
  //console.log(req.body);

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
