const User = require('../modules/User');

exports.login = function(req, res) {
    let user = new User(req.body);
    user.login().then(() => {
        res.redirect('/');
    }).catch((e) => {
        res.send(e);
    });
};

exports.logout = function(req, res) {

};

exports.register = function(req, res) {
    let user = new User(req.body);
    user.register();
    if (user.errors.length) {
        res.send(user.errors);
    } else {
        res.send('User Successfully Registered!');
    };
};

exports.home = function(req, res) {
    res.render('home-guest');
};