const User = require ("../models/user");

module.exports.renderSignUpForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp =  async (req,res) => {
    try {
        let {username, email , password} = req.body;
        const newUser= new User({email,username});
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser , (err) =>{
            if(err){
                return next(err);
            }
            else{
                req.flash("success","Welcome to Who-Said Escapes!");
                res.redirect("/listings");
            }
        });
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req,res) => {
    req.flash("success","Welcome back to Who-Said Escapes!");
    let redirectUrl= res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next) => {
    req.logout( (err) =>{
        if(err){
            return next(err);
        }
        req.flash("success","You are successfully Logged Out!");
        res.redirect("/listings");
    });
}