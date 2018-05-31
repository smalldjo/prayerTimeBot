const Eris = require("eris");
const request  = require("request")
var querystring = require('querystring');
var dateTime = require('node-datetime');

var tokens = require("./tokens.js");



// Replace BOT_TOKEN with your bot account's token
var bot = new Eris.CommandClient(tokens.discord_token, {}, {
    description: "A test bot made with Eris",
    owner: "somebody",
    prefix: "!"
});


bot.on("ready", () => {
    console.log("Ready!");
});

var echoCommand = bot.registerCommand("getMaghrib", (msg, args) => { 
    if(args.length<2) { // If the user just typed "!echo", say "Invalid input"
        return "Invalid input";
	}
    var date = dateTime.create();
    get_maghrib_time_response(msg.channel,args[0],args[1],date.format("m"),date.format("Y"));
    return;
}, {
    description: "get today's Maghrib time for a speific city&country",
    fullDescription: "get today's Maghrib time for a speific city&country",
    usage: "!getMaghrib city country"
});



bot.connect();

function get_maghrib_time_response(channel,city,country,month,year)
{
var return_date = "";
var data ={
	city:city,
	country:country,
	method:3,
	month:month,
	year:year
	};

const url = "http://api.aladhan.com/v1/calendarByCity?"+querystring.stringify(data);

console.log(url);

request.get(url,(error,response,body)=>{
  //console.log(response);
  if(error)
  {
    bot.createMessage(channel.id,error);
    return;
  } 
  let json = JSON.parse(body);
  var dt = dateTime.create();
  var formatted_date = dt.format('d-m-Y');
  for(var i in json.data)
  {
    let day= json.data[i];
    if (day.date.gregorian.date == formatted_date)
    {
	return_date= day.timings.Maghrib;
	//console.log("return_date when found:" + return_date); 	
	bot.createMessage(channel.id,"Maghrib in "+city+" is at: "+return_date);
        return;
    }
  }
  bot.createMessage(channel.id,"date not found"); 
	
})

}
