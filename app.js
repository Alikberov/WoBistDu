const	log	= console.log;
//////////////////////////////////////////////////////////////////////////////
const	host	= process.env.PORT ? "" : "127.0.0.1";
const	port	= process.env.PORT || 80;
//////////////////////////////////////////////////////////////////////////////
const	flags	= "https://raw.githubusercontent.com/lipis/flag-icon-css/master/flags/1x1/";	//"http://bootstraptema.ru/plugins/2016/flag-icon-css/4x3-2/";
const	yandex	= "https://yandex.ru/maps/?";
const	discord	= "https://discord.gg/Uh94jFQPtJ";
const	timeout	= "300";
//////////////////////////////////////////////////////////////////////////////
var	eBits	= 0;
var	ePos	= 1;
var	eTimes	= 0;
//////////////////////////////////////////////////////////////////////////////
var	users	= [];
var	ips	= [];
//////////////////////////////////////////////////////////////////////////////

log(`Loading different modules...`);

function requiry(name) {
	try {
		var	imports	= require(name);
		log(`module "${name}" is loaded...`);
		ePos	<<= 1;
		return	imports;
	} catch(e) {
		var	error	= `module "${name}" not found!!!`;
		log(error);
		eBits	|= ePos;
		ePos	<<= 1;
		eTimes	++;
		return	false;
	}
}
//////////////////////////////////////////////////////////////////////////////

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
	,`<meta content='${timeout}'						http-equiv='refresh'	/>`
	,"<head><title>WoBistDu?</title>"
	,"<style>"
	,"p#pos"
	,"	position	:absolute;"
	,"	left		:0;"
	,"	top		:0;"
	,"}"
	,"p#copy	{"
	,"	text-align	:right;"
	,"}"
	,"body	{"
	,"	background-color:silver;"
	,"	padding		:0 0 0 0;"
	,"	overflow	:auto;"
	,"}"
	,"</style>"
	,"</head>"
	,"<body>"
	,"<p id='pos'><a id='map-link' target='_blank'>...</a><span id='status'>...</span>"
	,"<input type='text' onchange='msg = this.value' /></p>"
	,"<p id='copy'><a target='_blank' href='${discord}'>&copy;2020</a></p>"
	,"<table id='Chat'>"
	,"..."
	,"</table>"
	,"<noscript></noscript>"
	,"<script>"
	,'var	hInterval, msg;'
	,'ws = new WebSocket(`ws:\/\/${window.location.hostname}:80`);'
	,'ws.onopen = function() {'
	,'	ws.send("Say Hello!");'
	,'};'
	,'ws.onmessage = function(message) {'
	,'	console.log(`type:${message.type} data:${message.data}`)'
	,'	'
	,'}'
	,'function geoFindMe() {'
	,'	const status = document.querySelector("#status");'
	,'	const mapLink = document.querySelector("#map-link");'
	,'	mapLink.href = "";'
	,'	mapLink.textContent = "";'
	,'	function success(position) {'
	,'		const latitude  = position.coords.latitude;'
	,'		const longitude = position.coords.longitude;'
	,'		status.textContent = "";'
	,'		mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;'
	,'		mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;'
	,'		if(ws) {'
	,'			ws.send(`Latitude ${latitude}`'
	,'			ws.send(`Longitude ${longitude}`'
	,'			ws.send(`Say ${(new Date()).toLocaleString()}|${msg}`)'
	,'		}'
	,'	}'
	,'	function error() {'
	,'		status.textContent = "Unable to retrieve your location";'
	,'		clearInterval(hInterval)'
	,'	}'
	,'	if(!navigator.geolocation) {'
	,'		status.textContent = "Geolocation is not supported by your browser";'
	,'	} else {'
	,'		status.textContent = "Locating…";'
	,'		navigator.geolocation.getCurrentPosition(success, error);'
	,'	}'
	,'}'
	,'hInterval = setInterval(geoFindMe, 10000)'
</script>
	,`</script>`
	,"</body>"
	];

const	callback = function(res) {
	if(this.neo) {
		var	pos = [
				res.longitude,
				res.latitude
			].join();
		var	args = [
				`l=map`,
				`pt=${pos}`,
				`z=${16}`
			].join("&");
		var	msg = this.msg.replace(/[<>&]+/gm, " ").substr(0, 64);
		var	anchor = [
				`target='_blank'`,
				`name='${users.length + 1}'`,
				`href='${yandex}${args}'`
			].join(" ");
		var	image = [
				`src='${flags}${res.country.toLowerCase()}.svg'`,
				`width='16'`,
				`height='12'`
			].join(" ");
		users.unshift(`<tr><td><a ${anchor}><img ${image} />${res.city}.${res.country}#${users.length + 1}</a></td><td>${msg}</td></tr>`);
	}
	this.res.statusCode = 200;
	this.res.setHeader("Content-Type", "text/html; charset=utf-8");
	this.res.end(html.join("\r\n").replace("...", users.join("<br />\r\n")));
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
		if(ips.length >= 10)
			ips.length = 9;
		ips.unshift(theIP);
		cb = callback.bind({res: res, neo: true, msg: (msg ? ":" + unescape(msg[1]) : "")});
	} else
		cb = callback.bind({res: res, neo: false, msg: ""});
	try {
		ipapi.location(cb, theIP);
	} catch(e) {
		var	tmp = {
			longitude	:0.0,
			latitude	:0.0,
			country		:"RU",
			city		:"Tembria"
		};
		log(e);
		cb(tmp);
	}
};

const	http	= requiry("http");
const	ipapi	= requiry("ipapi.co");
//const	socket	= requiry("socket.io");
const	ws	= requiry("ws");

const	server	= http.createServer(my_server);
//const	io	= socket && socket(server);
const	wss	= ws && ws.new WebSocketServer({ server: server });

server && server.listen(port, host, () => {
	log(`Server running at http://${host}:${port}/`);
	ipapi.location(console.log);
}) || log(`FAIL: server.listen`);

wss && wss.on("connection", function connection(tws, req) {
	var	req_ip	= req.headers["x-forwarded-for"] ? req.headers["x-forwarded-for"].split(",").pop() : req.connection.remoteAddress;
	log(`User IP is ${req_ip}`);
	//console.log(ws);
//  var location = url.parse(ws.upgradeReq.url, true);
  // you might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
 
	tws.on("message", function incoming(message) {
		log("received: %s", message);
	});
	tws.send("something");
}) || log(`FAIL: WebSocketServer`);
