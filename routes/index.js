var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");

router.get("/register", function (req, res) { 
    res.render("register");
});


router.post("/register",  (req, res) => { 
    var newUser = new User({username: req.body.username});
    User.register(newUser , req.body.password, (err, user) => {  
        if(err){
            console.log(err);
            return res.render("register");
        }else{
            passport.authenticate("local")(req, res, () => {
                res.redirect("/index");
            });
        }
    });
});

router.get("/login", (req, res) => {  
    res.render("login");
});

router.post("/login", passport.authenticate('local',
    {
        successRedirect:"/index",
        failureRedirect:"/login"
    }) ,function (req, res) {  

});

router.get("/logout", function (req, res) { 
    req.logout();
    res.redirect("/index");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }else {
        res.redirect("/login");
    }
}


module.exports = router;