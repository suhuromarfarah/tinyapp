const express = require("express");
const app = express();
const PORT = 5000; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
// const hashedPassword = bcrypt.hashSync(password, 10);
const { generateRandomString, getUserByEmail, urlsForUser} = require("./helpers.js");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: "session",
  keys: ["user_id"],
}));


const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

// function checkUserEmail(emailAddress) {
//   for (const user in users) {
//     if (users[user].email === emailAddress) {
//       return true;
//     }
//   }
//   return false;
// };

app.get("/", (req, res) => {
  res.redirect("/urls/");
});

app.get("/users.json", (req, res) => {
  res.json(users);
});

// new short url
app.get("/urls/new", (req, res) => {
  // let templateVars = {
  //   user: req.cookies['user']
  // };
  // res.render("urls_new", templateVars);
  const user = users[req.session.user_id];
  if (user) {
    let templateVars = {
      user
    };
    res.render("urls_new", templateVars)
  } else {
    res.redirect("/login")
  }
});

// fixed deleted entry
app.delete("/urls/:shortURL", (req, res) => {
  const user = uers[req.session_id]
  const shortURL = req.params.shortURL;

  if (user.id === userDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    res.redirect("/login"); 
  }
});

app.put("/urls/:shortURL", (req, res) => {
  const user = users[req.session.user_id];
  const shortURL = req.params.shortURL;
  if (urlsForUser(user.id, urlDatabase)[shortURL].userID === urlDatabase[shortURL].userID) {
    urlDatabase[shortURL].longURL = req.body.longURL;
    res.redirect("/urls");
  } else {
    res.redirect("/urls");
  }
});

//redirection
app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.session.user_id];
  let templateVars = {
    user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  // const user = users[req.session.user_id];
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`urls/${shortURL}`)
});

// shorturl + longurl pairs
app.get("/urls", (req, res) => { //changing this to:
  const user = users[req.session.user_id];
  if (user) {
    let templateVars = {
    urls: urlsForUser(user.id, urlDatabase),
    user
  };
  res.render("urls_index", templateVars);
} else {
  res.redirect("/login");
}
});

app.get("/register", (req, res) => {
  res.render("urls_register", { user: undefined });
});

// if true .. register .. if not .. error
app.post("/register", (req, res) => {
  if (getUserByEmail(req.body.email, users)) {
    res.status(400).send("User already exists.");
    return;
  } else if (req.body.email === "" || req.body.password === "") {
    res.send(`Enter your email & password. Statuscode:${res.sendStatus(400)}`);
  } else {
    // console.log(Object.values(users));
    const hashedPassword = bcrypt.hashSync
    (req.body.password, 10);
    const id = generateRandomString();
    users[id] = {id, email: req.body.email, password: hashedPassword};
    req.session.user_id = users[id].id;
    res.redirect("/urls");
  }
});


// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });


app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  // const shortURL = req.params.shortURL;
  res.redirect(longURL);
});



app.get("/login", (req, res) => {
  res.render("urls_login", {user: undefined});
});

app.post("/login", (req, res) => {
  const user = getUserByEmail(req.body.email, users)
  if (user) {
      if (users[user].email === req.body.email && bcrypt.compareSync(req.body.password, users[user].password)) {
        req.session.user_id =  users[user].id;
        res.redirect("/urls");
        return;
      }
      res.status(403).send('The email and/or password is incorrect.');
  }
  res.status(403).send('Account does not exist.');
});


app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
