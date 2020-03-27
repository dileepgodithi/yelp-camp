var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{useNewUrlParser : true, useUnifiedTopology : true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//campground schema setup
var campgroundSchema = new mongoose.Schema({
    name : String,
    image : String,
    description : String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {name:"Gokarna",
//      image: "https://img.traveltriangle.com/blog/wp-content/tr:w-700,h-400/uploads/2017/10/Beach-Trekking-In-Gokarna.jpg",
//      description : "This is a beatiful and picturesque location near Goa. Beaches and mountains. Calm atmosphere. Non polluted beaches"
//     }, function(err, campground){
//         if(err){
//             console.log("Some problem", err);
//         }
//         else{
//             console.log(campground);
//         }
// });

// var campgrounds = [
//     {name:"Chikmagalur", image: "https://images.thrillophilia.com/image/upload/s--uvfbIP-Y--/c_fill,f_auto,fl_strip_profile,g_center,h_642,q_auto,w_1280/v1/images/photos/000/116/858/original/1566994686_shutterstock_358158608.jpg.jpg"},
//     {name:"Gokarna", image: "https://img.traveltriangle.com/blog/wp-content/tr:w-700,h-400/uploads/2017/10/Beach-Trekking-In-Gokarna.jpg"},
//     {name:"Goa", image: "https://www.getsetcamp.com/blog/wp-content/uploads/2017/09/Cola_Beach_Sunset_Bay_Camping_With_Breakfast_In_Goa1-1024x678.jpg"},
//     {name:"Chikmagalur", image: "https://images.thrillophilia.com/image/upload/s--uvfbIP-Y--/c_fill,f_auto,fl_strip_profile,g_center,h_642,q_auto,w_1280/v1/images/photos/000/116/858/original/1566994686_shutterstock_358158608.jpg.jpg"},
//     {name:"Gokarna", image: "https://img.traveltriangle.com/blog/wp-content/tr:w-700,h-400/uploads/2017/10/Beach-Trekking-In-Gokarna.jpg"},
//     {name:"Goa", image: "https://www.getsetcamp.com/blog/wp-content/uploads/2017/09/Cola_Beach_Sunset_Bay_Camping_With_Breakfast_In_Goa1-1024x678.jpg"},
//     {name:"Chikmagalur", image: "https://images.thrillophilia.com/image/upload/s--uvfbIP-Y--/c_fill,f_auto,fl_strip_profile,g_center,h_642,q_auto,w_1280/v1/images/photos/000/116/858/original/1566994686_shutterstock_358158608.jpg.jpg"},
//     {name:"Gokarna", image: "https://img.traveltriangle.com/blog/wp-content/tr:w-700,h-400/uploads/2017/10/Beach-Trekking-In-Gokarna.jpg"},
//     {name:"Goa", image: "https://www.getsetcamp.com/blog/wp-content/uploads/2017/09/Cola_Beach_Sunset_Bay_Camping_With_Breakfast_In_Goa1-1024x678.jpg"}
    
// ];

//
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
    Campground.findById(req.params.id, function(err, foundEntry){
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