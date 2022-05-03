require("dotenv").config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const md5 = require('md5');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save((err) => {
        if(err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);
    User.findOne({email: username}, (err, foundUser) => {
        if(err) {
            console.log(err);
        } else{
            if(foundUser) {
                if(foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    });
});

app.get("/logout", (req, res) => {
    res.render("home");
});









//<---------------Server port initialization-------------->//

let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}
app.listen(port, () => {
    console.log("server started at " + port);
});