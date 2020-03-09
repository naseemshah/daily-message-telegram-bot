// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();
const request = require('request');
var telegram = require('telegram-bot-api');
//==========================================
var fs = require('fs');
//==========================================

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (res,file,cb)=>{
    cb(null, './public/uploads/')

  },
  filename: (res,file,cb)=>{
    cb(null, Date.now() + "-" + file.originalname)

  }
});
const upload = multer({storage : storage});
//==============================
//=======================
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
//===============================

//========================
// var api = new telegram({
//   token: '1003269993:AAFwSTvZHhJruF6pvbZUK5hqP4k0fEg0joU',
//   updates: {
//               enabled: true,
//               get_interval: 1000
//           }
// });
//=========================

//=========================
var mongodb = require('mongodb');
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





function insert(msg,img,time){
  MongoClient.connect(url, function(err, db) {
    if (err) console.log(err);
    var dbo = db.db(dbname);
    dbo.collection("hapiensbotcol").insertOne({msg: msg, photo: img, time: time },(err2,res2)=>{
    if(err2) console.log("Column Adding error! \n Error: ");
    else console.log("1 document inserted");
    db.close();
  });
});
}


//=========================


// var time;

app.use(express.static("public"));


app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});


app.get("/addentry",(req,res,err)=>{
  insert();
  res.redirect('/');
})

app.get("/show",(req,res,err)=>{
  MongoClient.connect(url, function(err1, db) {
    if (err1) console.log("Error! \n ",err1);
    var dbo = db.db(dbname);
    dbo.collection("hapiensbotcol").find({}).toArray((error,result)=>{
      if(error) console.log("Retreiving error! \n ");
      res.send(result);
      db.close();
    });
});
  
});

app.get("/dltall",(req,res,err)=>{
  MongoClient.connect(url,(err,db)=>{
    if(err) console.log("Error Connceting!");
    var dbo = db.db(dbname);
    dbo.collection("hapiensbotcol").deleteMany({},(err2,obj)=>{
      if(err2) console.log("Error Removing Error: ",err2);
      res.send(obj.result);
      db.close();
    });

  });
});

app.get("/dlt/:id",(req,res,err)=>{
  var path;
  MongoClient.connect(url,(err,db)=>{
    if(err) console.log("Error Connceting!");
    var dbo = db.db(dbname);
    var query =""+ req.params.id;
    console.log("Deleted "+query);
    dbo.collection("hapiensbotcol").find({ "_id" : new mongodb.ObjectID(query)}).toArray(function(err3, result) {
      if (err3) console.log(err3);
      path = "public/"+result[0].photo;
      console.log("to delete: ", path);
      db.close();
    });
    dbo.collection("hapiensbotcol").deleteOne({ "_id" : new mongodb.ObjectID(query)},(err2,obj)=>{
      if(err2) res.send("Error Removing Error: " + err2);
      else {
      res.send(obj.result);
  
      
      fs.unlink(path, function (err) {
        if (err) console.log(err);
        else console.log('File deleted!');
        }); 
      
      }
      


      db.close();
    });
    
  });
});



app.post("/sndmsg", upload.single('imgfile'), (req,res,err)=>{
  var msg = req.body.msginput;
  var fileInfo =  req.file;
  var msgurl=msg.split(" ").join("%20");
  time= req.body.usrtime;
  console.log("message:",msg);
  console.log("Time: ", time);
  console.log("File:", fileInfo);
  insert(msg,fileInfo.path.split("public\\").join("").split("\\").join("/").split(" ").join("%20"),time);
  
  
  // api.sendPhoto({
  //   chat_id: -395014684,
  //   caption: msg,    
  //   photo: fileInfo.path
  // })
  // .then(function(data)
  // {
  //   //console.log(util.inspect(data, false, null));
  // });



  // var url = "https://api.telegram.org/bot1003269993:AAFwSTvZHhJruF6pvbZUK5hqP4k0fEg0joU/sendMessage?chat_id=-395014684&text=" + msgurl;
  // request(url,(error,response,body)=>{
  //     var result = JSON.parse(body);     
  //     //if(result.result.message_id) res.send("Sucess!!!!");
  //     if(result.error_code) {   
  //     res.send(`Error: || ${result.error_code} || Description: ${result.error_description} `)
  //     }
  //     else { res.send("Sucess!!!!") }
  // });
  
  res.redirect('/');
  
});


// listen for requests :)
const listener = app.listen(/*process.env.PORT*/3000, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
