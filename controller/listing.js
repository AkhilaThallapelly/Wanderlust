const Listing=require("../models/listing.js");

module.exports.index=async(req,res)=>{
    let alllistings= await Listing.find({});
    res.render("listing/index.ejs",{alllistings});
}
module.exports.renderindex=async (req, res) => {
  const { category } = req.params;
  const alllistings = await Listing.find({ category });
  
  res.render("listing/index.ejs", { alllistings });
};
module.exports.redirectnewform=(req,res)=>{
    res.render("listing/new.ejs");
}
module.exports.createListing=async(req,res,next)=>{
 
    const list=new Listing(req.body.listing);
    if(!req.body.listing){
        throw new Expresserr(404,"send valid data for listing");
    }
    list.owner=req.user._id;
    console.log(req.user);
    list.image={url:req.file.path,filename:req.file.filename};
    await list.save();
    req.flash("success","New Listing created");

    res.redirect("/listings");
    
    
}

module.exports.show=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }else{
    res.render("listing/show.ejs",{listing});
    }
}
module.exports.editForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalimageurl = listing.image.url;
    originalimageurl = originalimageurl.replace("/upload/", "/upload/h_300,w_250/");

    console.log(originalimageurl);
    res.render("listing/Edit.ejs",{listing,originalimageurl});
}
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    if(!req.body.listing){
        throw new Expresserr(404,"send valid data for listing");
    }
   
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    // console.log({...req.body.listing});
    if(typeof req.file !=="undefined"){
    listing.image={url:req.file.path,filename:req.file.filename};
    await listing.save();
    }
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}