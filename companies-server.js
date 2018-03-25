
module.exports = function(app, Company) {


    //just the default route showing all data (makes sure we are getting data)
    app.route('/api/companies') 
        .get(function (req, resp) {
            Company.find({}, function(err, data) {
                if(err) {
                    resp.json({ message: 'Unable to connect to companies' });
                }
                else {
                    resp.json(data);
                }
            });
    });

    //just the list of all companies with symbol and name (question i) done
    app.route('/api/companies/list') 
        .get(function (req, resp) {
            Company.find({}, 'symbol name -_id', function(err, data) {
                if(err) {
                    resp.json({ message: 'Unable to connect to companies' });
                }
                else {
                    resp.json(data);
                }
            });
    });
    
    //getting the company information for a single symbol (question b) is complete
    app.route('/api/companies/:symbol') 
        .get(function (req, resp) {
            Company.find({symbol: req.params.symbol}, function(err, data) {
                if(err) {
                    resp.json({ message: 'Unable to connect to companies' });
                }
                else {
                    resp.json(data);
                }
            });
    });
    
}