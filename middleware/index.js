var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middlewareObj = {};

//middleware functions
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Please Login First!');
    res.redirect('/login');
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash('error', 'Something went wrong!');
                res.redirect('back');
            }
            else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash('error', 'You do not have permissions to do that!');
                    res.redirect('back');
                }
            }
        });
    }
    else{
        res.redirect('back');
    }  
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash('error', 'Something went wrong!');
                res.redirect('back');
            }
            else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash('error', 'You do not have permissions to do that!');
                    res.redirect('back');
                }
            }
        });
    }
    else{
        res.redirect('back');
    }  
}

module.exports = middlewareObj;