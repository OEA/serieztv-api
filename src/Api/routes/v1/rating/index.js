/**
 * Created by gbu on 20/02/2017.
 */

import RatingService from '../../../../Services/Rating';
import Rating from '../../../../Models/Rating';

module.exports = function (app) {

    app.post('/v1/rating/newrating', (req, res) => {
        const rating = new Rating({
            userId: req.body.userId,
            movie: req.body.movie,
            series: req.body.series,
            rating: req.body.rating
        });
        RatingService.create(rating)
            .then((created) => {
                res.json(created);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            });
    });

    app.post('/v1/rating/removerating', (req, res) => {
        let ratingId = req.body.id;
        RatingService.delete(ratingId)
            .then((rating) => {
                res.json(rating);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            })
    });

    app.post('/v1/rating/updaterating', (req, res) => {
        let ratingId = req.body.id;
        let newRating = req.body.newRating;

        RatingService.updateRatingOf(ratingId, newRating)
            .then((rating) => {
                res.json(rating);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            })
    });

    app.get('/v1/rating/ratedmoviesof', (req, resp) => {
        let userId = req.query.userId;
        RatingService.getRatedMoviesOfUser(userId)
            .then((ratings) => {
                resp.json(ratings);
            });
    });

    app.get('/v1/rating/ratedseriesof', (req, resp) => {
        let userId = req.query.userId;
        RatingService.getRatedSeriesOfUser(userId)
            .then((ratings) => {
                resp.json(ratings);
            });
    });

    app.get('/v1/rating/getrateforseries', (req, resp) => {
        let userId = req.query.userId;
        let seriesId = req.query.seriesId;
        RatingService.getRateForSeries(seriesId, userId)
            .then((rating) => {
                resp.json(rating);
            });
    });

    app.get('/v1/rating/getrateformovies', (req, resp) => {
        let userId = req.query.userId;
        let movieId = req.query.movieId;
        RatingService.getRateForMovie(movieId, userId)
            .then((rating) => {
                resp.json(rating);
            });
    });

    app.get('/v1/rating/mostratedmovies', (req, resp) => {
        let limit = req.query.limit;
        if (limit) {
            RatingService.getMostRatedMovies(Number(limit))
                .then((movies) => {
                    resp.json(movies);
                });
        } else {
            RatingService.getMostRatedMovies()
                .then((movies) => {
                    resp.json(movies);
                });
        }
    });

    app.get('/v1/rating/mostratedseries', (req, resp) => {
        let limit = req.query.limit;
        if (limit) {
            RatingService.getMostRatedSeries(Number(limit))
                .then((series) => {
                    resp.json(series);
                });
        } else {
            RatingService.getMostRatedSeries()
                .then((series) => {
                    resp.json(series);
                });
        }
    });

    app.get('/v1/rating/mostratedmoviesofuser', (req, resp) => {
        let limit = req.query.limit;
        let userId = req.query.userId;
        if (limit) {
            RatingService.getMostRatedMoviesOfUser(userId, Number(limit))
                .then((movies) => {
                    resp.json(movies);
                });
        } else {
            RatingService.getMostRatedMoviesOfUser(userId)
                .then((movies) => {
                    resp.json(movies);
                });
        }
    });

    app.get('/v1/rating/mostratedseriesofuser', (req, resp) => {
        let limit = req.query.limit;
        let userId = req.query.userId;
        if (limit) {
            RatingService.getMostRatedSeriesOfUser(userId, Number(limit))
                .then((series) => {
                    resp.json(series);
                });
        } else {
            RatingService.getMostRatedSeriesOfUser(userId)
                .then((series) => {
                    resp.json(series);
                });
        }
    });
};