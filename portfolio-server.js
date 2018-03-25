var mongoose = require('mongoose');
var express = require('express');
var parser = require('body-parser');

module.exports = function(app, Portfolio) {
    
    
    app.route('/api/portfolio') //just the default route showing all data (makes sure we are getting data)
        .get(function (req, resp) {
            Portfolio.find({}, function(err, data) {
                if(err) {
                    resp.json({ message: 'Unable to connect to portfolio' });
                }
                else {
                    resp.json(data);
                }
            });
        });
        
    app.route('/api/portfolio/userInfo/:user') //get the users portfolio information based on user id (question g.) still needs to be completed
        .get(function (req, resp) {
            Portfolio.find({user: req.params.user}, function(err, data) {
                if(err) {
                    resp.json({ message: 'Unable to connect to portfolio' });
                }
                else {
                    resp.json(data);
                }
            });
        });
        
    app.route('/api/portfolio/summary/:user') //get the users portfolio information as a percentage for each stock based on user id (question h.) still needs to be completed
        .get(function (req, resp) {
            Portfolio.find({user: req.params.user}, function(err, data) {
                if(err) {
                    resp.json({ message: 'Unable to connect to portfolio' });
                }
                else {
                    resp.json(data);
                }
            });
        });
    
};