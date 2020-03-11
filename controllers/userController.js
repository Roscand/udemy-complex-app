const User = require('../modules/User');

exports.mustBeLoggedIn = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.flash('errors', "You must be logged in to perfom that action.");
        req.session.save(() => res.redirect('/'));
    };
};

exports.login = function(req, res) {
    let user = new User(req.body);
    user.login().then(() => {
        req.session.user = {username: user.data.username, avatar: user.avatar, _id: user.data._id};
        req.session.save(() => res.redirect('/'));
    }).catch(function(error) {
        req.flash('errors', error);
        req.session.save(() => res.redirect('/'));
    });
};

exports.logout = function(req, res) {
    req.session.destroy(() => res.redirect('/'));
};

exports.register = function(req, res) {
    let user = new User(req.body);
    user.register().then(() => {
        req.session.user = {username: user.data.username, avatar: user.avatar, _id: user.data._id};
        req.session.save(() => res.redirect('/'));
    }).catch((regErrors) => {
        regErrors.forEach((regError) => {
            req.flash('regErrors', regError);
        });
        req.session.save(() => res.redirect('/'));
    });
    
};

exports.home = function(req, res) {
    if (req.session.user) {
        res.render('home-dashboard');
    } else {
        res.render('home-guest', {errors: req.flash('errors'), regErrors: req.flash('regErrors')});
    };
};