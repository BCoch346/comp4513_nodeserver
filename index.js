const mongoose = require('mongoose');
const express = require('express')
const path = require('path')
const parser = require('body-parser')
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



//-----------------------------------------------
// Define views
//-----------------------------------------------

/*home page view*/
app.get('/', function(req, response) {
    homeMarkup(response);
});

/*api index*/
/*shows list of api calls available*/
app.get('/api', function(req, response) {
    apiIndex(response);
});
app.get('/api/index', function(req, response) {
    apiIndex(response);
});
/*list of requirements and their status*/
app.get('/api/tests', function(req, response) {
    apiTests(response);
});


//-----------------------------------------------
// Web Services
//-----------------------------------------------

// return all company data
app.get('/api/company', function(req, res) {
    Company.find({}, function(err, data) {
        console.log('data: ' + data);
        if (err) {
            res.json({ message: "Unable to connect to company" });
        } else {
            res.json(data);
        }
    });
});

//Given an email and password, return the id, first name, and last name if credential information is correct. 
// '/api/login/:email/:password'

//Given a stock symbol, return the company information for it.
app.get('/api/company/:symbol', function(req, res) {
    Company.find({ symbol: req.params.symbol }, function(err, data) {
        console.log('data: ' + data);
        if (err) {
            res.json({ message: "Unable to find company with symbol" });
        } else {
            res.json(data);
        }
    });
});


//Given a stock symbol and a month, return the price information for each day in the specified month.
app.get('/api/price/stock/:symbol/month/:date', function(req, res) {
    Price.find({
        'name': req.params.symbol,
        'date': new RegExp(req.params.date)
    }, function(err, data) {
        console.log(data);
        if (err) {
            res.json({ message: 'price not found' });
        } else {
            res.json(data);
        }
    });
});

//Given a stock symbol, return the average close value for each month in the year.
// '/api/value/:symbol/:year'
app.get('/api/value/:symbol/:year', function(req, res) {
    Price.aggregate([
            { $match: { name: req.params.symbol, 'date': new RegExp(req.params.year) } },
            {
                "$group": {
                    "_id": "$date",
                    "Avgclose": { "$avg": "$close" },
                    "Symbol": { "$first": "$name" }

                }
            }
        ])
        .exec(function(err, data) {
            console.log(data);
            if (err) {
                res.json({ message: 'price not found' });
            } else {
                res.json(data);
            }
        });

});

//Given a stock symbol and a date, return the price information for that date.
// /api/price/:symbol/:date
app.get('/api/price/:symbol/:date', function(req, res) {
    Price.find({ name: req.params.symbol, date: new RegExp(req.params.date) }, function(err, data) {
        console.log(data);
        if (err) {
            res.json({ message: 'price not found' });
        } else {
            res.json(data);
        }
    });
});
//Given a stock symbol, return the latest price information. This will return the price information with the newest date (in our data that will be late December).
// '/api/symbol/:symbol/price/latest

//Given a user id, return all the portfolio information for that user. A given company can appear multiple times in a user’s portfolio (perhaps representing separate individual purchases).
// '/api/user/:id/portfolio

//Given a user id, return a percentage summary of the portfolio information for that user. That is, provide a list of each stock in that user’s portfolio along with a percentage number that expresses the percentage of that stock in terms of the total number of stocks owned. For instance, user A, owns 200 of AMZN, 100 of GOOG, 300 of AAL, and 700 of ABC, then this service would return AMZN, .1538; GOOG, .0769; AAL, .2308; ABC, .5385 (though of course it would need to be formatted as JSON).
// '/api/summary/percentage'


//Return list of all companies (just stock symbol and company name).
app.get('/api/companies', function(req, res) {
    Company.find({}, 'symbol name', function(err, data) {
        console.log('data: ' + data);
        if (err) {
            res.json({ message: "Unable to retreive stock information with symbol" });
        } else {
            res.json(data);
        }
    });
});


//-----------------------------------------------
// markup
//-----------------------------------------------

var homeMarkup = function(response) {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write("<h1>COMP 4513 Assignment 2</h1>");
    response.write("<div><h2>Contributors</h2><ul><li>George Chase</li><li>Brandon Cochrane</li><li>Jorge Castano Dominguez</li><li>Catie Vickers</li></ul></div>");
    apiIndex(response);
    apiTests(response);
    response.end();
};

var apiIndex = (response) => {
    response.write("<div>");
    response.write("<h2>API Calls:</h2> \n");
    response.write("<ul>");
    //res.write("<li><a href=''> </a></li>");
    response.write("<li><a href='/api/company'>/api/company/all</a></li>");
    response.write("<li><a href='/api/stock/AMZN'>/api/stock/:symbol = AMZN </a></li>");
    response.write("<li><a href='/api/company/AMZN'>/api/company/:symbol = AMZN </a></li>");
    response.write("<li><a href='/api/stock/:symbol/month/:month'>/api/stock/:symbol = AMZN /month/:month = 3</a></li>");
    response.write("<li><a href='/api/price/APPL/2017-01-03'>/api/price/:symbol = AAPL/:date = 2017-01-03 </a></li>");
    response.write("<li><a href='/api/companies'>/api/companies </a></li>");
    response.write("<li><a href=''> </a></li>");
    response.write("<li><a href=''> </a></li>");
    response.write("<li><a href=''> </a></li>");
    response.write("</ul>");
    response.write("</div>");
};

var apiTests = (response) => {
    response.write("<div>");
    response.write("<h2>API Calls:</h2> \n");
    response.write("<table>");
    //res.write("<li></li>");
    response.write("<tr><th> Pass/Fail </th><th> Requirement </th></tr>");
    response.write("<tr><td></td><td>a.	Given an email and password, return the id, first name, and last name if credential information is correct. </td></tr>");
    response.write("<tr><td> Pass </td><td>b.	Given a stock symbol, return the company information for it.</td></tr>");
    response.write("<tr><td>      </td><td>c.	Given a stock symbol and a month, return the price information for each day in the specified month. </td></tr>");
    response.write("<tr><td>      </td><td>d.	Given a stock symbol, return the average close value for each month in the year. </td></tr>");
    response.write("<tr><td> Pass </td><td>e.	Given a stock symbol and a date, return the price information for that date. </td></tr>");
    response.write("<tr><td>      </td><td>f.	Given a stock symbol, return the latest price information. This will return the price information with the newest date (in our data that will be late December). </td></tr>");
    response.write("<tr><td>      </td><td>g.	Given a user id, return all the portfolio information for that user. A given company can appear multiple times in a user’s portfolio (perhaps representing separate individual purchases). </td></tr>");
    response.write("<tr><td>      </td><td>h.	Given a user id, return a percentage summary of the portfolio information for that user. That is, provide a list of each stock in that user’s portfolio along with a percentage number that expresses the percentage of that stock in terms of the total number of stocks owned. </td></tr>");
    response.write("<tr><td> Pass </td><td>i.	Return list of all companies (just stock symbol and company name). </td></tr>");
    response.write("</table>");
    response.write("</div>");
}