require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {hash} = require("bcrypt");
mongoose.set('strictQuery', true);
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const saltRounds = 10;

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    emailAddress: String,
    password: String
});

const User = new mongoose.model("user", userSchema);

app.get("/", function (req, res) {
    res.render("home");
})

app.get("/login", function (req, res) {
    res.render("login");
})

app.get("/register", function (req, res) {
    res.render("register");
})

app.post("/register", function (req, res) {

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({
            emailAddress: req.body.username,
            password: hash
        });
        newUser.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });
});

app.post("/login", function (req, res) {

    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({emailAddress: userName}, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    if (result === true) {
                        res.render("secrets");
                    }
                });
            }
        }
    });
});

app.listen(3000, function () {
    console.log("server start on port 3000");
});
