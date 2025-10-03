const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const Expresserr=require("./utils/Expresserr.js")
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedin=(req,res,next)=>{
   
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl;
        req.flash("error","you must be logged in");
       return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirecturl=(req,res,next)=>{
    if(req.session.redirecturl){
    res.locals.redirecturl=req.session.redirecturl;
    }
    next();
}
module.exports.isowner=async(req,res,next)=>{
   let {id}=req.params;
  const listing= await Listing.findById(id);
    if(!res.locals.curruser._id.equals(listing.owner._id)){
        req.flash("error","you dont have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>{
            (el.message).join(",");
            throw new Expresserr(400,errmsg);
        })

    }
    else{
        next();
    }

}
module.exports.validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map(el => el.message).join(", ");
        throw new Expresserr(400, errmsg);
    }
    next();
};
module.exports.isAuthor=async(req,res,next)=>{
   let {id}=req.params;
    let {reviewId}=req.params;
  let review= await Review.findById(reviewId);
  console.log(review);
    if(!res.locals.curruser._id.equals(review.author)){
        req.flash("error","you dont have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}