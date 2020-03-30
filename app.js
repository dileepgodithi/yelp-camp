var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');
var seedDB = require('./seeds');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{useNewUrlParser : true, useUnifiedTopology : true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static('public'));
seedDB();

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
    next();
})

app.get('/', function(req, res){
    res.render('landing');
});

//
app.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("Some error", err);
        }
        else{
            res.render("campgrounds/index",{campgrounds : allCampgrounds});
        }
    })
});

//CREATE campground and save in database
app.post('/campgrounds', function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;

    var newCampground = {name:name, image:image, description : desc};

    //campgrounds.push(newCampground);
    //add campground to database
    Campground.create(newCampground, function(err, newEntry){
        if(err){
            console.log("Some problem", err);
        }
        else{
            //console.log(newEntry);
            res.redirect('/campgrounds');
        }
    }); 
});

//NEW campground form
app.get('/campgrounds/new', function(req, res){
    res.render('campgrounds/new');
});

//SHOW description of a particular campground
app.get('/campgrounds/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundEntry){
        if(err){
            console.log("Something wrong",err);
        }
        else{
            res.render('campgrounds/show', {campground : foundEntry});
        }
    })
    // res.render('show');
});

//Comments route
app.get('/campgrounds/:id/comments/new',isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {campground : campground});
        }
    });
});

//post comments route
app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                campground.comments.push(comment);
                campground.save();
                res.redirect('/campgrounds/' + campground._id);
            }); 
        }
    })
})

//AUTH routes
app.get('/register', function(req, res){
    res.render('register');
})

//sign up
app.post('/register', function(req, res){
    User.register(new User({username : req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds');
        });
    });
});

//Login routes
app.get('/login', function(req, res){
    res.render('login');
});

//login logic with middleware
app.post('/login', passport.authenticate('local', {
    successRedirect : '/campgrounds',
    failureRedirect : '/login'
    }), function(req, res){
    
});

//logout
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

app.listen(3000, function(){
    console.log("Server started and serving on port 3000");
});