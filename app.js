var map;
var nus = new google.maps.LatLng(1.2956, 103.7767);
var markers = [];
var numMarkers = 0;

function initialize(){
	
	initialMapSetup();

	initialiseSearchBox();

	detectUserCurrentLocation();

	disableEnterKey();

	placeJioMarker();

	$('#notifications').click(function(){
		$('#promptBackground').fadeIn(600);
		$('#notificationsBox').fadeIn({queue: false, duration: 'slow'});
		$('#notificationsBox').animate({
				height: "800px"
			}, 600, function(){
		});
	});

	$('#promptBackground').click(function(){
		$('#promptBackground').fadeOut(600);
		$('#notificationsBox').animate({
				height: "0px"
			}, 600, function(){
		});
		$('#notificationsBox').fadeOut({queue: false, duration: 'slow'});
	});
}

//searchBox stuff//-----------------------------------------------------
function initialiseSearchBox(){
	var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox((input));

	google.maps.event.addListener(searchBox, 'places_changed', function() {
	    var places = searchBox.getPlaces();

	    if (places.length == 0) {
	      return;
	    }

	    var bounds = new google.maps.LatLngBounds();
	    for (var i = 0, place; place = places[i]; i++) {
	      	var image = {
		        url: place.icon,
		        size: new google.maps.Size(71, 71),
		        origin: new google.maps.Point(0, 0),
		        anchor: new google.maps.Point(17, 34),
		        scaledSize: new google.maps.Size(25, 25)
	      	};

	      	bounds.extend(place.geometry.location);
	    }

    	map.fitBounds(bounds);
 	 });

	google.maps.event.addListener(map, 'bounds_changed', function() {
    	var bounds = map.getBounds();
    	searchBox.setBounds(bounds);
  	});
}

//for placing jio markers//-------------------------------------------------
function placeJioMarker(){
	google.maps.event.addListener(map, 'click', function(event) {
		placeMarker(event.latLng);
	});
}

function placeMarker(location) {

	$('#prompt').fadeIn({queue: false, duration: 'slow'});
	$('#prompt').animate({
			height: "300px"
		}, 600, function(){
	});
	$('#promptBackground').fadeIn(600);

	$('#promptBackground').click(function(){
		$('#prompt').animate({
				height: "0px"
			}, 600, function(){
		});
		$('#prompt').fadeOut({queue: false, duration: 'slow'});
		$('#promptBackground').fadeOut(600);
	});

	$("#submit").click(function() {
		numMarkers++;
		$('#markerCount').html("Number of people available: " + numMarkers);
	    var mealPreference = $('input[name=meal]:checked').val();
	    var message = $('input[name=message]').val();
	    $('#prompt').animate({
				height: "0px"
			}, 600, function(){
		});
		$('#prompt').fadeOut({queue: false, duration: 'slow'});
		$('#promptBackground').fadeOut(600);
		var marker = new google.maps.Marker({
			position: location,
			map: map,
			optimized: false,
			icon: 'sprites.gif'
		});
		var infowindow = new google.maps.InfoWindow({
			content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng() + '<br>Let\'s have <b>' + mealPreference + '</b>!'
			+ '<br>"' + message + '"'
			+ '<br><div id = "deleteMarker"><b>Delete Marker</b></div>'
		});
		google.maps.event.addListener(marker,'click',function(){
			infowindow.open(map,marker);
			$('#deleteMarker').click(function(){
				marker.setMap(null);
			});
		});
		google.maps.event.addListener(marker,'rightclick',function(event){
			marker.setMap(null);
		});
	});

	//due to change. After every click, send to datastore to update
	//Datastore return info and update entire map.
	//Which means, update map after every user action.
}

//for detecting uer current location//---------------------------------------
function detectUserCurrentLocation(){
	if(navigator.geolocation) {
	    browserSupportFlag = true;
	    navigator.geolocation.getCurrentPosition(function(position) {
	      	initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
	      	map.setCenter(initialLocation);
	    }, function() {
	      	handleNoGeolocation(browserSupportFlag);
	    });
	}
	// Browser doesn't support Geolocation
	else {
	    browserSupportFlag = false;
	    handleNoGeolocation(browserSupportFlag);
	}
}

function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = nus;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in NUS, Singapore");
      initialLocation = nus;
    }
    map.setCenter(initialLocation);
}

google.maps.event.addDomListener(window, 'load', initialize);

//miscellenous/functional//-------------------------------------------

function initialMapSetup(){
	var mapProp = {
		center:nus,
		zoom:15,
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
}

function disableEnterKey(){
	$(window).keydown(function(event){
		if (event.keyCode == 13){
			event.preventDefault();
		}
	});
}