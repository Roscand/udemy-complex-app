const User = require('../modules/User');

exports.login = function(req, res) {
    let user = new User(req.body);
    user.login().then(() => {
        req.session.user = {username: user.data.username};
        res.send('logged in');
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
    if (req.session.user) {
        res.send('Welcome to the actual application!');
    } else {
        res.render('home-guest');
    };
};