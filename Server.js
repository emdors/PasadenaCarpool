var express = require("express");
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
//var router = express.Router();
//var db = new Datastore({filename:__dirname + 'IDEmailData.db', autoload:true});

app.use(bodyParser.urlencoded({extended: true}));

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
  res.sendFile(viewpath + "index.html");
});

app.use(express.static("static"));

function sendCzarPage(req, res) {
  res.sendFile(viewpath + "czar.html");
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

//router.use('/times', bodyParser());

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

//app.use(cookieParser());

//app.use("/",router);

//app.use("*",function(req,res){
//  res.sendFile(viewpath + "404.html");
//});

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
