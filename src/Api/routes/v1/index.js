/**
 * Created by omer on 06/12/2016.
 */
import Login from '../../../Services/User/Login';
import User from '../../../Models/User';

module.exports = function (app) {
    app.get('/v1/hello-world', (req, res) => {
        res.json({
            hello: 'world'
        });
    });

    app.get('/v1/usertest', (req, res) => {
        Login.login("deathstar@gmail.com", "1234")
            .then( (result) => {
                console.log(result);
                res.json({
                    hello: 'world'
                });

            })
            .catch( (error) => {
                console.log(error);
                res.json({
                    hello: 'world'
                });
            });
    });

    app.get('/v1/adduser', (req, res) => {

        const user = new User({
            name: 'Jon Snow',
            username: 'stark',
            email: 'deathstar@gmail.com',
            password: '1234',
            activated: true,
            apiID: '1'
        });
        Login.register(user)
            .then((user) => {
                console.log(user);
                res.json({
                    hello: 'world'
                });
            })
            .catch((error) => {
            console.log(error);
                res.json({
                    hello: 'world'
                });
            });
    });
};