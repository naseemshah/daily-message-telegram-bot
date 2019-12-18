// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();
const request = require('request');
var telegram = require('telegram-bot-api');
var util = require('util');
var mongo = require('mongodb');

//========================
var api = new telegram({
  token: '1003269993:AAFwSTvZHhJruF6pvbZUK5hqP4k0fEg0joU',
  updates: {
              enabled: true,
              get_interval: 1000
           }
});
//=========================

//=========================
var MongoClient = require('mongodb').MongoClient;
var dbname= "hapiensbotdb";
var dbcol = "hapiensbotcol"
var url = "mongodb://localhost:27017/";
MongoClient.connect(url+dbname, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(dbname);
  dbo.createCollection(dbcol, function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});


//=========================


var time;

app.use(express.static("public"));


app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/sendmsg", (req,res)=>{
  var msg = req.query.msginput;
  var file =  req.query.imagefile;
  msg=msg.split(" ").join("%20");
  console.log("path: ", file)
  time= req.query.usrtime;
  console.log("Time: ", time);
  //====================
  api.sendPhoto({
    chat_id: -395014684,
    caption: req.query.msginput, 
    
    photo: 'public/photo.jpg'
  })
  .then(function(data)
  {
    //console.log(util.inspect(data, false, null));
  });

//=====================

  var url = "https://api.telegram.org/bot1003269993:AAFwSTvZHhJruF6pvbZUK5hqP4k0fEg0joU/sendMessage?chat_id=-395014684&text=" + msg;
  request(url,(error,response,body)=>{
      var result = JSON.parse(body);     
      //if(result.result.message_id) res.send("Sucess!!!!");
      if(result.error_code) {   
      res.send(`Error: || ${result.error_code} || Description: ${result.error_description} `)
      }
      else { res.send("Sucess!!!!") }
  });
 
  
});


// listen for requests :)
const listener = app.listen(/*process.env.PORT*/3000, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
