var mongoose = require('mongoose');
var express = require('express');
var parser = require('body-parser');

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

// AMZN stock route route.
app.get('/test', function(req, res) {
    Company.find({}, function(err, data) {
        console.log('data: ' + data);
        if (err) {
            res.json({ message: "Unable to connect to company" });
        } else {
            res.json(data);
        }
    });
});

let port = 8080;
app.listen(port, function() {
    console.log("Server is running at port: " + port);
});