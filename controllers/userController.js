const User = require('../modules/User');
const Post = require('../modules/Post');
const Follow = require('../modules/Follow');

exports.doesUsernameExist = function(req, res) {
    User.findByUsername(req.body.username).then(() => {
        res.json(true);
    }).catch(() => {
        res.json(false);
    });
};

exports.doesEmailExist = async function(req, res) {
    let emailBool = await User.doesEmailExist(req.body.email);
    res.json(emailBool);
};

exports.sharedProfileData = async function(req, res, next) {
    let isVisitorsProfile = false;
    let isFollowing = false;
    if (req.session.user) {
        isVisitorsProfile = req.profileUser._id.equals(req.session.user._id);
        isFollowing = await Follow.isVisitorFollowing(req.profileUser._id, req.visitorId);
    };

    req.isVisitorsProfile = isVisitorsProfile;
    req.isFollowing = isFollowing;

    let postCountPromise = Post.countPostsByAuthor(req.profileUser._id);
    let followerCountPromise = Follow.countFollowersById(req.profileUser._id);
    let followingCountPromise = Follow.countFollowingById(req.profileUser._id);

    let [postCount, followerCount, followingCount] = await Promise.all([postCountPromise, followerCountPromise, followingCountPromise]);
    
    req.postCount = postCount;
    req.followerCount = followerCount;
    req.followingCount = followingCount;

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


exports.apiLogin = function(req, res) {
    let user = new User(req.body);
    user.login().then(() => {
        res.json("Good job. Logged in.");
    }).catch(function(error) {
        res.json("Sorry. You shall not pass.");
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

exports.home = async function(req, res) {
    if (req.session.user) {
        let posts = await Post.getFeed(req.session.user._id);
        res.render('home-dashboard', {posts: posts});
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
            title: `Profile for ${req.profileUser.username}`,
            currentPage: "posts",
            posts: posts,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar,
            isFollowing: req.isFollowing,
            isVisitorsProfile: req.isVisitorsProfile,
            counts: {postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount}
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
            isVisitorsProfile: req.isVisitorsProfile,
            counts: {postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount}
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
            isVisitorsProfile: req.isVisitorsProfile,
            counts: {postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount}
        });
    } catch {
        res.render('404');
    };
};


