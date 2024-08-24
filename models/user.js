const { string, required } = require("joi");
const { default: mongoose } = require("mongoose");
const monogoose = require("mongoose");
const Schema = monogoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
});


userSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model("User",userSchema);