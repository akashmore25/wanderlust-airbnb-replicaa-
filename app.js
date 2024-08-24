

// 1  basic backend steup 


if(process.env.NODE_ENV != "produnction"){
    require("dotenv").config();
}

const express = require("express");//to create backend 
const mongoose = require("mongoose");//to connect node enviroment with mongodb database
const app = express();
const path = require("path"); //path we require to work with ejs templete
const methodOverride = require("method-override");//required to work with put and delete
const ejsMate = require("ejs-mate");//it is used to work with templates 

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const { register } = require("module");
const MongoStore = require("connect-mongo");


app.set("view engine", "ejs"); //we set view engine as ejs to work with ejs template
app.set("views",path.join(__dirname,"views"));//we set path as views because when it search for views folder it automatically join this path ejs path in res.render
app.use(express.urlencoded({extended:true})); //data come from req body that data can be parse and can be used 
app.use(methodOverride("_method"));//this will help us t work with put and delete method in routes
app.engine("ejs",ejsMate);//we sate templeate engine as ejsMate
app.use(express.static(path.join(__dirname,"/public")));//this will help us to work with static files in express


const dbUrl=process.env.MONGO_ATLAS_URL;


// we call main func if resolve then will execte other wise catch will print error
main()
.then(()=>{
    console.log("connected to DB!");
})
.catch((err)=>{
    console.log(err);
})

// created async function contain mongoose.connect method which take mongourl to estblish connection

async function main (){
    await mongoose.connect(dbUrl);
}


const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

 store.on("error",()=>{
    console.log('ERROR IN MONGO SESSION',err)
 });

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpsOnly:true,
    },
};

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy((User.authenticate())));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error =req.flash("error");
    res.locals.CurrUser =req.user;
    next();
})


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


// 4 url to coonect application with mongodb database
// const Mongo_url ='mongodb://127.0.0.1:27017/wandervillas';
//demo new user route
// 
// app.get("/demouser",async (req,res)=>{
// let newUser = new User({
    // email:"ak@123",
    // username:"ak"
//  });
// let registerUser = await User.register(newUser,"ak123");
// res.send(registerUser);
// })

// app.get("/testingListing", async (req,res)=>{
//   let sampleListing = new Listing({
    // title:"new villa 202",
    // description:"sea facing villa green plandss",
    // price:2300,
    // location:"kochi",
    // country:"india"
// })
// 
// await  sampleListing.save();
// console.log("listing was created successfully!");
// res.send("new listing creted!");
// })
// 

// try to match with each route if not any route match with the request this will throw error

app.use("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
})


// ERROR HANDLING MIDDLEWARE 

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"} =err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs" ,{message})
})

//   2  it will listen upcoming request on port 8080
app.listen(8080,()=>{
    console.log("listning on port 8080!");
})