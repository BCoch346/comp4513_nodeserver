var md5 = require('crypto-md5');

module.exports = function(app, User) {
 
    //authentication sending back id, first, last if correct
    app.route('/api/users') 
        .get(function(req, resp) {
            User.find({}, function(err, data) {
                if (err) { //if checked and email is not found then it doesn't exist
                    resp.json({ message: 'Email does not exist' });
                } else {
                    resp.json(data);
                }
            });
        });
        
    //authentication sending back id, first, last if correct (question a.) is working
    app.post('/api/user/:email/:password', function (req, resp) {
            User.find({email: req.params.email}, 'salt -_id', function(err, data) {
                if(err) {
                    resp.json({ message: 'error!' });
                }
                if(!data.length) {
                    resp.json({ message: 'Email does not exist!'});
                }
                else {
                    //user exists and salt and password combined and hashed
                    var userSalt = data[0]['salt'];
                    var saltAndPass = md5(req.params.password + userSalt, "hex");
                    
                    //match the value to password in user collection
                    User.find({email: req.params.email, password: saltAndPass}, 'id first_name last_name -_id', function(err, match) {
                        if(err) {
                            resp.json({ message: 'error!'});
                        }
                        if(!match.length) {
                            resp.json({ message: 'Password does not match! Authentication failed!'});
                        }
                        else {
                            resp.json(match);
                        }
                    })
                }
            });
        });
}
