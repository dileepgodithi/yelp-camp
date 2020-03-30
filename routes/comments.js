var express = require('express');
var router = express.router();
var Campground = require('../models/campground');

//Comments route
router.get('/campgrounds/:id/comments/new',isLoggedIn, function(req, res){
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
router.post('/campgrounds/:id/comments', isLoggedIn, function(req, res){
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

module.exports = router;