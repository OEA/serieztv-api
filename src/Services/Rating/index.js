/**
 * Created by gbu on 20/02/2017.
 */
import mongoose from 'mongoose';
import User from '../../Models/User';
import Promise from 'bluebird';
import Rating from '../../Models/Rating.js';

Promise.promisifyAll(mongoose);

const RatingErrorMessages = {
    RATING_ALREADY_EXISTS: "Rating already exists",
    CANNOT_CREATE_RATING: "Could not create rating",
    RATING_NOT_EXIST: "Rating does not exist"
};

class RatingService {

    static create(rating) {
        return new Promise((resolve, reject) => {
            rating.save((error) => {
                if (error) {
                    console.log(error);
                    reject(RatingErrorMessages.CANNOT_CREATE_RATING);
                } else {
                    resolve(rating);
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            Rating.find({_id: id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(RatingErrorMessages.RATING_NOT_EXIST);
                }
            }).then((res) => {
                Rating.findOneAndRemove({_id: id}, (error, rating) => {
                    if (error) {

                    } else {
                        resolve(rating);
                    }
                });
            });

        });
    }

    static updateRatingOf(id, newRating) {
        return new Promise((resolve, reject) => {
            Rating.findOneAndUpdate({_id: id}, {rating: newRating}, {new: true}, (err, result) => {
                if (err) {
                    reject(err);
                }  else {
                    resolve(result);
                }
            });
        });
    }

    static getRateForSeries(seriesId, userId) {
        return new Promise((resolve, reject) => {
            Rating.find({userId: userId, series: seriesId}, (error, rating) => {
                if (error) {
                    reject(error);
                } else {
                    console.log(rating)
                    resolve(rating);
                }
            });
        });
    }

    static getRateForMovie(movieId, userId) {
        return new Promise((resolve, reject) => {
            Rating.find({userId: userId, movie: movieId}, (error, rating) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(rating);
                }
            });
        });
    }


    static getRatedSeriesOfUser(userId) {
        return new Promise((resolve, reject) => {
            Rating.find({userId: userId, series: {$ne: null}}).populate([{path: 'series'}]).exec((error, list) => {
                    Rating.populate(list, ([{path: 'series.characters', model: 'Character'}, {path: 'series.genres', model: 'Genre'},
                        {path: 'series.seasons', model: 'Season'}]), (err, userList) => {
                        Rating.populate(userList, ([{path: 'series.characters.star', model: 'Star'},
                            {path: 'series.seasons.episodes', model: 'Episode'}]), (err, seriesArray) => {
                            if (err) {
                                reject(error);
                            } else {
                                resolve(seriesArray);
                            }
                        });
                    });
            });
        });
    }

    static getRatedMoviesOfUser(userId) {
        return new Promise((resolve, reject) => {
            Rating.find({userId: userId, movie: {$ne: null}}).populate([{path: 'movie', model: 'Movie'}]).exec((error, list) => {
                    Rating.populate(list, ([{
                            path: 'movie.characters', model: 'Character'}, {path: 'movie.genres', model: 'Genre'}]),
                        (err, userList) => {
                            Rating.populate(userList, ({
                                path: 'movie.characters.star',
                                model: 'Star'
                            }), (err, movies) => {
                                if (err) {
                                    reject(error);
                                } else {
                                    resolve(movies);
                                }
                            });
                        });
            });
        });
    }

    static getMostRatedMovies(limit = 10) {
        return new Promise((resolve, reject) => {
            Rating.find({movie: {$ne: null}}).limit(limit).sort({'rating': -1}).populate([{path: 'movie'}]).exec((error, list) => {
                    Rating.populate(list, ([{
                            path: 'movie.characters', model: 'Character'}, {path: 'movie.genres', model: 'Genre'}]),
                        (err, userList) => {
                            Rating.populate(userList, ({
                                path: 'movie.characters.star',
                                model: 'Star'
                            }), (err, movies) => {
                                if (err) {
                                    reject(error);
                                } else {
                                    resolve(movies);
                                }
                            });
                        });
            });
        });
    }

    static getMostRatedSeries(limit = 10) {
        return new Promise((resolve, reject) => {
            Rating.find({series: {$ne: null}}).limit(limit).sort({'rating': -1}).populate([{path: 'series'}]).exec((error, list) => {
                    Rating.populate(list, ([{path: 'series.characters', model: 'Character'}, {path: 'series.genres', model: 'Genre'},
                        {path: 'series.seasons', model: 'Season'}]), (err, userList) => {
                        Rating.populate(userList, ([{path: 'series.characters.star', model: 'Star'},
                            {path: 'series.seasons.episodes', model: 'Episode'}]), (err, seriesArray) => {
                            if (err) {
                                reject(error);
                            } else {
                                resolve(seriesArray);
                            }
                        });
                    });
            });
        });
    }

    static getMostRatedMoviesOfUser(userId, limit = 10) {
        return new Promise((resolve, reject) => {
            Rating.find({userId: userId, movie: {$ne: null}}).limit(limit).sort({'rating': -1}).populate([{path: 'movie'}]).exec((error, list) => {
                    Rating.populate(list, ([{
                            path: 'movie.characters', model: 'Character'}, {path: 'movie.genres', model: 'Genre'}]),
                        (err, userList) => {
                            Rating.populate(userList, ({
                                path: 'movie.characters.star',
                                model: 'Star'
                            }), (err, movies) => {
                                if (err) {
                                    reject(error);
                                } else {
                                    resolve(movies);
                                }
                            });
                        });
            });
        });
    }

    static getMostRatedSeriesOfUser(userId, limit) {
        return new Promise((resolve, reject) => {
            Rating.find({userId: userId, series: {$ne: null}}).limit(limit).sort({'rating': -1}).populate([{path: 'series'}]).exec((error, list) => {
                    Rating.populate(list, ([{path: 'series.characters', model: 'Character'}, {path: 'series.genres', model: 'Genre'},
                        {path: 'series.seasons', model: 'Season'}]), (err, userList) => {
                        Rating.populate(userList, ([{path: 'series.characters.star', model: 'Star'},
                            {path: 'series.seasons.episodes', model: 'Episode'}]), (err, seriesArray) => {
                            if (err) {
                                reject(error);
                            } else {
                                resolve(seriesArray);
                            }
                        });
                    });
            });
        });
    }

    // LEAST?
}

export default RatingService;