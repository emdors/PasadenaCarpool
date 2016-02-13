var express = require("express");
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
//var router = express.Router();
//var db = new Datastore({filename:__dirname + 'IDEmailData.db', autoload:true});

app.use(bodyParser.urlencoded({extended: true}));
//app.locals.pretty = true

var MongoClient = require('mongodb').MongoClient;

// mongod URI: localhost:27017
// switch to 'test' database

mongod_URI = "mongodb://localhost:27017/test";

var viewpath = __dirname + '/views/';

app.get("/",function(req,res){
  res.render(viewpath + "index.jade", {ourtitle: "Hello there"});
});

app.use(express.static("static"));

var resultsSoFar = [
{ name: 'Adam',
  email: 'adunlap@hmc.edu',
  numPassengers: '3',
  MondayDriveStatus: 'can',
  TuesdayDriveStatus: 'must',
  WednesdayDriveStatus: 'can',
  ThursdayDriveStatus: 'cannot',
  FridayDriveStatus: 'can',
  notes: 'This is a note!',
  MondayAMTimes: '500,515,530,545,600,',
  MondayPMTimes: '430,445,500,545,600,',
  TuesdayAMTimes: '700,715,',
  TuesdayPMTimes: '615,645,700,715,730,',
  WednesdayAMTimes: '700,715,',
  WednesdayPMTimes: '615,645,700,715,730,',
  ThursdayAMTimes: '700,715,',
  ThursdayPMTimes: '615,645,700,715,730,',
  FridayAMTimes: '700,715,',
  FridayPMTimes: '315,330,345,' }
];

function sendCzarPage(req, res) {
  res.render(viewpath + "czar.jade", {formresults: resultsSoFar});

}

app.get("/czar", sendCzarPage);

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
  console.log(req.body);

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
  sendCzarPage(req, res);
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
