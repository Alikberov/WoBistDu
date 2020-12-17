var	hInterval, msg;

function geoFindMe() {
	const status = document.querySelector("#status");
	const mapLink = document.querySelector("#map-link");
	mapLink.href = "";
	mapLink.textContent = "";
	function success(position) {
		const latitude  = position.coords.latitude;
		const longitude = position.coords.longitude;
		status.textContent = "";
		mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
		mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
		document.getElementById("Tracker").src = `https://wobistdu.herokuapp.com/${longitude}%2C${latitude}`;
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
hInterval = setInterval(geoFindMe, 10000)
