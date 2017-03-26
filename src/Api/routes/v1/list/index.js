/**
 * Created by gbu on 12/02/2017.
 */
/**
 * Created by omer on 28/12/2016.
 */
import UserService from '../../../../Services/Userlist';
import Userlist from '../../../../Models/Userlist';

module.exports = function (app) {

    app.get('/v1/userlist/userlists', (req, resp) => {
        let userId = req.query.userId;
        UserService.getListsOfUser(userId)
            .then((list) => {
                resp.json(list);
            });
    });

    app.get('/v1/userlist/series', (req, resp) => {
        let listId = req.query.listId;
        UserService.getSeries(listId)
            .then((list) => {
                resp.json(list);
            });
    });

    app.get('/v1/userlist/movies', (req, resp) => {
        let listId = req.query.listId;
        UserService.getMovies(listId)
            .then((list) => {
                resp.json(list);
            });
    });

    app.get('/v1/userlist/all', (req, resp) => {
        let listId = req.query.listId;
        UserService.getAllMedia(listId)
            .then((list) => {
                resp.json(list);
            });
    });

    app.post('/v1/userlist/newlist', (req, res) => {
        const list = new Userlist({
            userId: req.body.userId,
            movies: req.body.movies,
            series: req.body.series,
            listName: req.body.listName,
            isPrivate: req.body.isPrivate
        });
        UserService.create(list)
            .then((created) => {
                res.json(created);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            });
    });

    app.post('/v1/userlist/removelist', (req, res) => {
        let listId = req.body.id;

        UserService.delete(listId)
            .then((user) => {
                res.json(user);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            })
    });

    app.post('/v1/userlist/changename', (req, res) => {
        let listId = req.body.id;
        let newName = req.body.newName;

        UserService.setListName(listId, newName)
            .then((list) => {
                res.json(list);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            })
    });

    app.put('/v1/userlist/changestatus', (req, res) => {
        let listId = req.body.id;
        let newStatus = req.body.newStatus;

        UserService.setStatus(listId, newStatus)
            .then((list) => {
                res.json(list);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            })
    });

    app.post('/v1/userlist/addmovie', (req, res) => {
        let listId = req.body.id;
        let movieId = req.body.movieId;

        UserService.addMovieToList(movieId, listId)
            .then((user) => {
                res.json(user);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            })
    });

    app.post('/v1/userlist/addseries', (req, res) => {
        let listId = req.body.id;
        let seriesId = req.body.seriesId;

        UserService.addSeriesToList(seriesId, listId)
            .then((list) => {
                res.json(list);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            })
    });

    app.post('/v1/userlist/removemovie', (req, res) => {
        let listId = req.body.id;
        let movieId = req.body.movieId;

        UserService.removeMovieFromTheList(movieId, listId)
            .then((list) => {
                res.json(list);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            })
    });

    app.post('/v1/userlist/removeseries', (req, res) => {
        let listId = req.body.id;
        let seriesId = req.body.seriesId;

        UserService.removeSeriesFromTheList(listId, seriesId)
            .then((list) => {
                res.json(list);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            })
    });
};