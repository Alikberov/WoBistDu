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
const	replics	=
	["Saluto!"
	,"Gutten Morgen!"
	,"Good Morning!"
	,"Доброе Утро!"
	,"Wo Bist Du?"
	,"Where Are You?"
	,"Где Же Ты?"
	,"Ich Spaziere…"
	,"I Walk…"
	,"Гуляю…"
	];
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
var	{iconv, String}			= requiry("./stringex");
//////////////////////////////////////////////////////////////////////////////
/*Object.defineProperty(
	String.prototype, "win1251", {
		get: function () {
			var b=Buffer.from(this, "ascii");
			console.log(util.inspect(b, false, null, true / * enable colors * /));
			return	iconv.decode(Buffer.from(this, "binary"), "utf8").toString();
		}
	}
);*/
//////////////////////////////////////////////////////////////////////////////
const	callback = function(res) {
	var	chat	= [];
	var	ipAddr	= this.req.ip || this.req.headers["x-forwarded-for"] || this.req.connection.remoteAddress;
	if(ipAddr) 
		ipAddr	= ipAddr.split(",").pop();
	else
		ipAddr	= this.req.connection.remoteAddress;
	var	theIP	= ipAddr.split(/:+/).pop().split(".").join(".");
	var	msg	= (this.req.url.win1251).match(/\/\?_=([^#&]+)/);
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
	log(`${this.req.url} ${msg}`);
	if(msg && (!gps || (unescape(msg[1]) != gps[0]))) {
		users[theIP].msg = unescape(msg[1]).replace(/\+/g, " ");
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
		var	msg = user.msg || replics[Math.floor(Math.random() * replics.length)];
			msg = msg.replace(/[<>&]+/gm, " ").substr(0, 64);
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
		var	form = [
				`<form action='https://wobistdu.herokuapp.com' method='post' enctype='multipart/form-data' accept-charset='utf-8'>`,
				`<input name='_' type='text' maxlength='64' size='64' value='${msg}' />`,
				`<input type='submit' value='»»»'>`,
				`</form>`
			].join(" ");
		if(theIP == ip)
			chat.unshift(`<tr><td><a ${anchor}>${user.country}<img ${image} />${user.city}</a></td><td>#${chat.length + 1}</td><td>${form}</td></tr>`);
		else
			chat.unshift(`<tr><td><a ${anchor}>${user.country}<img ${image} />${user.city}</a></td><td>#${chat.length + 1}</td><td>${msg}</td></tr>`);
	}
	this.res.statusCode = 200;
	this.res.setHeader("Content-Type", "text/html; charset=utf-8");
	this.res.end(this.content.replace("{CHAT}", chat.join("\r\n")));
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
////////////////////////////////////////////////////////////////
const	firebase			= require("firebase");

// Initialize Firebase
var config = {
	apiKey			:"AIzaSyAwCLigT_bKFepWjj9cSfFxKB3ZO_XVEUs",
	authDomain		:"wo-bist-du-7.firebaseapp.com",
	databaseURL		:"https://wo-bist-du-7-default-rtdb.firebaseio.com",
	projectId		:"wo-bist-du-7",
	storageBucket		:"wo-bist-du-7.appspot.com",
	messagingSenderId	:"1023209527071",
	appId			:"1:1023209527071:web:794a9981528d323eb3c22a",
	measurementId		:"G-MR35KXSLKZ"
};
//
var	app = firebase.initializeApp(config);
//
/*var	db = firebase.firestore();
// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

db.collection("users").get().then((querySnapshot) => {
	log(`firestore::users`);
    querySnapshot.forEach((doc) => {
	    log(`firestore::users::`);
        console.log(`${doc.id} => ${util.inspect(doc.data(), false, null, true)}`);
    });
});
//
var ref = firebase.app().database().ref("/");
var users = ref;//.child("/");
//
users.once("value")
.then(
	function(snap) {
		log(`firebase.once::`);
		var	s = snap.val();
		//console.log('snap.val()', s);
		//log(util.inspect(s, {showHidden:false,depth:7,compact:false}, 7, true));
	}
);
users.on("value",
	function(snap) {
		log(`firebase.on::`);
		var	s = snap.val();
		//console.log('snap.val()', s);
		//log(util.inspect(s, {showHidden:false,depth:7,compact:false}, 7, true));
	}
);*/
var hHotRef = firebase.app().database().ref("/");
//////////////////////////////////////////////////////////////////////////////
var	Config	=
{
	js	:"",
	css	:"",
	html	:"",
	guests	:{
	}
};
//////////////////////////////////////////////////////////////////////////////
function HotConfig_Image(image, err) {
	var	info	= `DataBase::«${this.path}${this.branch}» is `;
	if(image != null) {
		info += `Image(${image.width}x${image.height}) - `;
		try {
			hCtx.drawImage(image, 0, 0, 99, 99, 0, 0, 99, 99);
			this.config[this.branch] = image;
			info += `ready`
		} catch(e) {
			info += `${e}`;
		}
	} else
		info += `${err}`;
	log(`${info}…`);
}

function HotConfig_Set(snap) {
	const	max = 24;
	var	s = snap.val();
	var	old = this.config[this.branch];
	var	info	= `DataBase::«${this.path}${this.branch}» is `;
	info += `changed from `;
	if("image" == typeof old)
		info += `changed from Image(${old.width}x${old.height})`
	else
	if("string" == typeof old)
		info += `changed from "${old.substr(0,max)}${old.length > max ? "…" : ""}"`;
	else
	if("number" == typeof old)
		info += `changed from (${old})`;
	else
	if(null == old && s == null)
		info += `steel «${old}»`;
	else
		info += `«${old}»`;
	if("string" == typeof s) {
		if(!s.indexOf("data:image/")) {
			info += ` to Image${s.split(",")[0].substr(10)}`;
			loadImage(s).then(
				HotConfig_Image
				.bind(
					{
						config	:this.config,
						branch	:this.branch,
						path	:this.path
					}
				)
			);
		} else {
			//info += ` to "${s.substr(0,max)}${old.length > max ? "…" : ""}"`;
			info += ` to \n${s}\n….…`;
			this.config[this.branch] = s;
		}
	} else
	if("number" == typeof s) {
		info += ` to (${s})`;
		this.config[this.branch] = s;
	} else
	if(null != old)
		info += ` to ${typeof s} - ${s}`;
	log(`${info}…`);
}
function HotConfig_Init(map, callback, ref, path) {
	for(var id in map) {
		if("object" != typeof map[id]) {
			log(`${path}${id} binding…`);
			ref.child(id)
			.on("value",
				callback
				.bind(
					{
						config	:map,
						branch	:id,
						path	:path
					}
				)
			);
		} else {
			HotConfig_Init(map[id], callback, ref.child(id), path + id + "/");
		}
	}
}
HotConfig_Init(Config, HotConfig_Set, hHotRef, "/");

////////////////////////////////////////////////////////////////
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
	//log(req);
	var	file	= files[theFile[1]];
	var	fileId	= theFile[1].substr(1);
	var	cfgId	= fileId == "" ? "html" : fileId;
	var	cloud	= "";
	//
	// log(Config);
	if(!theFile && !file) {
		file = files["/"];
		if(Config.html != "") {
			log(`Config.html`);
			cloud = Config.html;
		} else {
			log(`file.content`);
			cloud = file.content;
		}
	} else {
		log(`Config.${cfgId}`);
		if((cfgId in Config) && (Config[cfgId] != "")) {
			cloud = Config[cfgId];
		} else {
			log(`file.content`);
			cloud = file.content;
		}
	}
	//
	if(typeof file.code == "function") {
		//
		res.statusCode = 200;
		res.setHeader("Content-Type", `${file.type}`);
		cb = file.code.bind(
			{
				req	:req,
				res	:res,
				content	:cloud,
				chat	:Config.guests
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
		res.end(cloud, file.code);
	} else {
		res.statusCode = 200;
		res.setHeader("Content-Type", `${file.type}`);
		res.end(cloud);
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
