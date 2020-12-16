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
	,"iframe	{"
	,"	position	:absolute;"
	,"	left		:0;"
	,"	top		:0;"
	,"	width		:1px;"
	,"	height		:1px;"
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
	,"<iframe id='Tracker' src='' width='1px' height='1px'></iframe>"
	,"<noscript></noscript>"
	,"<script>"
	,'var	hInterval, msg;'
	,''
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
	,'		document.getElementById("Tracker").src = `http://wobistdu.herokuapp.com/gps=${latitude}%2C${longitude}`;'
	,'		if(ws && (ws.readyState == ws.OPEN)) {'
	,'			ws.send(`Latitude ${latitude}`);'
	,'			ws.send(`Longitude ${longitude}`);'
	,'			ws.send(`Say ${(new Date()).toLocaleString()}|${msg}`);'
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
	,"</script>"
	,"</body>"
	];

const	callback = function(res) {
	var	chat	= [];
	var	ipAddr	= this.req.ip || this.req.headers["x-forwarded-for"] || this.req.connection.remoteAddress;
	if(ipAddr) 
		ipAddr	= ipAddr.split(",").pop();
	else
		ipAddr	= this.req.connection.remoteAddress;
	var	theIP	= ipAddr.split(/:+/).pop().split(".").join(".");
	var	msg	= this.req.url.match(/say=([^&?]*)/);
	var	gps	= this.req.url.match(/gps=([^&?]*)/);
	var	pos = [
			res.longitude,
			res.latitude
		].join();
	//
	if(!(theIP in user))
		users[theIP] = {
			gps	:"",
			msg	:"",
			pos	:"",
			city	:"",
			country	:""
		};
	if(msg)
		users[theIP].msg = unescape(msg[0]);
	if(users[theIP].pos != pos)
		users[theIP].gps = pos,
		users[theIP].pos = pos;
	if(gps)
		users[theIP].gps = unescape(gps[0]);
	if(users[theIP].city != res.city)
		users[theIP].city = res.city;
	if(users[theIP].country != res.country)
		users[theIP].country = res.country;
	//
	for(var ip in users) {
		var	user = users[ip];
		var	args = [
				`l=map`,
				`pt=${user.gps}`,
				`z=${16}`
			].join("&");
		var	msg = user.msg.replace(/[<>&]+/gm, " ").substr(0, 64);
		var	anchor = [
				`target='_blank'`,
				`name='${chat.length + 1}'`,
				`href='${yandex}${args}'`
			].join(" ");
		var	image = [
				`src='${flags}${user.country.toLowerCase()}.svg'`,
				`width='16'`,
				`height='12'`
			].join(" ");
		chat.unshift(`<tr><td><a ${anchor}><img ${image} />${user.city}.${user.country}#${chat.length + 1}</a></td><td>${user.msg}</td></tr>`);
	}
	this.res.statusCode = 200;
	this.res.setHeader("Content-Type", "text/html; charset=utf-8");
	this.res.end(html.join("\r\n").replace("...", chat.join("<br />\r\n")));
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
	cb = callback.bind(
		{
			req	:req,
			res	:res
		}
	);
	try {
		ipapi.location(cb, theIP);
	} catch(e) {
		log(e);
		ipapi.location(cb);
	}
};

const	http	= requiry("http");
const	ipapi	= requiry("ipapi.co");
//const	socket	= requiry("socket.io");
const	wsocket	= requiry("websocket");
const	WebSocketServer	= wsocket && wsocket.server;

const	server	= http.createServer(my_server);
//const	io	= socket && socket(server);

server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

server.listen(port, host, () => {

  // make a request
  const options = {
    port: port,
    host: host,
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
      "Sec-WebSocket-Accept": "ZjY5ODliNTViYzJlOTNkMjk4OTg3Y2U2NjQ3MTBlZjZiNzliYzk4Yg=="
    }
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
//    socket.end();
//    process.exit(0);
  });
});
/*
server && server.listen(port, host, () => {
	log(`Server running at http://${host}:${port}/`);
	ipapi.location(console.log);
}) || log(`FAIL: server.listen`);
*/

const	wss	= WebSocketServer && (new WebSocketServer(
		{
			httpServer		:server,
			autoAcceptConnection	:false
		})
	);

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wss && wss.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

/*wss && wss.on("connection", function connection(tws, req) {
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
*/
