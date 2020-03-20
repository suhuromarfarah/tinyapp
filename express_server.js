const express = require("express");
const app = express();
const PORT = 5000; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

let cookieParser = require('cookie-parser');
app.use(cookieParser());

const users = {}

app.set("view engine", "ejs");

const generateRandomString = () => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var numChar= characters.length;
  for ( let i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * numChar));
  }
  return result;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function checkUserEmail(emailAddress) {
  for (const user in users) {
    if (users[user].email === emailAddress) {
      return true;
    }
  }
  return false;
};

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

app.get("/users.json", (req, res) => {
  res.json(users);
});

app.get("/urls", (req, res) => { //changing this to:
  const user = users[req.cookies["user_id"]];
  if (user) {
    let templateVars = {
    urls: urlDatabase,
    user
  };
  res.render("urls_index", templateVars);
} else {
  res.redirect("/register");
}
});

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.get("/urls/new", (req, res) => {
  // let templateVars = {
  //   user: req.cookies['user']
  // };
  // res.render("urls_new", templateVars);
  const user = users[req.cookies["user_id"]];
  let templateVars = {
    user
  };
  res.render("urls_new", templateVars)
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    user: req.cookies["user"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars)
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`urls/${shortURL}`)
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies["user_id"]];
  let templateVars = {
    user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  res.render("urls_register", { user: undefined });
});

app.post("/register", (req, res) => {
  if(checkUserEmail(req.body.email)) {
    res.sendStatus(400);
  }
  console.log(Object.values(users));
  const id = generateRandomString();
  users[id] = {id, email: req.body.email, password: req.body.password};
  if (users[id].email === "" || users[id].password === "") {
    res.send(`Enter your email & password. Statuscode:${res.sendStatus(400)}`);
  } else {
    res.cookie("user_id", users[id].id);
    res.redirect("/urls");
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")
})

app.get("/login", (req, res) => {
  res.render("urls_login", {user: undefined});
});

app.post("/login", (req, res) => {
  if (checkUsersEmail(req.body.email)) {
    for (let id in users) {
      if (users[id].email === req.body.email && users[id].password === req.body.password) {
        res.cookie("user_id", users[id].id);
        res.redirect("/urls");
      }
    }
  }
  res.sendStatus(403);
});


app.post("/logout", (req, res) => {
  res.clearCookie("user_id", users[req.cookies["user_id"]]);
  res.redirect("/login");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
