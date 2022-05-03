require("dotenv").config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret: "SecretPhrase",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/secrets", (req, res) => {
    if(req.isAuthenticated()) {
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
});

app.post("/register", (req, res) => {
    User.register({username: req.body.username}, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req,res, () => {
                res.redirect("/secrets");
            });
        }
    })
});

app.post("/login", (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, (err) => {
        if(err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req,res, () => {
                res.redirect("/secrets");
            });
        }
    })
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});









//<---------------Server port initialization-------------->//

let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}
app.listen(port, () => {
    console.log("server started at " + port);
});