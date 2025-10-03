const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let {id}=req.params;
    let newreview=new Review(req.body.review);
    newreview.author=req.user._id;
    listing.reviews.push(newreview);
    
    await newreview.save();
    await listing.save();
    req.flash("success","New Review created!");
   res.redirect(`/listings/${id}`)
}

module.exports.deleteReview=async(req,res)=>{
    let {id}=req.params;
    let {reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete({_id:reviewId});
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}