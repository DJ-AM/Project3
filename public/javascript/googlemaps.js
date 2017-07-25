var $dLatitude;
var latLng;
var $dLongitude;
var $sLatitude;
var $sLongitude;
var latLng;
var pos;

// This section of code will get your current location
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

// This section of code creates the map
$.when(geoLocation.getLocation()).then(function(data){
   pos = {
    lat: data.coords.latitude,
    lng: data.coords.longitude
  };
  console.log(pos);

  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();

  var mapOptions = {
    center: new google.maps.LatLng(pos.lat, pos.lng),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  directionsDisplay.setMap(map);

// This section of code generates the beginning and end markers in the map
  geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'address': startingLoc }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
      $sLatitude  = (results[0].geometry.bounds.f.b + results[0].geometry.bounds.f.f) / 2;

      $sLongitude = (results[0].geometry.bounds.b.b + results[0].geometry.bounds.b.f) / 2;
  }});
  geocoder.geocode({ 'address': destination }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });

       $dLatitude = (results[0].geometry.bounds.f.b + results[0].geometry.bounds.f.f) / 2;
      $dLongitude = (results[0].geometry.bounds.b.b + results[0].geometry.bounds.b.f) / 2;
  }});

  if (startingLoc) {
    var req = {
      origin: startingLoc,
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

// This section of code finds the midpoint of the route and places a marker on it
  directionsService.route(req, function(res, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(res);
      var route = res.routes[0];
      console.log(route);
      var lat;
      var lng;
      var distance = route.legs[0].distance.value;
      var midPoint = route.legs[0].distance.value / 2

      for (var i = 0; i < route.legs[0].steps.length; i++) {
        if (midPoint - route.legs[0].steps[i].distance.value > 0) {
          midPoint -= route.legs[0].steps[i].distance.value
        } else {
          var percent = midPoint/route.legs[0].steps[i].distance.value;
          lat = route.legs[0].steps[i].path[Math.floor(route.legs[0].steps[i].path.length * percent)].lat();
          lng = route.legs[0].steps[i].path[Math.floor(route.legs[0].steps[i].path.length * percent)].lng();

          latLng = {lat, lng};

          var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: 'OH YEAH!'
          })


          break;
        }
      }

      // finds wind direction and picks correct key symbol for display
      function findWindDirection(dir) {
        var key    = ['N','S','W','E','NW','NE','SW','SE'];
        var select = Math.floor(dir/45);
        return key[select];
      }

      // Grab data from forecast.io using longitude and latitude to grab correct insertBefore
      var apiKey = '76a0b6639f56ec09d980a92471acf6cb';
      var apiURL = 'https://api.forecast.io/forecast/' + apiKey + '/' + $dLatitude + ',' + $dLongitude;

      // Gets data and appends it to destination weather conditions
      $.ajax({
        url: apiURL,
        dataType: 'jsonp',
        success: function(json) {
          var currentTemp = Math.round(json.currently.apparentTemperature) + '\u00B0';
          var description = json.currently.summary;
          var icon        = json.currently.icon;
          var windDirect  = findWindDirection(json.currently.windBearing);
          var windSpeed   = Math.round(json.currently.windSpeed);
          $('#Dtemp').append(currentTemp);
          $('#Dcondition').append(description + '<br><canvas class="' + icon +'" width="50" height="50"></canvas>')

          if(windSpeed > 0) {
            $('#Dwind').append('Wind ' + windDirect + '@ ' + windSpeed + ' MPH');


            var icons = new Skycons({
              'color': 'black'
            }),
            list = ['clear-day', 'clear-night', 'partly-cloudy-day', 'partly-cloudy-night', 'cloudy', 'rain', 'sleet', 'snow', 'wind', 'fog'], i;

            for(i = list.length; i--;) {
              var weatherType = list[i],
              elements = document.getElementsByClassName(weatherType);
              for(e = elements.length; e--;) {
                icons.set(elements[e], weatherType)
              }
            }
            icons.play();
          }
        }
      })
      function findWindDirection(dir) {
        var key    = ['N','S','W','E','NW','NE','SW','SE'];
        var select = Math.floor(dir/45);
        return key[select];
      }

      var apiKey = '76a0b6639f56ec09d980a92471acf6cb';
      var apiURL = 'https://api.forecast.io/forecast/' + apiKey + '/' + latLng.lat + ',' + latLng.lng;

      // Grabs data for midpoint weather conditions
      $.ajax({
        url: apiURL,
        dataType: 'jsonp',
        success: function(json) {
          var currentTemp = Math.round(json.currently.apparentTemperature) + '\u00B0';
          var description = json.currently.summary;
          var icon        = json.currently.icon;
          var windDirect  = findWindDirection(json.currently.windBearing);
          var windSpeed   = Math.round(json.currently.windSpeed);
          $('#Mtemp').append(currentTemp);
          $('#Mcondition').append(description + '<br><canvas class="' + icon +'" width="50" height="50"></canvas>')

          if(windSpeed > 0) {
            $('#Mwind').append('Wind ' + windDirect + '@ ' + windSpeed + ' MPH');


            var icons = new Skycons({
              'color': 'black'
            }),
            list = ['clear-day', 'clear-night', 'partly-cloudy-day', 'partly-cloudy-night', 'cloudy', 'rain', 'sleet', 'snow', 'wind', 'fog'], i;

            for(i = list.length; i--;) {
              var weatherType = list[i],
              elements = document.getElementsByClassName(weatherType);
              for(e = elements.length; e--;) {
                icons.set(elements[e], weatherType)
              }
            }
            icons.play();
          }
        }
      })

      function findWindDirection(dir) {
        var key    = ['N','S','W','E','NW','NE','SW','SE'];
        var select = Math.floor(dir/45);
        return key[select];
      }
      if(startingLoc) {
        var apiURL = 'https://api.forecast.io/forecast/' + apiKey + '/' + $sLatitude + ',' + $sLongitude;
      } else {
        var apiURL = 'https://api.forecast.io/forecast/' + apiKey + '/' + pos.lat + ',' + pos.lng;
          }

          // Grab data for starting location weather conditions
      $.ajax({
        url: apiURL,
        dataType: 'jsonp',
        success: function(json) {
          var currentTemp = Math.round(json.currently.apparentTemperature) + '\u00B0';
          var description = json.currently.summary;
          var icon        = json.currently.icon;
          var windDirect  = findWindDirection(json.currently.windBearing);
          var windSpeed   = Math.round(json.currently.windSpeed);
          $('#Stemp').append(currentTemp);
          $('#Scondition').append(description + '<br><canvas class="' + icon +'" width="50" height="50"></canvas>')

          if(windSpeed > 0) {
            $('#Swind').append('Wind ' + windDirect + '@ ' + windSpeed + ' MPH');

            // picks correct icon to display based on data grabbed from api
            var icons = new Skycons({
              'color': 'black'
            }),
            list = ['clear-day', 'clear-night', 'partly-cloudy-day', 'partly-cloudy-night', 'cloudy', 'rain', 'sleet', 'snow', 'wind', 'fog'], i;

            for(i = list.length; i--;) {
              var weatherType = list[i],
              elements = document.getElementsByClassName(weatherType);
              for(e = elements.length; e--;) {
                icons.set(elements[e], weatherType)
              }
            }
            icons.play();
          }
        }
      })
    }
  })
})
