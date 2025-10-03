const express=require("express");
const router=express.Router({mergeParams: true});
const wrapasync=require("../utils/wrapAsync.js");
const Expresserr=require("../utils/Expresserr.js")
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing = require("../models/listing.js");
const {validatereview,isLoggedin,isAuthor}=require("../middleware.js");


const reviewcontroller=require("../controller/reviews.js")

router.post("/",isLoggedin,validatereview,wrapasync(reviewcontroller.createReview))


router.delete("/:reviewId",isLoggedin,isAuthor,wrapasync(reviewcontroller.deleteReview))

module.exports=router;