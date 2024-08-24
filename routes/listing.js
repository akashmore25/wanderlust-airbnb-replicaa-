const express = require("express");
const router = express.Router();
const Listing = require("../models/listings");//listings is model we required to perform crud operations
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn,isOwner,validateListing} = require("../middleware");
const listingController=require("../controllers/listings");
const { listingSchema } = require("../schema");
const multer = require('multer');
const {storage}=require("../cloudConfig");
const upload = multer({storage});


router.get("/options",listingController.optionListing);

   //NEW ROUTE
   router.get("/new",isLoggedIn,listingController.NewListingForm);


router.route("/")
.get(wrapAsync(listingController.index  )) //index route to show all listing
.post( isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createNewListing))    //CREATE ROUTE


router.route("/:id")
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))   //delete route
.get(wrapAsync( listingController.showListing)) //show route
.put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing,  wrapAsync(listingController.updateListing))  //update route



//EDIT ROUTE

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing))


module.exports = router;