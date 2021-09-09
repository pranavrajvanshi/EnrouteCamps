var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Create
router.get("/index/:id/comments/new", isLoggedIn, (req, res) => { 
    Campground.findById(req.params.id, (err, campground) => { 
        if (err) {
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
     });
 });

 router.post("/index/:id/comments",isLoggedIn, (req, res) => { 
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log("Invalid ID");
            console.log(err);
            console.log(req.body.comment);
            res.redirect("/index");
        }else{
            Comment.create(req.body.comment,(err, comment) => { 
                if (err) {
                    console.log(err);
                    req.redirect("/index");
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.Comments.push(comment);
                    campground.save();
                    console.log(comment);
                    res.redirect("/index/"+campground._id);
                }
                });

        }
        
    });
});

//Update
router.get("/index/:id/comments/:comment_id/edit",isAuthorized, (req, res) => {
    Campground.findById(req.params.id,  (err, foundCampground) => {  
        if(err){
            console.log(err);
            res.redirect("/index/");
        }else{
            Comment.findById(req.params.comment_id, (err, foundComment) => {  
                if(err){
                    console.log(err);
                    res.redirect("/index");
                }else{
                    res.render("comments/edit.ejs", {campground:foundCampground, comment:foundComment});
                } 
            });
        }
    });
});

router.put("/index/:id/comments/:comment_id",isAuthorized, (req, res) => { 
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            console.log(err);
            res.redirect("/index");
        }else{
            Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err) => {
                if(err){
                    console.log(err);
                    res.redirect("back");
            
                }else{
                    res.redirect("/index/"+req.params.id);
            
                }
            })
        }
    });
 });


 //Delete
 router.delete("/index/:id/comments/:comment_id",isAuthorized,  (req, res) => {  
    Comment.findByIdAndRemove(req.params.comment_id, (err) => { 
        if (err) {
            res.redirect("back");
        }else{
            res.redirect("/index/"+req.params.id);
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

function isAuthorized(req,res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           } else {
            if(foundComment.author.id.equals(req.user._id)) {
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

