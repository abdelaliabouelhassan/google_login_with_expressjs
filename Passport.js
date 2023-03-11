const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
 
passport.serializeUser((user , done) => { // user is the object that is returned from the callback function in the passport.use() method.
done(null , user);
})
passport.deserializeUser(function(user, done) {
done(null, user);
});
 
passport.use(new GoogleStrategy({
clientID: process.env.GOOGLE_CLIEN_ID , // Your Credentials here.
clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Credentials here.
callbackURL: process.env.GOOGLE_REDIRECT_URI, // add this to your .env file and set it to http://localhost:4000/google/callback (or whatever port you are using) 
//passReqToCallback:true,
accessType: 'offline',// 'online' (default) or 'offline' (gets refresh_token)
},
function(request, accessToken, refreshToken, profile, done) {
console.log(profile); 
console.log("accessToken: ", accessToken); 
console.log("refreshToken: ", refreshToken);  
return done(null, profile);
}
));