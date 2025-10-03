const express=require("express");
const wrapAsync = require("../utils/wrapAsync");
const router=express.Router();
const User=require("../models/user");
const passport=require("passport");
const { saveRedirecturl } = require("../middleware");
const usercontroller=require("../controller/user.js");

router.route("/signup")
    .get(usercontroller.signupForm)
    .post(wrapAsync(usercontroller.signup))
router.route("/login")
    .get(usercontroller.loginForm)
    .post(saveRedirecturl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true,
    }),
    usercontroller.login
)

router.get("/logout",usercontroller.logout)

module.exports=router;