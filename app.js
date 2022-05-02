const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

















//<---------------Server port initialization-------------->//

let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}
app.listen(port, () => {
    console.log("server started at " + port);
});