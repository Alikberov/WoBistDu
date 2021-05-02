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

function SaveUsers() {
	try {
		var	places	= [];
		console.log(`USERS SAVING...`);
		for(var id in users) {
			places.unshift(
				[
					`\t"${id}":{`,
					`\t\t"gps":"${users[id].gps}",`,
					`\t\t"msg":"${users[id].msg}",`,
					`\t\t"pos":"${users[id].pos}",`,
					`\t\t"city":"${users[id].city}",`,
					`\t\t"country":"${users[id].country}",`,
					`\t\t"visits":"${users[id].visits}",`,
					`\t\t"voyages":"${users[id].voyages}",`,
					`\t\t"date":"${users[id].date}"`,
					`\t}`
				].join("\r\n")
			);
		}
		hHotRef.child("places").set(places.join(",\r\n"));
	} catch(e) {
		console.log(e);
	}
}
function user_list() {
	var	places	= [];
	console.log(`USERS SHOW...`);
	for(var id in users) {
		places.unshift(
			[
				`\t"${id}":{`,
				`\t\t"gps":"${users[id].gps}",`,
				`\t\t"msg":"${users[id].msg}",`,
				`\t\t"pos":"${users[id].pos}",`,
				`\t\t"city":"${users[id].city}",`,
				`\t\t"country":"${users[id].country}",`,
				`\t\t"visits":"${users[id].visits}",`,
				`\t\t"voyages":"${users[id].voyages}",`,
				`\t\t"date":"${users[id].date}"`,
				`\t}`
			].join("\r\n")
		);
	}
	return places.join(",\r\n");
}

process.on('SIGTERM', signal => {
	try {
		SaveUsers();
	} catch(e) {
		console.log(`process.on-SIGTERM:`);
		console.log(e);
	}
  console.log(`process.on-SIGTERM: Process ${process.pid} received a SIGTERM signal`)
  process.exit(0)
})

process.on('exit', code => {
  // Only synchronous calls
  console.log(`process.on-exit: Process exited with code: ${code}`)
})
//////////////////////////////////////////////////////////////////////////////
process.on('SIGINT', signal => {
  console.log(`process.on-SIGINT: Process ${process.pid} has been interrupted`)
  process.exit(0)
})

