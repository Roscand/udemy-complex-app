const User = require('../modules/User');

exports.login = function(req, res) {

};

exports.logout = function(req, res) {

};

exports.register = function(req, res) {
    let user = new User(req.body);
    user.register();
    res.send('User Successfully Registered!');
};

exports.home = function(req, res) {
    res.render('home-guest');
};