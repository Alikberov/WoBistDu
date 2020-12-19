var	hInterval, msg;

function geoFindMe() {
	const status = document.querySelector("#status");
	const mapLink = document.querySelector("#map-link");
	const	tracker = document.getElementById("Tracker");
	var	link;
	mapLink.href = "";
	mapLink.textContent = "";
	function success(position) {
		const latitude  = position.coords.latitude;
		const longitude = position.coords.longitude;
		status.textContent = "";
		mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
		mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
		link = `https://wobistdu.herokuapp.com/${longitude}%2C${latitude}`;
		if(tracker.src != link)
			tracker.src = link;
	}
	function error() {
		status.textContent = "Unable to retrieve your location";
		clearInterval(hInterval)
	}
	if(!navigator.geolocation) {
		status.textContent = "Geolocation is not supported by your browser";
	} else {
		status.textContent = "Locating…";
		navigator.geolocation.getCurrentPosition(success, error);
	}
}
hInterval = setInterval(geoFindMe, 60000)
function init() {
	var	videos	= [];
	var	hFrame	= document.getElementById("Videos");
	var	i, src;
	for(i = 1; src = hFrame.getAttribute(`data-src${i}`); ++ i)
		videos.push(src);
	var	index	= Math.floor(Math.random() * i);
	if(index > 0)
		hFrame.src = "https://www.youtube.com/embed/" + videos[index - 1];
	//
	if(window.location.protocol == "http:"
	|| window.location.pathname != "/"
	|| window.location.search.length > 1)
		window.location.href = "https:" + "//" + window.location.hostname;
}
