const	http	= require("http");
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
	,"<head><title>WoBistDu?</title>"
	,"</head>"
	,"<body>"
	,"..."
	,"</body>"
	];

var	users	= [];

var callback = function(res) {
	console.log("--user-");
	console.log("--end--");
	users.unshift("<a href='https://yandex.ru/maps/?z=12&l=map&ll=" + [res.longitude, res.latitude].join() + "'>" + (users.length + 1) + "</a>");
	console.log(html.join("\r\n").replace("...", users.join("<br />")));
	this.res.statusCode = 200;
	this.res.setHeader("Content-Type", "text/html; charset=utf-8");
	this.res.end(html.join("\r\n").replace("...", users.join("<br />")));
};

async function my_server(req, res) {
	////////////////////////////////////////////////////////
	var	cb = callback.bind({res: res});
	ipapi.location(cb);       // Complete location for your IP address
/*	var	requrl	= unescape(req.url.replace(/\+/g, " "));
	var	szTheme	= "";
	var	ipAddr	= req.headers["x-forwarded-for"];
	if(ipAddr) 
		ipAddr	= ipAddr.split(",").pop();
	else
		ipAddr	= req.connection.remoteAddress;
	var	theIP	= ipAddr.split(/:+/).pop().split(".").join(".");
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

const server = http.createServer(my_server);

server.listen(port, hosting, () => {
	console.log(`Server running at http://${hosting}:${port}/`);
	ipapi.location(console.log);
});
