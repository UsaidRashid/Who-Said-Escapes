const Listing=require("./models/listings");
const Review=require("./models/review.js");
const ExpressError=require("./utils/expressError");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedin = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to do this");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.UserInfo._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    try {
        const { error } = listingSchema.validate(req.body.listing);
        if (error) {
            console.error("Validation Error:", error);
            const errMsg = error.details.map((el) => el.message).join(', ');
            throw new Error(errMsg);
        }
        next();
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports.validateReview = (req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message.join(","));
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next) =>{
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.UserInfo._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}