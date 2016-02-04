var express = require("express");
//var Datastore = require('nedb')
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
var router = express.Router();
//var db = new Datastore({filename:__dirname + 'IDEmailData.db', autoload:true});

var viewpath = __dirname + '/views/';

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(viewpath + "index.html");
});

router.get("/czar",function(req,res){
  res.sendFile(viewpath + "czar.html");
});

router.use('/confirm', bodyParser());

router.post("/times", function(req,res){
  var name = req.body.name;
  var email = req.body.email;
  // TODO: etc

  // TODO: Send them to special confirmation page
  res.send('Thanks!');
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(viewpath + "404.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});
