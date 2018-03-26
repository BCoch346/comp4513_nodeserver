const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const parser = require('body-parser');
const PORT = process.env.PORT || 5000
const URI = 'mongodb://heroku_vsgzfrzr:nal10hsrqpa59sa0r9jh0ln3bf@ds213209.mlab.com:13209/heroku_vsgzfrzr';

//-----------------------------------------------
// set database connection using mongoose
//-----------------------------------------------
mongoose.connect(URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("connected to mongo");
});

//-----------------------------------------------
// Create express app object
//-----------------------------------------------
var app = express();
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

//-----------------------------------------------
//define Schemas for database using mongoose
//-----------------------------------------------
var companySchema = new mongoose.Schema({
    symbol: String,
    name: String,
    sector: String,
    subindustry: String,
    address: String,
    date_added: String,
    CIK: Number,
    frequency: Number
});

var portfolioSchema = new mongoose.Schema({
    id: Number,
    symbol: String,
    user: Number,
    owned: Number
});

var priceSchema = new mongoose.Schema({
    date: String,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
    name: String
});

var userSchema = new mongoose.Schema({
    id: Number,
    first_name: String,
    last_name: String,
    email: String,
    salt: String,
    password: String
});
//-----------------------------------------------
// “compile” the database schema into a model
//-----------------------------------------------
var Company = mongoose.model('company', companySchema, 'companies');
var Portfolio = mongoose.model('portfolio', portfolioSchema, 'portfolio');
var Price = mongoose.model('price', priceSchema, 'prices');
var User = mongoose.model('user', userSchema, 'users');

require('./users-server.js')(app, User);
require('./prices-server.js')(app, Price);
require('./portfolio-server')(app, Portfolio);
require('./companies-server.js')(app, Company);