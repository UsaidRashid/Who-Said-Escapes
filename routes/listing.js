const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const {isLoggedin, isOwner,validateListing}=require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} =require("../cloudConfig.js");
const upload = multer({storage});


router
    .route("/")
        .get(wrapAsync(listingController.index))
        .post(isLoggedin,validateListing,upload.single("listing[image]"),wrapAsync(listingController.createNewListing));


//New Route
router.get("/new",isLoggedin ,listingController.renderNewForm);


router
    .route("/:id")
        .get(wrapAsync(listingController.showListings))
        .put(isLoggedin,isOwner,validateListing,upload.single("listing[image]"),wrapAsync(listingController.updateForm))
        .delete(isLoggedin,isOwner,wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.renderEditForm));


module.exports=router;