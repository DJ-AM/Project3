var express  = require('express');
var router   = express.Router();
var passport = require('passport');
var searchController = require('../controllers/search');
var ForecastIo = require('forecastio');

// var forecastIo = new ForecastIo(process.env.WEATHER_KEY, {timeout: 30*1000});
// forecastIo.forecast('51.506', '0.127').then(function(data) {
//   console.log(JSON.stringify(data, null, 2));
// });
//
// var options = {
//   units: 'si',
//   exclude: 'currently,hourly,flags'
// };
// forecastIo.forecast('49.844', '24.028', options).then(function(data) {
//   console.log(JSON.stringify(data, null, 2));
// });



router.route('/api/search')
  .get(searchController.index);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Roadtrippr', user: req.user });
});

router.get('/about', function(req, res, next) {
  res.render('pages/about', { title: 'About Roadtrippr', user: req.user });
});

router.post('/', function(req, res, next) {
  console.log(req.body)
  var destination = req.body.destination;
  var startingLoc = req.body.startingLoc;
  var hiddenLocation = req.body.hiddenLocation;
  var Search = require('../models/Search');
  console.log('storing a new search!');
  var newSearch = new Search();
  newSearch.starting_point = startingLoc;
  newSearch.destination = destination;
  console.log(newSearch);
  newSearch.save(function(err, savedSearch) {
    if(err) next (err);
  });
  res.redirect('searchresults')
})

router.get('/searchresults', function(req, res, next) {
  res.render('pages/searchresults', { title: 'About Roadtrippr', user: req.user })
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
