const Listing= require("../models/listings");

module.exports.index = async (req,res)=>{
    const allListings =await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm =(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListings = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path :"reviews" , populate: {path : "author"},} ).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
} 


module.exports.createNewListing = async (req,res)=>{
    console.log("Create Listing: ", req.body);
    let url=req.file.path;
    let fileName=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image = {url,fileName};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");   
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let imageUrl= listing.image.url;
    imageUrl=imageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,imageUrl});
}

module.exports.updateForm = async(req,res)=>{
    let {id} = req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file!== "undefined"){
        let url=req.file.path;
        let fileName=req.file.filename;
        listing.image = {url,fileName};
    }
    await listing.save();
    
    req.flash("success","Listing Edited!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}