const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const { string } = require("joi");
// const review = require("./review");
const Review = require("./review.js");
// const { listingSchema } = require("../schema");


let ListingSchema = new  Schema({
    title: {
        type:String,
        required:true,
    },

    description:String,

    image:{
    filename:String,
       url:String,
    
    },

    price:Number,
    location:String,
    country:String,

reviews:[
    {
        type:Schema.Types.ObjectId,
        ref:"Review"
    }
],

owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
},

 category: {
    type: String,
    enum: ['Trending', 'Rooms', 'Iconic Cities', 'Mountains', 'Castles', 'Amazing Pools', 'Camping', 'Farms', 'Arctic', 'Domes', 'Boats'],
    required: true,
  },

});


ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in:listing.reviews}});
    }
})


const Listing = mongoose.model("Listing",ListingSchema);
module.exports =Listing;