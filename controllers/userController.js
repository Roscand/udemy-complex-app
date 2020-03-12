const User = require('../modules/User');
const Post = require('../modules/Post');
const Follow = require('../modules/Follow');

exports.sharedProfileData = async function(req, res, next) {
    let isVisitorsProfile = false;
    let isFollowing = false;
    if (req.session.user) {
        isVisitorsProfile = req.profileUser._id.equals(req.session.user._id);
        isFollowing = await Follow.isVisitorFollowing(req.profileUser._id, req.visitorId);
    };

    req.isVisitorsProfile = isVisitorsProfile;
    req.isFollowing = isFollowing;
    next();
};

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
        res.render('home-guest', {regErrors: req.flash('regErrors')});
    };
};

exports.ifUserExists = function(req, res, next) {
    User.findByUsername(req.params.username).then((userDocument) => {
        req.profileUser = userDocument;
        next();
    }).catch(() => {
        res.render('404');
    });
};

exports.profilePostsScreen = function(req, res) {
    Post.findByAuthorId(req.profileUser._id).then((posts) => {
        res.render('profile', {
            currentPage: "posts",
            posts: posts,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar,
            isFollowing: req.isFollowing,
            isVisitorsProfile: req.isVisitorsProfile
        });
    }).catch(() => {
        res.render('404');
    });
};

exports.profileFollowersScreen = async function(req, res) {
    try {
        let followers = await Follow.getFollowersById(req.profileUser._id);
        res.render('profile-followers', {
            currentPage: "followers",
            followers: followers,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar,
            isFollowing: req.isFollowing,
            isVisitorsProfile: req.isVisitorsProfile
        });
    } catch {
        res.render('404');
    };
};

exports.profileFollowingScreen = async function(req, res) {
    try {
        let following = await Follow.getFollowingById(req.profileUser._id);
        res.render('profile-following', {
            currentPage: "following",
            following: following,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar,
            isFollowing: req.isFollowing,
            isVisitorsProfile: req.isVisitorsProfile
        });
    } catch {
        res.render('404');
    };
};


