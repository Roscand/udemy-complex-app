const Post = require('../modules/Post');

exports.viewCreateScreen = function(req, res) {
    res.render('create-post');
};