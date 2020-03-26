var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
    {name:"Chikmagalur", image: "https://images.thrillophilia.com/image/upload/s--uvfbIP-Y--/c_fill,f_auto,fl_strip_profile,g_center,h_642,q_auto,w_1280/v1/images/photos/000/116/858/original/1566994686_shutterstock_358158608.jpg.jpg"},
    {name:"Gokarna", image: "https://img.traveltriangle.com/blog/wp-content/tr:w-700,h-400/uploads/2017/10/Beach-Trekking-In-Gokarna.jpg"},
    {name:"Goa", image: "https://www.getsetcamp.com/blog/wp-content/uploads/2017/09/Cola_Beach_Sunset_Bay_Camping_With_Breakfast_In_Goa1-1024x678.jpg"},
    {name:"Chikmagalur", image: "https://images.thrillophilia.com/image/upload/s--uvfbIP-Y--/c_fill,f_auto,fl_strip_profile,g_center,h_642,q_auto,w_1280/v1/images/photos/000/116/858/original/1566994686_shutterstock_358158608.jpg.jpg"},
    {name:"Gokarna", image: "https://img.traveltriangle.com/blog/wp-content/tr:w-700,h-400/uploads/2017/10/Beach-Trekking-In-Gokarna.jpg"},
    {name:"Goa", image: "https://www.getsetcamp.com/blog/wp-content/uploads/2017/09/Cola_Beach_Sunset_Bay_Camping_With_Breakfast_In_Goa1-1024x678.jpg"},
    {name:"Chikmagalur", image: "https://images.thrillophilia.com/image/upload/s--uvfbIP-Y--/c_fill,f_auto,fl_strip_profile,g_center,h_642,q_auto,w_1280/v1/images/photos/000/116/858/original/1566994686_shutterstock_358158608.jpg.jpg"},
    {name:"Gokarna", image: "https://img.traveltriangle.com/blog/wp-content/tr:w-700,h-400/uploads/2017/10/Beach-Trekking-In-Gokarna.jpg"},
    {name:"Goa", image: "https://www.getsetcamp.com/blog/wp-content/uploads/2017/09/Cola_Beach_Sunset_Bay_Camping_With_Breakfast_In_Goa1-1024x678.jpg"}
    
];

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){
    res.render("campgrounds",{campgrounds:campgrounds});
});

app.post('/campgrounds', function(req, res){
    var name = req.body.name;
    var image = req.body.image;

    var newCampground = {name:name, image:image};

    campgrounds.push(newCampground);
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function(req, res){
    res.render('new');
});

app.listen(3000, function(){
    console.log("Server started and serving on port 3000");
});