process.on('beforeExit', code => {
  // Can make asynchronous calls
  console.log(`process.on-beforeExit: Process will exit with code: ${code}`)
  setTimeout(() => {
    console.log(`Process will exit with code: ${code}`)
    process.exit(code)
  }, 100)
})
//////////////////////////////////////////////////////////////////////////////
function Do_IP_Slabs() {
	var	cons	= "BCDFGHKMNPSTVYZ".split(""),
		vovels	= "A LA NA RA E LE NE RE I LI NI RI O LO NO RO U LU NU RU".split(" "),
		i, j, k, n, c,
		Slabs	= ["X"],
		masks =
		[0xFFFFF // BA	BLA	BNA	BRA	BE	BLE	BNE	BRE	BI	BLI	BNI	BRI	BO	BLO	BNO	BRO	BU	BLU	BNU	BRU
		,0x88888 // CA				CE				CI				CO				CU
		,0xFFFFF // DA	DLA	DNA	DRA	DE	DLE	DNE	DRE	DI	DLI	DNI	DRI	DO	DLO	DNO	DRO	DU	DLU	DNU	DRU
		,0xDDDDD // FA	FLA		FRA	FE	FLE		FRE	FI	FLI		FRI	FO	FLO		FRO	FU	FLU		FRU
		,0xFFFFF // GA	GLA	GNA	GRA	GE	GLE	GNE	GRE	GI	GLI	GNI	GRI	GO	GLO	GNO	GRO	GU	GLU	GNU	GRU
		,0xFFFFF // HA	HLA	HNA	HRA	HE	HLE	HNE	HRE	HI	HLI	HNI	HRI	HO	HLO	HNO	HRO	HU	HLU	HNU	HRU
		,0xFFFFF // KA	KLA	KNA	KRA	KE	KLE	KNE	KRE	KI	KLI	KNI	KRI	KO	KLO	KNO	KRO	KU	KLU	KNU	KRU
		,0xFFFFF // MA	MLA	MNA	MRA	ME	MLE	MNE	MRE	MI	MLI	MNI	MRI	MO	MLO	MNO	MRO	MU	MLU	MNU	MRU
		,0xDDDDD // NA	NLA		NRA	NE	NLE		NRE	NI	NLI		NRI	NO	NLO		NRO	NU	NLU		NRU
		,0xFFFFF // PA	PLA	PNA	PRA	PE	PLE	PNE	PRE	PI	PLI	PNI	PRI	PO	PLO	PNO	PRO	PU	PLU	PNU	PRU
		,0xFFFFF // SA	SLA	SNA	SRA	SE	SLE	SNE	SRE	SI	SLI	SNI	SRI	SO	SLO	SNO	SRO	SU	SLU	SNU	SRU
		,0xFFFFF // TA	TLA	TNA	TRA	TE	TLE	TNE	TRE	TI	TLI	TNI	TRI	TO	TLO	TNO	TRO	TU	TLU	TNU	TRU
		,0xFFFF0 // VA	VLA	VNA	VRA	VE	VLE	VNE	VRE	VI	VLI	VNI	VRI	VO	VLO	VNO	VRO
		,0x88088 // YA				YE								YO				YU
		,0xFFFFF];//ZA	ZLA	ZNA	ZRA	ZE	ZLE	ZNE	ZRE	ZI	ZLI	ZNI	ZRI	ZO	ZLO	ZNO	ZRO	ZU	ZLU	ZNU	ZRU
	for(i = 0, n = 1; i < masks.length; ++ i) {
		c = masks[i];
		for(j = 1 << 19, k = 0; j > 0; j >>= 1, ++ k) {
			if(c & j)
				Slabs[n] = cons[i] + vovels[k],
				Slabs[cons[i] + vovels[k]] = n,
				n ++;
		}
	}
	this.decode =
	function(index) {
		var	word	= "";
		do {
			word = Slabs[index & 255] + word;
		} while(index = (index >> 8) & 16777215);
		return word;
	};
	this.encode =
	function(word) {
		var	index	= 0;
		var	slab;
		do {
			slab = word.toUpperCase().match(/(X|[BCDFGHKMNPSTVYZ][LNR]?[AEIUO])/);
			if(slab && slab[0] in Slabs)
				index = (index << 8) + Slabs[slab[0]],
				word = word.substr(slab[0].length);
		} while(slab);
		return index;
	};
	return	this;
}
const	Slabs = Do_IP_Slabs();
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
const	ipInt				= requiry("ip-to-int");
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
function DoNick(req) {
	var	ipAddr	= req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
	if(ipAddr) 
		ipAddr	= ipAddr.split(",").pop();
	else
		ipAddr	= req.connection.remoteAddress;
	var	theIP	= ipAddr.split(/:+/).pop().split(".").join(".");
		theIP	= Slabs.decode(ipInt(theIP).toInt());
	return theIP;
}
//////////////////////////////////////////////////////////////////////////////
var	callback = function(res) {
	var	chat	= [];
/*	var	ipAddr	= this.req.ip || this.req.headers["x-forwarded-for"] || this.req.connection.remoteAddress;
	if(ipAddr) 
		ipAddr	= ipAddr.split(",").pop();
	else
		ipAddr	= this.req.connection.remoteAddress;
	var	theIP	= ipAddr.split(/:+/).pop().split(".").join(".");
		theIP	= Slabs.decode(ipInt(theIP).toInt());*/
	var	theIP	= DoNick(this.req);
	var	msg	= "";
	try {
		if(Config.enc)
			msg = eval(Config.enc).match(/\/\?_=([^#&]+)/);
		else
			msg = this.req.url.normal.match(/\/\?_=([^#&]+)/);
	} catch(e) {
		log(e);
	}
	var	gps	= unescape(this.req.url).match(/(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/);
//	var	gps	= this.req.url.match(/gps=([^&?]*)/);
	var	pos = [
			res.longitude,
			res.latitude
		].join();
	//
	if(!(theIP in users)) {
		users[theIP] = {
			gps	:"",
			msg	:"",
			pos	:"",
			city	:"",
			country	:"",
			visits	:0,
			voyages	:0,
			date	:new Date()
		};
		SaveUsers();
	}
	log(`${this.req.url} ${msg}`);
	if(msg && (!gps || (unescape(msg[1]) != gps[0]))) {
		users[theIP].msg = unescape(msg[1]).replace(/\+/g, " ");
	}
	users[theIP].visits ++;
	if(users[theIP].pos != pos)
		users[theIP].voyages ++,
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
				`href='${yandex}${args}'`,
				`title='${user.voyages}/${user.visits}'`
			].join(" ");
		var	image = [
				`src='${flags}${(user.country || "RU").toLowerCase()}.svg'`,
				`width='16'`,
				`height='12'`
			].join(" ");
		var	form = Config.form.replace(/\$\{msg\}/gm, msg);
		if(theIP == ip)
			chat.unshift(`<tr><td><a ${anchor}>${user.country}<img ${image} />${user.city}</a></td><td>#${chat.length + 1}</td><td>${form}</td></tr>`);
		else
			chat.unshift(`<tr><td><a ${anchor}>${user.country}<img ${image} />${user.city}</a></td><td>#${chat.length + 1}</td><td>${msg}</td></tr>`);
	}
	this.res.statusCode = 200;
	this.res.setHeader("Content-Type", "text/html; charset=utf-8");
	this.res.end(this.content.replace("{CHAT}", chat.join("\r\n")));
};
function try_callback(res) {
	var	cb;
	var	bnd =	{
				req	:this.req,
				res	:this.res,
				content	:this.content,
				chat	:this.chat
			};
	try {
		cb = Config.callback.bind(bnd);
		cb(res);
	} catch(e) {
		log(e);
		cb = callback.bind(bnd);
		cb(res);
	}
}
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
			code	:try_callback,
			specs	:{
				discord	:discord,
				timeout	:timeout
			}
		},
		"/users":{
			name	:user_list,
			content	:"",
			type	:"application/x-javascript; charset=utf-8",
			code	:null
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
	if(typeof files[id].name == "string") {
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
	enc	:"this.req.url",
	css	:"",
	html	:"",
	form	:[
		`<form action='https://wobistdu.herokuapp.com' data-method='post' data-enctype='multipart/form-data' accept-charset='utf-8'>`,
		"<input name='_' list='cookies' type='text' maxlength='64' size='64' value='${msg}' placeholder='Put Your replic at here und push [»»»] bitte' /><input type='submit' value='»»»' />",
		`<datalist id='cookies'>`,
		`<option value='Yesterday… All my troubles seemed so far away!' />`,
		`<option value='Love me tender, love me sweet, Never let me go…' />`,
		`<option value='Follow the Moskva,Down to Gorky Park,Listening to the wind of…' />`,
		`<option value='А я иду шагаю по…' />`,
		`<option value='Я в баре с блекджеком и … шашлыком!' />`,
		`<option value='Хорошо в краю родном, пахнет рыбой и пивком!' />`,
		`<option value='Бухгалтер, милый мой бухгалтер!' />`,
		`<option value='Каждую ночь ты сидишь у окна перемещая звёзды…' />`,
		`</datalist>`,
		`</form>`
			].join("\r\n"),
	guests	:{
	},
	callback:callback
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
	var	the_args = this.branch.split("__");
	var	the_func = the_args[0];
	var	the_argz = the_args.slice(1).join();
	if("image" == typeof old)
		info += `changed from Image(${old.width}x${old.height})`
	else
	if("string" == typeof old)
		info += `changed from "${old.substr(0,max)}${old.length > max ? "…" : ""}"`;
	else
	if("number" == typeof old)
		info += `changed from (${old})`;
	else
	if("function" == typeof old)
		info += `changed from Function`;
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
		} else
		if((the_func in this.config) && ("function" == typeof this.config[the_func])) {
			var	the_callback;
			var	the_args = this.branch.split("__");
			try {
				the_callback = new Function(the_argz, s);
				info += ` to Function is OK…`;
				log(`function ${the_func}(${the_argz}) { ... } is loaded…`);
				this.config[the_args[0]] = the_callback;
			} catch(e) {
				info += ` to Function is crashed…`;
				log(`function ${the_func}(${the_argz}) { ... } is crashed…`);
				log(e);
			}
		} else {
			//info += ` to "${s.substr(0,max)}${old.length > max ? "…" : ""}"`;
			info += ` to \n${s}\n….…`;
			var	pth	= "/" + (this.branch == "index" ? "" : this.branch);
			if(pth in files) {
				var	specs = files[pth];
				if(specs)
					for(var opt in specs)
						s = s.replace(new RegExp(`\\$\\{${opt}\\}`, "gm"), specs[opt]);
			}
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
hHotRef
	.child("places")
	.on("value",
		function(snap) {
			var	data = snap.val();
			console.log("PLACES READ");
			try {
				users = eval("({" + data + "})");
				console.log(users);
			} catch(e) {
				console.log(e);
			}
		}
	);

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
	//var	theIP	= DoNick(req);
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
		if((typeof file.name) == "function") {
			cloud = file.name();
		} else
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
//const	WebSocketServer	= wsocket && wsocket.server;

const	server	= http.createServer(my_server);
var ServerOnPort = server.listen(port, host, () => {
	log(`Listen ${host}:${port}`);
});

const { Server } = require('ws');
const wss = new Server({server: ServerOnPort });

/*server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');
	wss.handleUpgrade(req, socket, head, (sock) => handleDeviceConnection(new DeviceWebSocketWrapper(sock), req.headers));
  socket.pipe(socket); // echo back
});*/
server.on('upgrade', function (request, socket, head) {
	try {
		wss.handleUpgrade(request, socket, head, function (websocket) {
			wss.emit('connection', websocket, request);
		})
	} catch(e) {
		log(e);
	}
})

/* wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request, client);
    });*/
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
  ws.on('message', (msg) => {
    console.log(`»»»${msg}`);
  });
});
setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);

/*
const	ws		= requiry("ws");
if(ws) {
	var WebSocketServer = ws.Server
	  , wss = new WebSocketServer({ server: server });

	wss.on("connection", function connection(ws, req) {
		var	req_ip	= req.headers["x-forwarded-for"] ? req.headers["x-forwarded-for"].split(",").pop() : req.connection.remoteAddress;
		log(`User IP is ${req_ip}`);
		//console.log(ws);
	//  var location = url.parse(ws.upgradeReq.url, true);
	  // you might use location.query.access_token to authenticate or share sessions
	  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

		ws.on("message", function incoming(message) {
			console.log("received: %s", message);
		});
		ws.send("something");
	});
}
*/
