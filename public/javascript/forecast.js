$(document).ready(function($) {
  $('#seeWeatherdest').on('click', function(){
    // http://stackoverflow.com/questions/35383686/skycons-dark-sky-forecast-api-displaying-animated-icons-for-dynamically-created

    function findWindDirection(dir) {
      var key    = ['N','S','W','E','NW','NE','SW','SE'];
      var select = Math.floor(dir/45);
      return key[select];
    }

    var apiKey = '76a0b6639f56ec09d980a92471acf6cb';
    var apiURL = 'https://api.forecast.io/forecast/' + apiKey + '/' + $dLatitude + ',' + $dLongitude;

    $.ajax({
      url: apiURL,
      dataType: 'jsonp',
      success: function(json) {
        console.log(json)
        var currentTemp = Math.round(json.currently.apparentTemperature) + '\u00B0';
        var description = json.currently.summary;
        var icon        = json.currently.icon;
        var windDirect  = findWindDirection(json.currently.windBearing);
        var windSpeed   = Math.round(json.currently.windSpeed);
        console.log(icon)
        console.log(windDirect)
        console.log(windSpeed)
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

    // var apiKey = '76a0b6639f56ec09d980a92471acf6cb';
    var apiURL = 'https://api.forecast.io/forecast/' + apiKey + '/' + $sLatitude + ',' + $sLongitude;

    $.ajax({
      url: apiURL,
      dataType: 'jsonp',
      success: function(json) {
        console.log(json)
        var currentTemp = Math.round(json.currently.apparentTemperature) + '\u00B0';
        var description = json.currently.summary;
        var icon        = json.currently.icon;
        var windDirect  = findWindDirection(json.currently.windBearing);
        var windSpeed   = Math.round(json.currently.windSpeed);
        console.log(icon)
        console.log(windDirect)
        console.log(windSpeed)
        $('#Stemp').append(currentTemp);
        $('#Scondition').append(description + '<br><canvas class="' + icon +'" width="50" height="50"></canvas>')

        if(windSpeed > 0) {
          $('#Swind').append('Wind ' + windDirect + '@ ' + windSpeed + ' MPH');


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
    $('#seeWeatherdest').addClass('hidden')
})

})
