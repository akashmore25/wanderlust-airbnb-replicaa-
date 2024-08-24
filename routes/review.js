const express = require("express");
const router = express.Router({mergeParams:true});
const Review =require("../models/review");
const Listing = require("../models/listings");//listings is model we required to perform crud operations
const wrapAsync = require("../utils/wrapAsync");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware");
const reviewController =require("../controllers/review");


   // ADD NEW REVIEW

router.post("/",isLoggedIn ,validateReview,wrapAsync( reviewController.createNewReview));
    
    
    //DELETE REVIEW ROUTE
    
    router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyreview));
    

    module.exports = router;