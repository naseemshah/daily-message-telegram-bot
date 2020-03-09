var tempArray;
var telegram = require('telegram-bot-api');
var api = new telegram({
    token: '1003269993:AAFwSTvZHhJruF6pvbZUK5hqP4k0fEg0joU',
    updates: {
                enabled: false,
                get_interval: 1000
            }
});
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var dbname= "hapiensbotdb";
var dbcol = "hapiensbotcol"
var url = "mongodb://localhost:27017/";
MongoClient.connect(url+dbname, function(err, db) {
    if (err) console.log("Error Encountered! \n",err);
    else console.log("Database Connected!");
    db.close();
});


function sendmsg(){
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    // var time = "08:00"
    console.log("Time Now:\t",time);
    
    
    
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("hapiensbotdb");
        dbo.collection("hapiensbotcol").find({time: time}).toArray(function(err, result) {
        if (err) console.log("Error: \n ",err);
        tempArray=result;

        
        
        if(tempArray.length) {

        tempArray.forEach( element => {
            api.sendPhoto({
                chat_id: -395014684,
                caption: element.msg,    
                photo: "public/"+ element.photo
            }, function (err, msg) {
                console.log(err);
                console.log(msg);
                if(!err) console.log("Message is sent.\t", element);
            });

            
            
                    
        });

        
        }
        db.close();
        });
    });
}

sendmsg();
setInterval(()=>sendmsg(), 60*1000);