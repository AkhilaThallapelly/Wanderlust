const express=require("express");
const app=express();
const cookieparser=require("cookie-parser");
app.use(cookieparser("hjegrhfherfewhf"));
app.get("/setcookie",(req,res)=>{
    res.cookie("name","shra");
    res.cookie("color","yellow");
    res.send("working");
})
app.get("/getcookie",(req,res)=>{
   res.cookie("name","Akhila",{signed:true});

    res.send("done");
})
app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("verified");
})
app.listen(3000,()=>{
    console.log("listenning");
})