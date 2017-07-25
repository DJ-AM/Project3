var User = require('../models/User');

module.exports = {
  index: index
};

function index(req, res) {
  User.find({}, function(err, students) {
    if (err) return res.status(err.statusCode || 500).json(err);
    res.json(Users);
  });
}
