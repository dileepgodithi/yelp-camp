var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var seedDB = require('./seeds');


mongoose.connect('mongodb://localhost:27017/yelp-camp',{useNewUrlParser : true, useUnifiedTopology : true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

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
            res.render("campgrounds",{campgrounds : allCampgrounds});
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
    res.render('new');
});

//SHOW description of a particular campground
app.get('/campgrounds/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundEntry){
        if(err){
            console.log("Something wrong",err);
        }
        else{
            res.render('show', {campground : foundEntry});
        }
    })
    // res.render('show');
});

app.listen(3000, function(){
    console.log("Server started and serving on port 3000");
});