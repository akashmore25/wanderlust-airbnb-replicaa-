const User = require("../models/user");



module.exports.signupForm =    (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signupUser =async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({
        username,
        email,
      });
      const registerUser = await User.register(newUser, password);
      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "welcome to wanderlust!");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }


  module.exports.loginForm =(req, res) => {res.render("users/login.ejs")};

  module.exports.login =async (req, res) => {
    req.flash("success", "welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }



  module.exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "you are logged out!");
      res.redirect("/listings");
    });
  }