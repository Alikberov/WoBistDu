var	logs	= [];
var	logst	= null;
const	log	= function(...args) {
	logs.push(args);
	if(logst)
		clearTimeout(logst);
	logst = setTimeout(
		function() {
			logs.forEach(
				function(args) {
					var	l = console.log;
					l(...args);
				}
			);
			logs = [];
		}, 1000);
	};
//////////////////////////////////////////////////////////////////////////////
const	host	= process.env.PORT ? "" : "127.0.0.1";
const	port	= process.env.PORT || 80;
//////////////////////////////////////////////////////////////////////////////
const	flags	= "https://raw.githubusercontent.com/lipis/flag-icon-css/master/flags/1x1/";	//"http://bootstraptema.ru/plugins/2016/flag-icon-css/4x3-2/";
const	yandex	= "https://yandex.ru/maps/?";
const	discord	= "https://discord.gg/Uh94jFQPtJ";
const	timeout	= "300";
//////////////////////////////////////////////////////////////////////////////
const	file_cs	= "index.css";				// Cascade Styles
const	file_ht	= "index.html";				// Hyper Text
const	file_js	= "index.js";				// Java Script
//////////////////////////////////////////////////////////////////////////////
var	eBits	= 0;
var	ePos	= 1;
var	eTimes	= 0;
//////////////////////////////////////////////////////////////////////////////
var	users	= [];
//////////////////////////////////////////////////////////////////////////////
const	callback = function(res) {
	var	chat	= [];
	var	ipAddr	= this.req.ip || this.req.headers["x-forwarded-for"] || this.req.connection.remoteAddress;
	if(ipAddr) 
		ipAddr	= ipAddr.split(",").pop();
	else
		ipAddr	= this.req.connection.remoteAddress;
	var	theIP	= ipAddr.split(/:+/).pop().split(".").join(".");
	var	msg	= (this.req.path || "").match(/(^\/(?:\?say=)?)([^\/][^&?]*)/).replace(/\+/g, " ");
	var	gps	= unescape(this.req.url).match(/(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/);
//	var	gps	= this.req.url.match(/gps=([^&?]*)/);
	var	pos = [
			res.longitude,
			res.latitude
		].join();
	//
	if(!(theIP in users))
		users[theIP] = {
			gps	:"",
			msg	:"",
			pos	:"",
			city	:"",
			country	:""
		};
	if(msg && (!gps || (unescape(msg[2]) != gps[0]))) {
		users[theIP].msg = unescape(msg[2]);
	}
	if(users[theIP].pos != pos)
		users[theIP].gps = pos,
		users[theIP].pos = pos;
	if(gps) {
		log('gps'+gps[1] +  '/'+gps[2] + '-' + gps);
		users[theIP].gps = ([gps[1], gps[2]].join());
	}
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
				`src='${flags}${(user.country || "RU").toLowerCase()}.svg'`,
				`width='16'`,
				`height='12'`
			].join(" ");
		chat.unshift(`<tr><td><a ${anchor}><img ${image} />${user.city}.${user.country}#${chat.length + 1}</a></td><td>${user.msg}</td></tr>`);
	}
	this.res.statusCode = 200;
	this.res.setHeader("Content-Type", "text/html; charset=utf-8");
	this.res.end(this.content.replace("{CHAT}", chat.join("<br />\r\n")));
};
//////////////////////////////////////////////////////////////////////////////
var	files	= {
		"/css"	:{				// Cascade Styles
			name	:"index.css",
			content	:"",
			type	:"text/css; charset=utf-8",
			code	:null
		},
		"/js"	:{
			name	:"index.js",		// Java Script
			content	:"",
			type	:"application/x-javascript; charset=utf-8",
			code	:null
		},
		"/ico"	:{
			name	:"index.png",		// Favorite Icon
			content	:"",
			type	:"image/png",
			code	:"Base64"
		},
		"/"	:{				// Hyper Text
			name	:"index.html",
			content	:"",
			type	:"text/html; charset=utf-8",
			code	:callback,
			specs	:{
				discord	:discord,
				timeout	:timeout
			}
		}
		,oi:{name:"iyu", content:""}
	};
var	file_rq	= [];
//////////////////////////////////////////////////////////////////////////////
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
log(`Loading different modules and files...`);
//////////////////////////////////////////////////////////////////////////////
const	fs	= requiry("fs");
const	path	= requiry("path");
//////////////////////////////////////////////////////////////////////////////
for(id in files) {
	var	p = path.join(__dirname, files[id].name);
	var	rc = read_content.bind({path: id, file: files[id]});
	//
	function read_content(err, data){
		if(err)
			log(`${err}`);
		else {
			log(`file ${this.path}:"${this.file.name}" - ${data.length} bytes`);
			var	specs = this.file.specs;
			if(specs)
				for(var opt in specs)
					data = data.replace(new RegExp(`\\$\\{${opt}\\}`, "gm"), specs[opt]);
			this.file.content = data;
		}
	}
	//
	if(typeof files[id].code == "string")
		fs.readFile(p, rc);
	else
		fs.readFile(p, {encoding: "utf-8"}, rc);
	file_rq.push(`(${id.replace(/(\/|\\|\.)/g, "\\$1")})`);
}
log(`Matches: ${file_rq.join("|")}`);
file_rq = new RegExp(`(${file_rq.join("|")})`);

async function my_server(req, res) {
	////////////////////////////////////////////////////////
	var	cb;
	var	ipAddr	= req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
	if(ipAddr) 
		ipAddr	= ipAddr.split(",").pop();
	else
		ipAddr	= req.connection.remoteAddress;
	var	theIP	= ipAddr.split(/:+/).pop().split(".").join(".");
	var	theFile	= req.url.match(file_rq);
	//
	log(req);
	var	file	= files[theFile[1]];
	//
	if(!theFile && !file)
		file = files["/"];
	//
	if(typeof file.code == "function") {
		//
		res.statusCode = 200;
		res.setHeader("Content-Type", `${file.type}`);
		cb = file.code.bind(
			{
				req	:req,
				res	:res,
				content	:file.content
			}
		);
		try {
			ipapi.location(cb, theIP);
		} catch(e) {
			log(e);
			ipapi.location(cb);
		}
	} else
	if(file.code) {
		res.writeHead(200, {'Content-Type': 'image/png'});
		res.end(file.content, file.code);
	} else {
		res.statusCode = 200;
		res.setHeader("Content-Type", `${file.type}`);
		res.end(file.content);
	}
};

const	http	= requiry("http");
const	ipapi	= requiry("ipapi.co");
const	wsocket	= requiry("websocket");
const	WebSocketServer	= wsocket && wsocket.server;

const	server	= http.createServer(my_server);

server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Han */dshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

server.listen(port, host, () => {
	log(`Listen ${host}:${port}`);
});
