/**
 * Created by gbu on 21/11/2016.
 */
import mongoose from 'mongoose';
import Movie from '../../Models/Movie.js';
import GenreService from '../Genre';
import Promise from 'bluebird';

Promise.promisifyAll(mongoose);

const MovieErrorMessages = {
    MOVIE_ALREADY_EXISTS: "Movie already exists",
    CANNOT_CREATE_MOVIE: "Could not create movie",
    MOVIE_NOT_EXIST: "Movie does not exist"
};

class MovieService {

    static create(movie) {
        return new Promise((resolve, reject) => {
            movie.save((error) => {
                if (error) {
                    reject(MovieErrorMessages.CANNOT_CREATE_MOVIE);
                } else {
                    resolve(movie);
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            Movie.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(MovieErrorMessages.MOVIE_NOT_EXIST);
                }
            }).then((res) => {
                Movie.findOneAndRemove({_id: id}, (error, movie) => {
                    if (error) {

                    } else {
                        resolve(movie);
                    }
                });
            });

        });
    }

    static searchByName(value) {
        return new Promise((resolve, reject) => {
            Movie.find({name:value}).count((error, count) => {
                if (count == 0 || error) {
                    reject(MovieErrorMessages.MOVIE_NOT_EXIST);
                }
            }).then((count) => {
                Movie.find({name: value}, (error, movies) => {
                    if (error) {

                    } else {
                        resolve(movies);
                    }
                });
            });

        });
    }

    static findStarsOf(movie) {
        return new Promise((resolve, reject) => {
            Movie.find({_id:movie._id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(MovieErrorMessages.MOVIE_NOT_EXIST);
                }
            }).then((count) => {
                Movie.findOne({_id: movie._id}).populate('stars').exec((error, movieStars) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(movieStars);
                    }
                });
            });
        });
    }

    static findGenresOf(movie) {
        return new Promise((resolve, reject) => {
            Movie.findOne({_id:movie._id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(MovieErrorMessages.MOVIE_NOT_EXIST);
                }
            }).then((count) => {
                Movie.findOne({_id: movie._id}).populate('genres').exec((error, movieGenres) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(movieGenres);
                    }
                });
            });
        });
    }

    static populateMovie(movie) {
        return new Promise((resolve, reject) => {
            Movie.find({_id:movie._id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(MovieErrorMessages.MOVIE_NOT_EXIST);
                }
            }).then((count) => {
                Movie.findOne({_id: movie._id}).populate([{path: 'stars'}, {path: 'genres'}]).exec((error, moviePopulated) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(moviePopulated);
                    }
                });
            });
        });
    }

    static findMoviesOf(star) {
        return new Promise((resolve, reject) => {
            Movie.find({stars: {$in: [star._id]}}).populate([{path: 'stars'}]).exec((error, movies) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(movies);
                }
            });
        });
    }

    static getMovies() {
        return new Promise((resolve, reject) => {
            Movie.find().populate([{path: 'characters'}, {path: 'genres'}]).exec((error, movies) => {

                Movie.populate(movies, {path: 'characters.star', model: 'Star'}, (err, moviesArray) => {
                    if (err) {
                        reject(error);
                    } else {
                        resolve(moviesArray);
                    }
                });

            });
        });
    }

    static getTopImdbMovies(limit = 10) {
        return new Promise((resolve, reject) => {
            Movie.find().limit(limit).sort({'imdbRating': -1}).populate([{path: 'characters'}, {path: 'genres'}]).exec((error, movies) => {
                Movie.populate(movies, {path: 'characters.star', model: 'Star'}, (err, moviesArray) => {
                    if (err) {
                        reject(error);
                    } else {
                        resolve(moviesArray);
                    }
                });

            });
        });
    }
    static getRecentMovies(limit = 10) {
        return new Promise((resolve, reject) => {
            Movie.find().limit(limit).sort({'airDate': -1}).populate([{path: 'characters'}, {path: 'genres'}]).exec((error, movies) => {
                Movie.populate(movies, {path: 'characters.star', model: 'Star'}, (err, moviesArray) => {
                    if (err) {
                        reject(error);
                    } else {
                        resolve(moviesArray);
                    }
                });

            });
        });
    }

    static getMovieFromId(id = null) {
        if (id) {
            return new Promise((resolve, reject) => {
                Movie.find({_id: id}).populate([{path: 'characters'}, {path: 'genres'}]).exec((error, movie) => {
                    Movie.populate(movie, {path: 'characters.star', model: 'Star'}, (err, movie) => {
                        if (err) {
                            reject(error);
                        } else {
                            resolve(movie);
                        }
                    });

                });
            });
        }
    }

    static getMovieFromGenre(genre = null) {
        if (genre) {
            return new Promise((resolve, reject) => {
                GenreService.search(genre)
                    .then((genresObj) => {

                    let genreIds = [];
                    for (let genreObj of genresObj) {
                        genreIds.push(genreObj._id);
                    }
                    MovieService.getMovieFromGenreId(genreIds)
                        .then((movies) => {
                            resolve(movies);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                    })
                    .catch((error) => {
                        reject(error);
                    })

            });
        }
    }

    static getMovieFromGenreId(genreIds = null) {
        if (genreIds) {
            return new Promise((resolve, reject) => {
                Movie.find({ genres: { "$in" : genreIds} }).populate([{path: 'characters'}, {path: 'genres'}]).exec((error, movies) => {
                    Movie.populate(movies, {path: 'characters.star', model: 'Star'}, (err, movies) => {
                        if (err) {
                            reject(error);
                        } else {
                            resolve(movies);
                        }
                    });

                });
            });
        }
    }
    static getMovieFromName(name) {

        var searchKey = new RegExp(name, 'i');
        return new Promise((resolve, reject) => {
            Movie.find({ name: searchKey}).populate([{path: 'characters'}, {path: 'genres'}]).exec((error, movies) => {
                Movie.populate(movies, {path: 'characters.star', model: 'Star'}, (err, movies) => {
                    if (err) {
                        reject(error);
                    } else {
                        resolve(movies);
                    }
                });

            });
        });
    }

    static getMovieNameAndGenreIds(name, genreIds) {
        var searchKey = new RegExp(name, 'i');
        return new Promise((resolve, reject) => {
            Movie.find({$or: [{name: searchKey}, { genres: { "$in" : genreIds}}]}).populate([{path: 'characters'}, {path: 'genres'}]).exec((error, movies) => {
                Movie.populate(movies, {path: 'characters.star', model: 'Star'}, (err, movies) => {
                    if (err) {
                        reject(error);
                    } else {
                        resolve(movies);
                    }
                });

            });
        });
    }

    static getMovieFromCharId(starIds = null) {
        if (starIds) {
            return new Promise((resolve, reject) => {
                Movie.find({ characters: { "$in" : starIds} }).populate([{path: 'characters'}, {path: 'genres'}]).exec((error, movies) => {
                    Movie.populate(movies, {path: 'characters.star', model: 'Star'}, (err, movies) => {
                        if (err) {
                            reject(error);
                        } else {
                            resolve(movies);
                        }
                    });

                });
            });
        }
    }
}

export default MovieService;