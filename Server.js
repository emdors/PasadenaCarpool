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

var resultsSoFar =
//[ { name: 'Adam',
//    email: 'adam@gmail.com',
//    numPassengers: '4',
//    MondayDriveStatus: 'can',
//    TuesdayDriveStatus: 'can',
//    WednesdayDriveStatus: 'must',
//    ThursdayDriveStatus: 'can',
//    FridayDriveStatus: 'can',
//    notes: 'Ponies are awesome.',
//    MondayAMTimes: '530,545,600,',
//    MondayPMTimes: '515,530,545,600,615,',
//    TuesdayAMTimes: '645,700,715,',
//    TuesdayPMTimes: '345,400,415,',
//    WednesdayAMTimes: '745,800,815,830,845,',
//    WednesdayPMTimes: '415,430,445,500,515,530,',
//    ThursdayAMTimes: '',
//    ThursdayPMTimes: '430,445,500,515,530,545,',
//    FridayAMTimes: '1015,1030,1045,',
//    FridayPMTimes: '445,500,515,530,545,' },
//  { name: 'Bob',
//    email: 'Bob@gmail.com',
//    numPassengers: '8',
//    MondayDriveStatus: 'can',
//    TuesdayDriveStatus: 'cannot',
//    WednesdayDriveStatus: 'can',
//    ThursdayDriveStatus: 'can',
//    FridayDriveStatus: 'can',
//    notes: 'Dogs are awesome.',
//    MondayAMTimes: '1000,1015,1030,1045,',
//    MondayPMTimes: '600,615,630,',
//    TuesdayAMTimes: '600,615,630,645,',
//    TuesdayPMTimes: '630,645,700,715,730,',
//    WednesdayAMTimes: '615,630,645,700,',
//    WednesdayPMTimes: '515,530,545,600,',
//    ThursdayAMTimes: '',
//    ThursdayPMTimes: '415,430,445,500,515,530,',
//    FridayAMTimes: '845,900,915,930,945,',
//    FridayPMTimes: '400,415,430,445,500,515,' },
//  { name: 'Caroline',
//    email: 'carol@ine.org',
//    numPassengers: '0',
//    MondayDriveStatus: 'can',
//    TuesdayDriveStatus: 'can',
//    WednesdayDriveStatus: 'can',
//    ThursdayDriveStatus: 'can',
//    FridayDriveStatus: 'cannot',
//    notes: 'Ines are awesome',
//    MondayAMTimes: '700,715,730,745,',
//    MondayPMTimes: '400,415,430,445,',
//    TuesdayAMTimes: '830,845,900,915,',
//    TuesdayPMTimes: '530,545,600,615,',
//    WednesdayAMTimes: '1030,1045,',
//    WednesdayPMTimes: '545,600,615,630,645,',
//    ThursdayAMTimes: '',
//    ThursdayPMTimes: '545,600,615,630,645,',
//    FridayAMTimes: '545,600,615,630,',
//    FridayPMTimes: '515,530,545,600,615,630,645,700,715,730,745,800,815,' } ];
[ { name: 'Adam',
    email: 'adam@gmail.com',
    numPassengers: '4',
    MondayDriveStatus: 'can',
    TuesdayDriveStatus: 'can',
    WednesdayDriveStatus: 'must',
    ThursdayDriveStatus: 'can',
    FridayDriveStatus: 'can',
    notes: 'Ponies are awesome.',
    MondayAMTimes: '530,545,600,',
    MondayPMTimes: '515,530,545,600,615,',
    TuesdayAMTimes: '645,700,715,',
    TuesdayPMTimes: '345,400,415,',
    WednesdayAMTimes: '745,800,815,830,845,',
    WednesdayPMTimes: '415,430,445,500,515,530,',
    ThursdayAMTimes: '',
    ThursdayPMTimes: '430,445,500,515,530,545,',
    FridayAMTimes: '1015,1030,1045,',
    FridayPMTimes: '445,500,515,530,545,' },
  { name: 'Bob',
    email: 'Bob@gmail.com',
    numPassengers: '8',
    MondayDriveStatus: 'can',
    TuesdayDriveStatus: 'cannot',
    WednesdayDriveStatus: 'can',
    ThursdayDriveStatus: 'can',
    FridayDriveStatus: 'can',
    notes: 'Dogs are awesome.',
    MondayAMTimes: '1000,1015,1030,1045,',
    MondayPMTimes: '600,615,630,',
    TuesdayAMTimes: '600,615,630,645,',
    TuesdayPMTimes: '630,645,700,715,730,',
    WednesdayAMTimes: '615,630,645,700,',
    WednesdayPMTimes: '515,530,545,600,',
    ThursdayAMTimes: '',
    ThursdayPMTimes: '415,430,445,500,515,530,',
    FridayAMTimes: '845,900,915,930,945,',
    FridayPMTimes: '400,415,430,445,500,515,' },
  { name: 'Caroline',
    email: 'carol@ine.org',
    numPassengers: '0',
    MondayDriveStatus: 'can',
    TuesdayDriveStatus: 'can',
    WednesdayDriveStatus: 'can',
    ThursdayDriveStatus: 'can',
    FridayDriveStatus: 'cannot',
    notes: 'Ines are awesome',
    MondayAMTimes: '700,715,730,745,',
    MondayPMTimes: '400,415,430,445,',
    TuesdayAMTimes: '830,845,900,915,',
    TuesdayPMTimes: '530,545,600,615,',
    WednesdayAMTimes: '1030,1045,',
    WednesdayPMTimes: '545,600,615,630,645,',
    ThursdayAMTimes: '',
    ThursdayPMTimes: '545,600,615,630,645,',
    FridayAMTimes: '545,600,615,630,',
    FridayPMTimes: '515,530,545,600,615,630,645,700,715,730,745,800,815,' },
  { name: 'Katie',
    email: 'kt@gmail.com',
    numPassengers: '3',
    MondayDriveStatus: 'can',
    TuesdayDriveStatus: 'can',
    WednesdayDriveStatus: 'can',
    ThursdayDriveStatus: 'can',
    FridayDriveStatus: 'can',
    notes: '',
    MondayAMTimes: '545,600,615,630,645,700,715,',
    MondayPMTimes: '515,530,545,600,615,630,',
    TuesdayAMTimes: '645,700,715,730,',
    TuesdayPMTimes: '530,545,600,615,',
    WednesdayAMTimes: '600,615,630,645,700,',
    WednesdayPMTimes: '600,615,630,645,',
    ThursdayAMTimes: '',
    ThursdayPMTimes: '430,445,500,515,530,545,',
    FridayAMTimes: '730,745,800,815,',
    FridayPMTimes: '545,600,615,630,645,700,' },
  { name: 'Doren',
    email: 'doren@gmail.com',
    numPassengers: '5',
    MondayDriveStatus: 'can',
    TuesdayDriveStatus: 'can',
    WednesdayDriveStatus: 'can',
    ThursdayDriveStatus: 'can',
    FridayDriveStatus: 'can',
    notes: '',
    MondayAMTimes: '545,600,615,630,645,',
    MondayPMTimes: '430,445,500,515,530,545,',
    TuesdayAMTimes: '600,615,630,645,700,',
    TuesdayPMTimes: '515,530,545,600,615,630,',
    WednesdayAMTimes: '630,645,700,715,730,',
    WednesdayPMTimes: '545,600,615,630,645,700,715,',
    ThursdayAMTimes: '600,615,630,645,700,715,',
    ThursdayPMTimes: '615,630,645,700,715,730,',
    FridayAMTimes: '545,600,615,630,645,',
    FridayPMTimes: '445,500,515,530,545,600,615,' },
  { name: 'Estrid',
    email: 'estrid@gmail.com',
    numPassengers: '6',
    MondayDriveStatus: 'can',
    TuesdayDriveStatus: 'can',
    WednesdayDriveStatus: 'can',
    ThursdayDriveStatus: 'can',
    FridayDriveStatus: 'can',
    notes: '',
    MondayAMTimes: '615,630,645,700,715,730,',
    MondayPMTimes: '530,545,600,615,630,645,',
    TuesdayAMTimes: '630,645,700,715,',
    TuesdayPMTimes: '530,545,600,615,630,645,700,',
    WednesdayAMTimes: '715,730,745,800,815,830,',
    WednesdayPMTimes: '445,500,515,530,',
    ThursdayAMTimes: '645,700,715,730,745,',
    ThursdayPMTimes: '530,545,600,615,630,645,700,715,',
    FridayAMTimes: '745,800,815,830,845,900,',
    FridayPMTimes: '430,445,500,515,530,545,600,615,' },
  { name: 'Frizzle',
    email: 'frizzle@yahoo.net',
    numPassengers: '2',
    MondayDriveStatus: 'can',
    TuesdayDriveStatus: 'can',
    WednesdayDriveStatus: 'can',
    ThursdayDriveStatus: 'can',
    FridayDriveStatus: 'can',
    notes: '',
    MondayAMTimes: '615,630,645,',
    MondayPMTimes: '430,445,500,515,530,545,',
    TuesdayAMTimes: '600,615,630,645,700,',
    TuesdayPMTimes: '515,530,545,600,615,630,645,',
    WednesdayAMTimes: '645,700,715,730,745,800,',
    WednesdayPMTimes: '415,430,445,500,515,530,545,600,',
    ThursdayAMTimes: '645,700,715,730,745,800,815,830,',
    ThursdayPMTimes: '430,445,500,515,530,545,600,',
    FridayAMTimes: '700,715,730,745,800,815,',
    FridayPMTimes: '430,445,500,515,530,545,600,' },
  { name: 'Guthrie',
    email: 'guth@hotmail.edu',
    numPassengers: '0',
    MondayDriveStatus: 'cannot',
    TuesdayDriveStatus: 'cannot',
    WednesdayDriveStatus: 'cannot',
    ThursdayDriveStatus: 'cannot',
    FridayDriveStatus: 'cannot',
    notes: '',
    MondayAMTimes: '745,800,815,830,845,900,915,930,945,1000,1015,1030,1045,',
    MondayPMTimes: '415,430,445,500,515,',
    TuesdayAMTimes: '845,900,915,930,',
    TuesdayPMTimes: '515,530,545,600,615,',
    WednesdayAMTimes: '615,630,645,700,715,',
    WednesdayPMTimes: '445,500,515,530,545,600,615,',
    ThursdayAMTimes: '645,700,715,730,745,800,815,',
    ThursdayPMTimes: '515,530,545,600,615,',
    FridayAMTimes: '615,630,645,700,715,',
    FridayPMTimes: '515,530,545,600,615,630,645,' } ];






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
  //   {name: 'Adam', driveStatus: 'can', canGos: [{time:400, canGo:'selected'},   {time:415, canGo:'unselected'}]},
  //   {name: 'Bob', driveStatus: 'can',  canGos: [{time:400, canGo:'unselected'}, {time:415, canGo:'selected'}]}
  // ]},
  // { halfay: 'pm', people: [
  //   {name: 'Bob', driveStatus: 'can',  canGos: [{time:400, canGo:'selected'},   {time:415, canGo:'unselected'}]}
  //   {name: 'Adam', driveStatus: 'can', canGos: [{time:400, canGo:'unselected'}, {time:415, canGo:'selected'}]},
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
        var canGos = [];

        for (var hrIdx = 0; hrIdx<possibleDriveHours[ampm].length; hrIdx++) {
          var hr = possibleDriveHours[ampm][hrIdx];
          for (var min=0; min<60; min += 15) {
            var hrMin = hr*100 + min;
            var canGo = thisPersonsTimes.indexOf(hrMin) != -1;
            canGos.push({time:hrMin, canGo: canGo? 'selected' : 'unselected'});
          }
        }
        // Using filter instead of find because node on Knuth does not have find
        // Also why I'm using the function(x) {return y;} syntax rather than x=>y
        dataForCzar.peoplesTimes.filter(
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
  }

  for (var dayIdx=0; dayIdx<dataForCzar.peoplesTimes.length; dayIdx++) {
    var dayData = dataForCzar.peoplesTimes[dayIdx];
    for (var ampmIdx=0; ampmIdx<dayData.times.length; ampmIdx++) {
      var ampmdata = dayData.times[ampmIdx];
      // Sort the people by their earliest/latest 'selected' entry (earliest if
      // PM, latest if AM)
      ampmdata.people.sort(function(p1, p2) {
        for (var canGoIdx=0; canGoIdx<p1.canGos.length; canGoIdx++) {
          var realIdx = ampmdata.halfday == 'AM'?
            p1.canGos.length-canGoIdx-1 : canGoIdx;
          if (p1.canGos[realIdx].canGo == 'selected') return -1;
          if (p2.canGos[realIdx].canGo == 'selected') return 1;
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
