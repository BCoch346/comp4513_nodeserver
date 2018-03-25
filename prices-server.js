var mongoose = require('mongoose');
var express = require('express');
var parser = require('body-parser');

module.exports = function(app, Price) {

    app.route('/api/prices') //just the default route showing all data (makes sure we are getting data)
        .get(function(req, resp) {
            Price.find({}, function(err, data) {
                if (err) {
                    resp.json({ message: 'Unable to connect to price' });
                } else {
                    resp.json(data);
                }
            });
        });

    app.route('/api/prices/:symbol/:month') //get price info for each day in the month (question c.) still need to do, will need to regex the month out of the date and match (the actual regex to get month out is (?<=^[^-]+-)[^-]+ but i need to match based on param)
        .get(function(req, resp) {
            // Price.find({ date: new RegExp('\d+\-' + req.params.month, "i"), name: req.params.symbol },  function(err, data) {
            //Price.find({ date: /\d{4}-01/i , name: req.params.symbol }, function(err, data) {
            var month = req.params.month;
            var pattern = "\\d{4}-";
            var patAndMonth = pattern + month;
            Price.find({ date: new RegExp(patAndMonth), name: req.params.symbol }, function(err, data) {
                if (err) {
                    resp.json({ message: 'Unable to connect to price' });
                } else {
                    resp.json(data);
                }
            });
        });

    app.route('/api/prices/average/:symbol') //get average close value for each month in the year (question d.) still need to do, requires me to grab all the close values in each month and average them
        .get(function(req, resp) {
            Price.find({ name: req.params.symbol }, function(err, data) {
                if (err) {
                    resp.json({ message: 'Unable to connect to price' });
                } else {
                    resp.json(data);
                }
            });
        });
    
    app.route('/api/prices/:symbol/:date') //get price information for that date (question e.) Done
        .get(function (req, resp) {
            Price.find({name: req.params.symbol, date: new RegExp(req.params.date)}, function(err, data) {
                if(err) {
                    resp.json({ message: 'Unable to connect to price' });
                }
                else {
                    resp.json(data);
                }
            });
        });

    app.route('/api/prices/latest/:symbol') //get latest price information for that symbol (question f.) not complete yet
        .get(function(req, resp) {
            Price.aggregate({ $match: { name: req.params.symbol } }, { $group: { "symbol": { "$first": "$name" } } }, function(err, data) {
                if (err) {
                    resp.json({ message: 'Unable to connect to price' });
                } else {
                    resp.json(data);
                }
            });
        });
        
    }
