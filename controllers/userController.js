const User = require('../modules/User');

exports.login = function(req, res) {

};

exports.logout = function(req, res) {

};

exports.register = function(req, res) {
    let user = new User();
    user.register();
};

exports.home = function(req, res) {
    res.render('home-guest');
};