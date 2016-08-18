var express  = require('express');
var router   = express.Router();
var passport = require('passport');
var searchController = require('../controllers/search');
// var pagesController = require('../controllers/pages')
var ForecastIo = require('forecastio');

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
  // .post(searchController.create);

router.route('/api/search/:id')
  .delete(searchController.destroy);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Roadtrippr', user: req.user });
});

//methinks this is duplicate code.  Let's delete?
// router.route('/')
//   .get(pagesController.index);

router.get('/about', function(req, res, next) {
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
  newSearch.save(function(err, savedSearch) {
    if(err) next (err);
  });


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

// maybe dead code from deleted routes.js
// if (path === '/searchresults' || path === '/savedsearches') {
//   require('./controllers/search').get(req, res)
// }
