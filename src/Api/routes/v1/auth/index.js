/**
 * Created by omer on 14/12/2016.
 */
import Login from '../../../../Services/User/Login';
import User from '../../../../Models/User';

module.exports = function (app) {
    app.post('/v1/auth/login', (req, res) => {
        let username = req.body.username.toLowerCase();
        let password = req.body.password;

        Login.login(username, password)
            .then((user) => {
                res.json(user);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            })

    });

    app.post('/v1/auth/register', (req, res) => {
        //Will add middleware to check required fields
        const user = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password, //will encrypt with bcrypt for mongoose
            activated: true
        });
        Login.register(user)
            .then((user) => {
                res.json(user);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            });
    });

};