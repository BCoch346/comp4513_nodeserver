var mongoose = require('mongoose');
const express = require('express')
const path = require('path')
const parser = require('body-parser')
const PORT = process.env.PORT || 5000

var URI = 'mongodb://heroku_vsgzfrzr:nal10hsrqpa59sa0r9jh0ln3bf@ds213209.mlab.com:13209/heroku_vsgzfrzr';
mongoose.connect(URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("connected to mongo");
});

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



// “compile” the schema into a model
var Company = mongoose.model('company', companySchema);

var app = express();
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));


app.get('/', function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("Hello this is our COMP 4513 Assignment 2\n");
    res.write("<h1>Test Links:</h1> \n");
    res.write("<a href='/api/company/all'>/api/company/all</a>");
    res.end();
});
// AMZN stock route route.
app.get('/api/company/all', function(req, res) {
    Company.find({}, function(err, data) {
        console.log('data: ' + data);
        if (err) {
            res.json({ message: "Unable to connect to company" });
        } else {
            res.json(data);
        }
    });
});

// AMZN stock route route.
app.get('/api/stocks/:symbol', function(req, res) {
    Company.find({ symbol: req.params.symbol }, function(err, data) {
        console.log('data: ' + data);
        if (err) {
            res.json({ message: "Unable to connect to company" });
        } else {
            res.json(data);
        }
    });
});

let port = 8080;
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));