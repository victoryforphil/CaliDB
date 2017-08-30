var CaliDB = require('./index.js');
var DLight = require('disnode-lite');

var bot = new DLight({key:""})
var DB = new CaliDB();
bot.Connect();
bot.on("ready", function(){
    console.log("Test Bot Ready!");

    setTimeout(function() {
        var count = 0;
        for(var guild in bot.guilds){
            count++;
            DB.Insert(guild, bot.guilds[guild])
        }
        console.log(count);
    }, 5000);
})
bot.on("message", function(msg){

    if(msg.content.includes("*dbtest")){
        var params = msg.content.split(" ");
        var id = params[1];
        DB.GetValue(id).then(data=>{

            bot.SendCompactEmbed(msg.channel_id, "Cali DB Message Chache Test", data.name);
        })
    }
    //DB.Insert(data.id, data);
   
})

