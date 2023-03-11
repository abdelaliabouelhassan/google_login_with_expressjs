require("dotenv").config();
const express = require('express');
const session = require('express-session');
const requestPromise = require('request-promise');

const app = express();

app.set("view engine", "ejs");

// Set up session middleware
app.use(session({
  secret: 'mysecret',
  resave: true,
  saveUninitialized: true
}));

// Google authentication routes
app.get('/google', (req, res) => {
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  req.session.state = state;

  const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIEN_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&scope=openid%20profile%20email&state=${state}&access_type=offline&prompt=consent`; //&access_type=offline is for refresh token
  res.redirect(url);
});

app.get('/google/callback', async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;
  const savedState = req.session.state;

  if (state !== savedState) {
    res.status(401).send('Invalid state parameter');
    return;
  }

  try {
    // Exchange code for access token
    const options = {
      method: 'POST',
      uri: 'https://oauth2.googleapis.com/token',
      form: {
        code: code,
        client_id: process.env.GOOGLE_CLIEN_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      json: true
    };
    const response = await requestPromise(options);
    const accessToken = response.access_token;
    const idToken = response.id_token;
    const refreshToken = response.refresh_token; // Save this for later
    console.log("refreshToken",refreshToken);
    console.log("accessToken",accessToken);  
    // Decode ID token to get user information
    const base64Url = idToken.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decoded = Buffer.from(base64, 'base64').toString('utf8');
    const user = JSON.parse(decoded);

    // Set user information in session
    req.session.user = user;
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});


function requireAuth(req, res, next) {
  if (req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    res.render("pages/index");
  }
}

app.get('/', requireAuth, (req, res) => {
  const user = req.user;
  res.send("Welcome",user.name);
});


app.get('/profile', requireAuth, (req, res) => {
  const user = req.user;
  res.render("pages/profile.ejs", {
    name: user.name,
    email: user.email,
    photo: user.picture,
    id:  user.sub,
    provider: user.iss,
  })
});



app.listen(4000, () => {
  console.log('Server started on port 4000');
});


