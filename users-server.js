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
    app.post('/api/user', function (req, resp) {
            console.log(req.body);
            User.find({email: req.body.email}, 'salt -_id', function(err, data) {
                if(err) {
                    resp.json({ message: 'error!' });
                }
                if(!data.length) {
                    resp.json({ message: 'Email does not exist!'});
                }
                else {
                    console.log("found user")
                    //user exists and salt and password combined and hashed
                    var userSalt = data[0]['salt'];
                    console.log(req.body.password + " " + userSalt)
                    var saltAndPass = md5(req.body.password + userSalt, "hex");
                    console.log(saltAndPass);
                    //match the value to password in user collection
                    User.find({email: req.body.email, password: saltAndPass}, 'id first_name last_name -_id', function(err, match) {
                        if(err) {
                            resp.json({ message: 'error!'});
                        }
                        if(!match.length) {
                            resp.json({ message: 'Password does not match! Authentication failed!'});
                        }
                        else {
                            console.log("found passwd")
                            resp.json(match);
                        }
                    })
                }
            });
        });
}
