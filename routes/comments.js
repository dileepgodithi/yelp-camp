var express = require('express');
var router = express.Router({mergeParams:true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
//Comments route
router.get('/new',isLoggedIn, function(req, res){
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
router.post('/', isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                campground.comments.push(comment);
                campground.save();
                res.redirect('/campgrounds/' + campground._id);
            }); 
        }
    })
})

//EDIT comments
router.get('/:comment_id/edit', checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            res.redirect('back');
        }
        else{
            res.render('comments/edit', {comment : comment, campground_id : req.params.id});
        }
    });
});

//UPDATE comments
router.put('/:comment_id', checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            res.redirect('back');
        }
        else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//DESTROY comments
router.delete('/:comment_id', checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
            res.redirect('back');
        }
        else{
            res.redirect('/campgrounds/'+ req.params.id);
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect('back');
            }
            else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.redirect('back');
                }
            }
        });
    }
    else{
        res.redirect('back');
    }  
}

module.exports = router;