/**
 * Created by omer on 14/12/2016.
 */
import Login from '../../../../Services/User/Login';
import User from '../../../../Models/User';

module.exports = function (app) {
    app.post('/v1/auth/login', (req, res) => {
        let username = req.body.username;
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

    app.post('/v1/auth/followseries', (req, res) => {
        let id = req.body.id;
        let seriesId = req.body.seriesId;

        Login.followSeries(id, seriesId)
            .then((user) => {
                res.json(user);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            })
    });

    app.post('/v1/auth/followmovie', (req, res) => {
        let id = req.body.id;
        let movieId = req.body.movieId;

        Login.followMovie(id, movieId)
            .then((user) => {
                res.json(user);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            })
    });

    app.post('/v1/auth/followuser', (req, res) => {
        let id = req.body.id;
        let followedId = req.body.followedId;

        Login.followUser(id, followedId)
            .then((user) => {
                res.json(user);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            })
    });

    app.post('/v1/auth/unfollowuser', (req, res) => {
        let id = req.body.id;
        let followedId = req.body.followedId;

        Login.unfollowUser(id, followedId)
            .then((user) => {
                res.json(user);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            })
    });

    app.post('/v1/auth/unfollowmovie', (req, res) => {
        let id = req.body.id;
        let movieId = req.body.movieId;

        Login.unfollowMovie(id, movieId)
            .then((user) => {
                res.json(user);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            })
    });

    app.post('/v1/auth/unfollowseries', (req, res) => {
        let id = req.body.id;
        let seriesId = req.body.seriesId;

        Login.unfollowSeries(id, seriesId)
            .then((user) => {
                res.json(user);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            })
    });

    app.get('/v1/auth/followers', (req, resp) => {
        let userId = req.query.id;
        Login.getFollowers(userId)
            .then((list) => {
                resp.json(list);
            });
    });

    app.get('/v1/auth/following', (req, resp) => {
        let userId = req.query.id;
        Login.getFollowing(userId)
            .then((list) => {
                resp.json(list);
            });
    });

    app.get('/v1/auth/movies', (req, resp) => {
        let userId = req.query.id;
        Login.getFollowedMovies(userId)
            .then((list) => {
                resp.json(list);
            });
    });

    app.get('/v1/auth/series', (req, resp) => {
        let userId = req.query.id;
        Login.getFollowedSeries(userId)
            .then((list) => {
                resp.json(list);
            });
    });



};