var express = require('express');
var router = express.router();

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
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
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
    res.redirect('/');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;