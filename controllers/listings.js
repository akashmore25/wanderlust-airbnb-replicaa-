const Listing = require("../models/listings");//listings is model we required to perform crud operations


module.exports.NewListingForm =(req,res)=>{ res.render("./listings/new.ejs")}



module.exports.index=  async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
    }


    module.exports.showListing= async (req,res)=>{
        const {id} = req.params;
        const listing =  await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
        }).populate("owner");
        if(!listing){
            req.flash("error","listing you request for does not exist!");
            res.redirect("./listings");
        }
        res.render("./listings/show.ejs",{listing});
        }


        module.exports.createNewListing =async(req,res,next)=>{
            let url=req.file.path;
            let filename = req.file.filename;
            let newListing=  new Listing(req.body.listing);
            newListing.owner= req.user._id;
            newListing.image={url,filename};
        await newListing.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listings")
        }


        module.exports.updateListing = async(req,res)=>{
            let {id} =req.params;
         const listing=   await Listing.findByIdAndUpdate(id,{...req.body.listing});

         if(typeof req.file!=="undefined"){
            let url=req.file.path;
            let filename=req.file.filename;
            listing.image={url,filename};
            await listing.save();
         }
         
            req.flash("success","listing updated!")
            res.redirect(`/listings/${id}`); 
            }

        module.exports.editListing =async (req,res)=>{
            let {id} = req.params;
            const listing = await Listing.findById(id);
            if(!listing){
                req.flash("error","listing you request for does not exist!");
                res.redirect("./listings");
            }

            let orignalUrl = listing.image.url;
          let orignalImageUrl=  orignalUrl.replace("/upload" ,"/upload/h_120")

            res.render("./listings/edit.ejs",{listing,orignalImageUrl});
            }


            module.exports.destroyListing =   
            async(req,res)=>{
            let {id} =req.params;
            let deletedListing = await Listing.findByIdAndDelete(id);
            req.flash("success","listing deleted!")
            res.redirect("/listings");
            }


            module.exports.optionListing= async(req,res)=>{
                const category = req.query.category;
                let filter = {};
            
                if (category) {
                    filter.category = category;
                }
            
                const allListings = await Listing.find(filter);
                res.render("./listings/index.ejs", { allListings });
            }