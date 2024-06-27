const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");
const {validateReview, isLoggedin, isReviewAuthor}=require("../middleware.js");
const reviewController = require("../controllers/review.js");

//Post Review Route
router.post("/" ,isLoggedin,validateReview,wrapAsync (reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedin,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports=router;