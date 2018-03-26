module.exports = function(app, Portfolio) {
    
    //just the default route showing all data (makes sure we are getting data)
    app.route('/api/portfolio') 
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
    
    //get the users portfolio information based on user id (question g.) still needs to be completed
    app.route('/api/portfolio/userInfo/:user') 
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
    
    //get the users portfolio information as a percentage for each stock based on user id (question h.) still needs to be completed 
    app.route('/api/portfolio/summary/:user')
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