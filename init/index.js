const mongoose = require ("mongoose");
const initData = require("./data");
const Listing = require("../models/listings");




const Mongo_url ='mongodb://127.0.0.1:27017/wandervillas';

main()
.then(()=>{
    console.log("connected to DB!");
})
.catch((err)=>{
    console.log(err);
})


async function main (){
    await mongoose.connect(Mongo_url);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>{
        return {...obj,owner:'66b3ab8ac46da662fe31c548'}
     })
    await Listing.insertMany(initData.data);
    console.log("data was initalized");
};

initDB();
