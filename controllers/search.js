var Search = require('../models/Search');

 module.exports = {
   index: index
 }

 function index(req, res, next){
   Search.find({}, function(err, searches){
     if(err) next(err);
     res.json(searches)
   });
   console.log('You got this far!');
 }
