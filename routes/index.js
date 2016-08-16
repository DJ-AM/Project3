var express  = require('express');
var router   = express.Router();
var passport = require('passport');
var ForecastIo = require('forecastio');

var forecastIo = new ForecastIo(process.env.WEATHER_KEY, {timeout: 30*1000});
forecastIo.forecast('51.506', '-0.127').then(function(data) {
  console.log(JSON.stringify(data, null, 2));
});

var options = {
  units: 'si',
  exclude: 'currently,hourly,flags'
};
forecastIo.forecast('49.844', '24.028', options).then(function(data) {
  console.log(JSON.stringify(data, null, 2));
});



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Roadtrippr', user: req.user });
});
router.get('/about', function(req, res, next){
  res.render('pages/about', { title: 'About Roadtrippr', user: req.user });
});

router.post('/', function(req, res, next) {

  // res.send(<'iframe width="70%" height="70%" src="https://api.forecast.io/forecast/9363c7ddfdea32d3ccd82b5c780b74d1/hourly' + latitude' +  'longitude'"></iframe>', function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     console.log(body) // Print the google web page.
  //   }
  // })

  // Directions


  // Waypoints



  console.log(req.body)
  var destination = req.body.destination;
  var startingLoc = req.body.startingLoc;

  var hiddenLocation = req.body.hiddenLocation;
  if (startingLoc) {
    res.send('<iframe width="70%" height="70%" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyD_yzTWnGjID6IUWj9PF9IVhIFwYtCp_fM&origin=' + startingLoc + '&destination=' + destination + '"></iframe>')
  } else {
    res.send('<iframe width="70%" height="70%" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyD_yzTWnGjID6IUWj9PF9IVhIFwYtCp_fM&origin=' + hiddenLocation + '&destination=' + destination + '"></iframe>')
  }
})


router.get('/auth/google', passport.authenticate(
  'google',
  {scope: ['profile', 'email']}
));

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/',
    failureRedirect: '/'
  }
));

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});



module.exports = router;
