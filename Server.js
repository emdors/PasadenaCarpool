var express = require("express");
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
//var router = express.Router();
//var db = new Datastore({filename:__dirname + 'IDEmailData.db', autoload:true});

app.use(bodyParser.urlencoded({extended: true}));
app.locals.pretty = true

var MongoClient = require('mongodb').MongoClient;

// mongod URI: localhost:27017
// switch to 'test' database

mongod_URI = "mongodb://localhost:27017/test";

var viewpath = __dirname + '/views/';

//router.use(function (req,res,next) {
//  console.log("/" + req.method);
//  next();
//});

app.get("/",function(req,res){
  res.render(viewpath + "index.jade", {ourtitle: "Hello there"});
});

app.use(express.static("static"));

function sendCzarPage(req, res) {
  res.render(viewpath + "czar.jade", {formresults: [
    {name: 'Adam',
  email: 'adunlap@hmc.edu',
  numPassengers: '3',
  MondayDriveStatus: 'cannot',
  TuesdayDriveStatus: 'must',
  WednesdayDriveStatus: 'can',
  ThursdayDriveStatus: 'can',
  FridayDriveStatus: 'can',
  notes: 'Yay!',
  timeValuesToSubmit: 'MondayAM530,MondayAM545,MondayAM600,MondayPM345,MondayPM400,MondayPM415,TuesdayAM815,TuesdayAM830,TuesdayAM845,TuesdayAM915,TuesdayAM945,TuesdayPM315,TuesdayPM330,TuesdayPM345,WednesdayAM530,WednesdayAM545,WednesdayPM415,WednesdayPM430,WednesdayPM445,ThursdayAM530,ThursdayAM545,ThursdayAM600,ThursdayPM645,ThursdayPM700,ThursdayPM715,ThursdayPM730,FridayAM815,FridayAM830,FridayAM845,FridayAM900,FridayAM915,FridayPM530,FridayPM545,FridayPM600,' },
    { name: 'John',
  email: 'jamigo@cuc.edu',
  numPassengers: '4',
  MondayDriveStatus: 'can',
  TuesdayDriveStatus: 'must',
  WednesdayDriveStatus: 'can',
  ThursdayDriveStatus: 'cannot',
  FridayDriveStatus: 'can',
  notes: 'I am taking a 12-person bus on Friday',
  timeValuesToSubmit: 'MondayAM530,MondayAM545,MondayAM600,MondayPM345,MondayPM400,MondayPM415,TuesdayAM815,TuesdayAM845,TuesdayAM915,TuesdayAM945,TuesdayPM315,TuesdayPM330,TuesdayPM345,WednesdayAM530,WednesdayAM545,WednesdayPM430,WednesdayPM445,ThursdayAM530,ThursdayAM545,ThursdayAM600,ThursdayPM645,ThursdayPM700,ThursdayPM715,ThursdayPM730,FridayAM815,FridayAM830,FridayAM845,FridayAM915,FridayPM530,FridayPM545,FridayPM600,' },
    { name: 'jimmathy',
  email: 'aardvark@cmc.edu',
  numPassengers: '2',
  MondayDriveStatus: 'can',
  TuesdayDriveStatus: 'can',
  WednesdayDriveStatus: 'can',
  ThursdayDriveStatus: 'must',
  FridayDriveStatus: 'can',
  notes: 'I like pizza',
  timeValuesToSubmit: 'MondayAM545,MondayAM600,MondayPM345,MondayPM400,MondayPM415,TuesdayAM815,TuesdayAM830,TuesdayAM845,TuesdayAM915,TuesdayPM315,TuesdayPM330,TuesdayPM345,WednesdayAM530,WednesdayAM545,WednesdayPM415,WednesdayPM445,ThursdayAM530,ThursdayAM545,ThursdayAM600,ThursdayPM700,ThursdayPM715,ThursdayPM730,FridayAM815,FridayAM830,FridayAM845,FridayAM900,FridayAM915,FridayPM530,FridayPM545,FridayPM600,' }
  ]});

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
  var name = req.body.name;
  var email = req.body.email;
  // TODO: etc

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
