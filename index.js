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

//home page view
app.get('/', function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h1>COMP 4513 Assignment 2</h1>");
    res.write("<div><h2>Contributors</h2><ul><li>George Chase</li><li>Brandon Cochrane</li><li>Jorge Castano Dominguez<li><li>Catie Vickers</li></ul></div>");
    res.write("<div>");
    res.write("<h1>Test Links:</h1> \n");
    res.write("<ul>");
    //res.write("<li><a href=''> </a></li>");
    res.write("<li><a href='/api/company/all'>/api/company/all</a></li>");
    res.write("<li><a href='/api/stocks/AMZN'>/api/stocks/:symbol => symbol = AMZN </a></li>");
    res.write("</ul>");
    res.write("</div>");
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