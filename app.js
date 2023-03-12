require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const querystring = require("querystring");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Google authentication routes
app.get("/auth/google", (req, res) => {
  const state =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIEN_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&scope=openid%20profile%20email&state=${state}&access_type=offline&prompt=consent`; //&access_type=offline is for refresh token
  res.redirect(url);
});

app.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      code,
      client_id: process.env.GOOGLE_CLIEN_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  const tokenData = await tokenResponse.json();
  const userInfoResponse = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );
  const userInfo = await userInfoResponse.json();

  res.redirect(
    "http://localhost:5173/callback?token=" + tokenData.access_token
  );
  //+ '&user=' + JSON.stringify(userInfo)
});

app.get("/api/auth/user", async (req, res) => {
  try {
    let access_token = req.query.token;
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (userInfoResponse.status == 200) {
      const userInfo = await userInfoResponse.json();
      res.status(200).json(userInfo);
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//log out
app.get("/api/auth/logout", async (req, res) => {
  try {
    let access_token = req.query.token;
    const userInfoResponse = await fetch(
      "https://accounts.google.com/o/oauth2/revoke",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: querystring.stringify({
          token: access_token,
        }),
      }
    );
    if (userInfoResponse.status == 200) {
      const userInfo = await userInfoResponse.json();
      res.status(200).json(userInfo);
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
