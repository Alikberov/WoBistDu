const	http	= require("http");
//const	https	= require("https");
const	ipapi	= require("ipapi.co");
const	hosting	= "";
const	port	= process.env.PORT || 5000

const	html =
	["<!doctype html>"
	,"<html itemscope='' itemtype='http://schema.org/SearchResultsPage' lang='ru'		  >"
	,"<head											  >"
	,"<meta content='text/html; charset=utf8'			http-equiv='Content-Type'	 />"
	,"<meta content='ru-RU'					http-equiv='Content-Language'	 />"
	,"<meta content='geolocation'						name='keywords'	 />"
	,"<meta content='Static'							name='googlebot' />"
	,"<meta content='NoIndex,NoArchive'					name='Robots'	 />"
	,"<meta content='https://github.com/Alikberov'				name='Author'	 />"
	,"<meta content='300'						http-equiv='refresh'	/>"
	,"<head><title>WoBistDu?</title>"
	,"<style>"
	,"p	{"
	,"	text-align	:right"
	,"}"
	,"</style>"
	,"</head>"
	,"<body>"
	,"<p><a target='_blank' href='https://discord.gg/Uh94jFQPtJ'>&copy;2020</a></p>"
	,"..."
	,"</body>"
	];

var	users	= [];
var	ips	= [];

var callback = function(res) {
	if(this.neo) {
		var	pos = [
				res.longitude,
				res.latitude
			].join();
		var	args = [
				"l=map",
				"pt=" + pos,
				"z=" + 16
			].join("&");
		var	msg = this.msg.replace(/[<>&]+/gm, " ").substr(0, 16);
		users.unshift("<a target='_blank' name='#" + (users.length + 1) + "' href='https://yandex.ru/maps/?" + args + "'><img src='http://bootstraptema.ru/plugins/2016/flag-icon-css/4x3-2/" + res.country.toLowerCase() + ".svg' width='16' height='12' />" + res.city + "." + res.country + "#" + (users.length + 1) + "</a>" + msg);
	}
	this.res.statusCode = 200;
	this.res.setHeader("Content-Type", "text/html; charset=utf-8");
	this.res.end(html.join("\r\n").replace("...", users.join("<br />")));
};

async function my_server(req, res) {
	////////////////////////////////////////////////////////
	var	cb;
	var	ipAddr	= req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
	if(ipAddr) 
		ipAddr	= ipAddr.split(",").pop();
	else
		ipAddr	= req.connection.remoteAddress;
	var	theIP	= ipAddr.split(/:+/).pop().split(".").join(".");
	var	msg	= req.url.match(/say=([^&?]*)/);
	if(ips.join().indexOf(theIP) < 0) {
		if(ips.length >= 100)
			ips.length = 99;
		ips.unshift(theIP);
		cb = callback.bind({res: res, neo: true, msg: (msg ? ":" + unescape(msg[1]) : "")});
	} else
		cb = callback.bind({res: res, neo: false, msg: ""});
	ipapi.location(cb, theIP);       // Complete location for your IP address
/*	var	requrl	= unescape(req.url.replace(/\+/g, " "));
	var	szTheme	= "";
	var	fail	= false;
	var	time	= datefmt(new Date(), Config.timefmt).shifted;
	//
	if(!fail) {
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.end("")
	} else {
		res.statusCode = 404;
		res.setHeader('Content-Type', 'image/png');
		res.end();
	}*/
};

const	server	= http.createServer(my_server);
//const	sserver	= https.createServer(my_server);

server.listen(port, hosting, () => {
	console.log(`Server running at http://${hosting}:${port}/`);
	ipapi.location(console.log);
});

/*sserver.listen(port, hosting, () => {
	console.log(`Server running at https://${hosting}:${port}/`);
	ipapi.location(console.log);
});*/
