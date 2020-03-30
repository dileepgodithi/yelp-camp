var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

router.get('/campgrounds', function(req, res){
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
router.post('/campgrounds', function(req, res){
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
router.get('/campgrounds/new', function(req, res){
    res.render('campgrounds/new');
});

//SHOW description of a particular campground
router.get('/campgrounds/:id', function(req, res){
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

module.exports = router;