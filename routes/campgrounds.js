var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log(err);
        } else {
           res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
     });
});

router.get("/index",  (req, res) => {
        Campground.find({}, (err, allcampgrounds) => {
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds:allcampgrounds, currentUser:req.user});
        }
     });
});


//create
router.get("/index/new",isLoggedIn,  (req, res) => { 
    res.render("campgrounds/new");
 });

 router.post("/index",isLoggedIn,  (req, res) => {

    var url = req.body.image;
    var {name,desc} = req.body;
    var author = {
        id : req.user._id,
        username : req.user.username
    };
    console.log(req.user);
    var newcampground = {Name:name, Image:url, Desc:desc, Author: author};

    Campground.create(newcampground, (err, newcamp) => { 
        if(err){
            console.log(err);
        }else{
            console.log("Campground added");
        }
    });

    res.redirect("/index");

});

router.get("/index/:id", (req, res) => {
     Campground.findById(req.params.id).populate("Comments").exec( (err, foundCampground) =>{ 
         if(err){
             console.log(err);
         }else{
             console.log(foundCampground);
            res.render("campgrounds/show", {campground:foundCampground, currentUser:req.user});
         }
      });
 });

 //Edit 
router.get("/index/:id/edit",isAuthorized ,(req, res)=> {
    Campground.findById(req.params.id, (err, foundCampground)=> { 
        if (err) {
            console.log(err);
            res.redirect("/index");
        }else{
            res.render("../views/campgrounds/edit", {campground: foundCampground});
        }
    });

});

//Update
router.put("/index/:id", isAuthorized ,(req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) =>{
        if(err){
           console.log(err);
           res.redirect("/index");
       } else {
           res.redirect("/index/" + updatedCampground._id);
       }
    });
});

//Delete
router.delete("/index/:id",isAuthorized , (req, res) => {
    console.log("I'm here");
    Campground.findByIdAndRemove(req.params.id,  (err) => { 
        if(err){
            console.log(err);
            res.redirect("/index");
        }else{
            res.redirect("/index");
        }
     });
});


 function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }else {
        res.redirect("/login");
    }
}

function isAuthorized(req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground) => {
           if(err){
               res.redirect("back");
           }  else {
            if(foundCampground.Author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;

