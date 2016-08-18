var Search = require('../models/Search');

 module.exports = {
  index: index,
  destroy: destroy
 }

 function index(req, res, next){
   Search.find({}, function(err, searches){
     if(err) next(err);
     res.json(searches)
   });
   console.log('You got this far!');
 }
//
//  function update(req, res, next) {
//   var id = req.params.id;
//   console.log("You have updated your search", id, req.body);
//
//   Search.findById(id, function(err, search) {
//     if (err || !search) {
//       next(err);
//     } else {
//       // set the new search information if it exists in the request
//       // if(req.body.task) search.task = req.body.task;
//       // if(req.body.bootsyLevel) search.bootsyLevel = req.body.bootsyLevel;
//       // search.completed = req.body.completed;
//
//       // We are only allowing users to check or uncheck completed on the search page.
//       // This means for this specific case, I can ignore the request data and just flip the boolean.
//       // For a proper update, with actual changing data, see aboove commented out pattern.
//       search.completed = !search.completed;
//
//       search.save(function(err, updatedSearch) {
//         if (err) next(err);
//
//         console.log("We changed it up!");
//         res.json(updatedSearch);
//       });
//     }
//   });
// }
//


function destroy(req, res, next) {
  var id = req.params.id;
  console.log("Say goodbye to your little saved search", id);

  Search.remove({ _id: id}, function(err) {
    // Only triggers if there is a major problem; will not fail if trying to remove something that isn't there
    if (err) next(err);

    // If it's a successful delete
    res.json({msg: "Your search has been deleted, good sir or madam."});
  });
};
