var mongoose = require('mongoose');

var Search = new mongoose.Schema({
  starting_point: {type: String, required: true},
  destination: {type: String, required: true},
  car: {make: String, model: String, Year: Date},
  searchMadeBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }
})

module.exports = mongoose.model('Search', Search)
