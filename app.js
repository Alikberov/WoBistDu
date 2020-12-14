const	http	= require("http");
const	ipapi	= require("ipapi.co");

const	hosting	= "";
const	port	= process.env.PORT || 5000

const	flags	= "http://bootstraptema.ru/plugins/2016/flag-icon-css/4x3-2/";
const	yandex	= "https://yandex.ru/maps/?";
const	discord	= "https://discord.gg/Uh94jFQPtJ";
const	timeout	= "300";

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
	,"p	{"
	,"	text-align	:right"
	,"}"
	,"body	{"
	,"	background-color:silver;"
	,"	padding		:0 0 0 0;"
	,"	overflow	:auto;"
	,"}"
	,"</style>"
	,"</head>"
	,"<body>"
	,`<p><a target='_blank' href='${discord}'>&copy;2020</a></p>`
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
		users.unshift(`<a ${anchor}><img ${image} />${res.city}.${res.country}#${users.length + 1}</a>${msg}`);
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
		console.log(e);
		cb(tmp);
	}
};

const	server	= http.createServer(my_server);

server.listen(port, hosting, () => {
	console.log(`Server running at http://${hosting}:${port}/`);
	ipapi.location(console.log);
});
