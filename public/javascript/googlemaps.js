var geoLocation = {
  getLocation: function() {
    var deferred = $.Deferred();
    // if geo location is supported
    if(navigator.geolocation) {
      // get current position and pass the results to getPostalCode or time out after 5 seconds if it fails
      navigator.geolocation.getCurrentPosition(deferred.resolve, this.geoLocationError, {
          timeout: 5000
      });
    } else {
      //geo location isn't supported
      console.log('Your browser does not support Geo Location.');
    }
    return deferred.promise();
  },
  geoLocationError: function() {
    console.log('Geo Location failed.');
  }
};
$.when(geoLocation.getLocation()).then(function(data){
  var pos = {
    lat: data.coords.latitude,
    lng: data.coords.longitude
  };
  console.log(pos)

  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  var mapOptions = {
    center: new google.maps.LatLng(pos.lat, pos.lng),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  directionsDisplay.setMap(map)


  if (startingLoc) {
    var req = {
      origin: startingLoc || pos,
      destination: destination,
      travelMode: 'DRIVING'
    }
  } else {
    var req = {
      origin: pos,
      destination: destination,
      travelMode: 'DRIVING'
    }
  }


  directionsService.route(req, function(res, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(res)
    }
  })
});
