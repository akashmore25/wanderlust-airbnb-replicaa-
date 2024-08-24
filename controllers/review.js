const Review =require("../models/review");
const Listing = require("../models/listings");//listings is model we required to perform crud operations


module.exports.createNewReview = async(req,res)=>{
    let {id} =req.params;
    let listing = await Listing.findById(id);
    let newReview=  new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author=req.user._id;
    console.log(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","new review added !")
    console.log("new review saved");
    res.redirect(`/listings/${id}`);
    }


    module.exports.destroyreview =   async(req,res)=>{
        let {id,reviewId} =req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","review deleted!");
        res.redirect(`/listings/${id}`);
        }