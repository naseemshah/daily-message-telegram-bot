// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();
const request = require('request');

var timeM;
var timeH;

app.use(express.static("public"));


app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/sendmsg", (req,res)=>{
  var msg = req.query.msginput;
  msg=msg.split(" ").join("%20");
  
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
