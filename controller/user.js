const User=require("../models/user");
module.exports.signupForm=(req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newuser=new User({email,username});
    const registereduser=await User.register(newuser,password);
    req.login(registereduser,(err)=>{
        if(err){
            return next(err)

        }
    req.flash("success","Welcome to WanderLust");
    res.redirect("/listings");
    })
    
    }
    catch(e){
        req.flash("failure",e.message);
        res.redirect("signup");
    }
}
//after login
module.exports.login=async(req,res)=>{
        req.flash("success","welcome back to wanderlust")
        let redirect=res.locals.redirecturl||"/listings";
        res.redirect(redirect);
    }

module.exports.loginForm=(req,res)=>{
    res.render("user/login.ejs");
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })}