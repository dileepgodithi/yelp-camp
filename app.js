var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');
var seedDB = require('./seeds');

var campgroundsRouter = require('./routes/campgrounds');
var commentsRouter = require('./routes/comments');
var indexRouter = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{useNewUrlParser : true, useUnifiedTopology : true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(flash());
//seedDB();

//passport congfiguration
app.use(require('express-session')({
    secret : "This is a secret message. Top secret in the world",
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use('/campgrounds', campgroundsRouter);
app.use('/campgrounds/:id/comments', commentsRouter);
app.use(indexRouter);

app.listen(3000, function(){
    console.log("Server started and serving on port 3000");
});