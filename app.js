if(process.env.NODE_ENV!='production'){
    require("dotenv").config()
}
console.log(process.env)

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const session=require("express-session")
const mongostore=require("connect-mongo")
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

app.use(methodoverride("_method"));

const Expresserr=require("./utils/Expresserr.js")
const listingroute=require("./routes/listings.js");
const reviewroute=require("./routes/reviews.js");
const userroute=require("./routes/users.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);

const dbUrl=process.env.ATLASDB_URL;
async function main(){
    // await mongoose.connect("mongodb://127.0.0.1:27017/majorproject");
 
 await mongoose.connect(dbUrl)
}
const store=mongostore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:"mysupersecret",

    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})
const sessionOption={
    store,
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httponly:true
    }
}
app.use(session(sessionOption))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
})
app.get("/demouser",async(req,res)=>{
    let fakeuser=new User({
        email:"vgh@gmail.com",
        username:"ghfgh",
    })
    let ru=await User.register(fakeuser,"hello");
    res.send(ru);
})
app.use("/listings",listingroute);
app.use("/listings/:id/reviews",reviewroute);
app.use("/",userroute);




app.all("*path", (req, res, next) => {
    next(new Expresserr(404,"Page not found!"));
});



app.use((err,req,res,next)=>{
  let {status=404,message}=err;
    res.status(status).render("error.ejs",{err});
})
main()
.then(()=>{
    console.log("connected to db");
})
.catch(err=>{
    console.log(err);
})
app.listen(3000,()=>{
    console.log("listening.....");
})