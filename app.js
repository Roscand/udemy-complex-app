const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const markdown = require('marked');
const sanitizeHTML = require('sanitize-html');
const app = express();

let sessionOptions = session({
    secret: "Reformato Uninitializare",
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
});

app.use(sessionOptions);
app.use(flash());

app.use(function(req, res, next) {
    // Markdown for EJS
    res.locals.filterUserHTML = function(content) {
        return sanitizeHTML(markdown(content), {allowedTags: ['p', 'br', 'ul', 'ol', 'li', 'strong', 'bold', 'i', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'], allowedAttributes: {}});
    };

    // Error/success messages for EJS
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');

    // Current user ID avaliable on the REQ object
    req.session.user ? req.visitorId = req.session.user._id : req.visitorId = 0;

    // User session data avaliable for EJS
    res.locals.user = req.session.user;

    next();
});

const router = require('./router');

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(express.static('public'));
app.set('views', 'views');
app.set('view engine', 'ejs');


app.use('/', router);

module.exports = app;