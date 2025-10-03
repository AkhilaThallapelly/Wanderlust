const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapasync=require("../utils/wrapAsync.js");
const Expresserr=require("../utils/Expresserr.js")
const {listingSchema}=require("../schema.js");
const {isLoggedin,isowner,validatelisting}=require("../middleware.js");
const multer=require("multer");
const {storage}=require("../cloudinarystorage.js")
const upload=multer({storage})

const listingcontroller=require("../controller/listing.js")
router.route("/")
    .get(wrapasync(listingcontroller.index))
    .post(isLoggedin,validatelisting,upload.single('listing[image]'),wrapasync(listingcontroller.createListing))
    

router.get("/new",isLoggedin,listingcontroller.redirectnewform)
router.get("/category/:category",(listingcontroller.renderindex));

router.route("/:id")
    .get(wrapasync(listingcontroller.show))
    .put(isLoggedin,isowner,upload.single('listing[image]'),validatelisting,wrapasync(listingcontroller.updateListing))
    .delete(isLoggedin,isowner,wrapasync(listingcontroller.deleteListing))

//show Route

//edit  form
router.get("/:id/edit",isLoggedin,isowner,wrapasync(listingcontroller.editForm))
//update



module.exports=router;