var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get('/', function(req, res){
    res.render('landing');
});

//AUTH routes
router.get('/register', function(req, res){
    res.render('register');
})

//sign up
router.post('/register', function(req, res){
    User.register(new User({username : req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'Welcome to YelpCamp' + req.body.username);
            res.redirect('/campgrounds');
        });
    });
});

//Login routes
router.get('/login', function(req, res){
    res.render('login');
});

//login logic with middleware
router.post('/login', passport.authenticate('local', {
    successRedirect : '/campgrounds',
    failureRedirect : '/login'
    }), function(req, res){
    
});

//logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Successfully logged out!')
    res.redirect('/');
});

module.exports = router;