var express  = require('express');
var router   = express.Router();
var passport = require('passport');
var ForecastIo = require('forecastio');
var searchController = require('../controllers/search');
var user = require('../models/User')

var destination;
var startingLoc;

var forecastIo = new ForecastIo(process.env.WEATHER_KEY, {timeout: 30*1000});
forecastIo.forecast('51.506', '0.127').then(function(data) {
  // console.log(JSON.stringify(data, null, 2));
});

var options = {
  units: 'si',
  exclude: 'currently,hourly,flags'
};
forecastIo.forecast('49.844', '24.028', options).then(function(data) {
  // console.log(JSON.stringify(data, null, 2));
});

router.route('/api/search')
  .get(searchController.index)

router.route('/api/search/:id')
  .patch(searchController.update)
  .delete(searchController.destroy);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Roadtrippr', user: req.user });
});

router.get('/about', function(req, res, next) {
  res.render('pages/about', { title: 'About Roadtrippr', user: req.user });
});

router.post('/', function(req, res, next) {
  console.log(req.body)
  destination = req.body.destination;
  startingLoc = req.body.startingLoc;
  var Search = require('../models/Search');
  console.log('storing a new search!');
  var newSearch = new Search();
  if (startingLoc) {
    newSearch.starting_point = startingLoc;
  } else {
    newSearch.starting_point = '*'
  }
  newSearch.destination = destination;
  console.log(newSearch);
  if (req.user) {
    newSearch.searchMadeBy = req.user._id;
    newSearch.save(function(err, savedSearch) {
      if(err) next (err);
      console.log(savedSearch);
    });
  }
  res.redirect('searchresults')
})

router.get('/searchresults', function(req, res, next) {
  res.render('pages/searchresults', {title: 'Roadtrippr Search Results', user: req.user, destination: destination, startingLoc: startingLoc})
})

router.get('/savedsearches', function(req, res, next) {
  res.render('pages/savedsearches', { title: 'Your saved searches', user: req.user });
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
