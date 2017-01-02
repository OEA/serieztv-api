/**
 * Created by gbu on 26/11/2016.
 */
import mongoose from 'mongoose';
import Series from '../../Models/Series.js';
import GenreService from '../../Services/Genre';
import Promise from 'bluebird';

Promise.promisifyAll(mongoose);

const SeriesErrorMessages = {
    SERIES_ALREADY_EXISTS: "Series already exists",
    CANNOT_CREATE_SERIES: "Could not create series",
    SERIES_NOT_EXIST: "Series does not exist"
};

class SeriesService {

    static create(series) {
        return new Promise((resolve, reject) => {
            series.save((error) => {
                if (error) {
                    console.log(error);
                    reject(SeriesErrorMessages.CANNOT_CREATE_SERIES);
                } else {
                    resolve(series);
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            Series.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(SeriesErrorMessages.SERIES_NOT_EXIST);
                }
            }).then((res) => {
                Series.findOneAndRemove({_id: id}, (error, series) => {
                    if (error) {
                        
                    } else {
                        resolve(series);
                    }
                });
            });

        });
    }

    static searchByName(value) {
        return new Promise((resolve, reject) => {
            Series.find({name:value}).count((error, count) => {
                if (count == 0 || error) {
                    reject(SeriesErrorMessages.SERIES_NOT_EXIST);
                }
            }).then((count) => {
                Series.find({name: value}, (error, seriesList) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(seriesList);
                    }
                });
            });

        });
    }

    static findStarsOf(series) {
        return new Promise((resolve, reject) => {
            Series.find({_id:series._id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(SeriesErrorMessages.SERIES_NOT_EXIST);
                }
            }).then((count) => {
                Series.findOne({_id: series._id}).populate('stars').exec((error, seriesStars) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(seriesStars);
                    }
                });
            });
        });
    }

    static findGenresOf(series) {
        return new Promise((resolve, reject) => {
            Series.findOne({_id:series._id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(SeriesErrorMessages.SERIES_NOT_EXIST);
                }
            }).then((count) => {
                Series.findOne({_id: series._id}).populate('genres').exec((error, seriesGenres) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(seriesGenres);
                    }
                });
            });
        });
    }

    static populateSeries(series) {
        return new Promise((resolve, reject) => {
            Series.find({_id:series._id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(SeriesErrorMessages.SERIES_NOT_EXIST);
                }
            }).then((count) => {
                Series.findOne({_id: series._id}).populate([{path: 'stars'}, {path: 'genres'}]).exec((error, seriesPopulated) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(seriesPopulated);
                    }
                });
            });
        });
    }

    static findSeriesOf(star) {
        return new Promise((resolve, reject) => {
            Series.find({stars: {$in: [star._id]}}).populate([{path: 'stars'}]).exec((error, seriesList) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(seriesList);
                }
            });
        });
    }

    static getSeries() {
        return new Promise((resolve, reject) => {
            Series.find().populate([{path: 'characters'}, {path: 'genres'}, {path: 'seasons'}]).exec((error, series) => {

                Series.populate(series, [{path: 'characters.star', model: 'Star'}, {path: 'seasons.episodes', model: 'Episode'}], (err, seriesArray) => {
                    if (err) {
                        reject(error);
                    } else {
                        resolve(seriesArray);
                    }
                });

            });
        });
    }
    static getTopImdbSeries(limit = 10) {
        return new Promise((resolve, reject) => {
            Series.find().limit(limit).sort({'imdbRating': -1}).populate([{path: 'characters'}, {path: 'genres'}, {path: 'seasons'}]).exec((error, series) => {
                Series.populate(series, [{path: 'characters.star', model: 'Star'}, {path: 'seasons.episodes', model: 'Episode'}], (err, seriesArray) => {
                    if (err) {
                        reject(error);
                    } else {
                        resolve(seriesArray);
                    }
                });

            });
        });
    }
    static getRecentSeries(limit = 10) {
        return new Promise((resolve, reject) => {
            Series.find().limit(limit).sort({'firstAir': -1}).populate([{path: 'characters'}, {path: 'genres'}, {path: 'seasons'}]).exec((error, series) => {
                Series.populate(series, [{path: 'characters.star', model: 'Star'}, {path: 'seasons.episodes', model: 'Episode'}], (err, seriesArray) => {
                    if (err) {
                        reject(error);
                    } else {
                        resolve(seriesArray);
                    }
                });

            });
        });
    }

    static getSeriesFromId(id = null) {
        if (id) {
            return new Promise((resolve, reject) => {
                Series.findOne({_id: id}).populate([{path: 'characters'}, {path: 'genres'}, {path: 'seasons'}]).exec((error, series) => {
                    Series.populate(series, [{path: 'characters.star', model: 'Star'}, {path: 'seasons.episodes', model: 'Episode'}], (err, series) => {
                        if (err) {
                            reject(error);
                        } else {
                            resolve(series);
                        }
                    });

                });
            });
        }
    }

    static getSeriesFromGenre(genre = null) {
        if (genre) {
            return new Promise((resolve, reject) => {
                GenreService.search(genre)
                    .then((genresObj) => {

                        let genreIds = [];
                        for (let genreObj of genresObj) {
                            genreIds.push(genreObj._id);
                        }
                        SeriesService.getSeriesFromGenreId(genreIds)
                            .then((series) => {
                                resolve(series);
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

    static getSeriesFromGenreId(genreIds = null) {
        if (genreIds) {
            return new Promise((resolve, reject) => {
                Series.find({ genres: { "$in" : genreIds} }).populate([{path: 'characters'}, {path: 'genres'}, {path: 'seasons'}]).exec((error, series) => {
                    Series.populate(series, [{path: 'characters.star', model: 'Star'}, {path: 'seasons.episodes', model: 'Episode'}], (err, series) => {
                        if (err) {
                            reject(error);
                        } else {
                            resolve(series);
                        }
                    });

                });
            });
        }
    }
    static getSeriesFromName(name) {

        var searchKey = new RegExp(name, 'i')
        return new Promise((resolve, reject) => {
            Series.find({ name: searchKey}).populate([{path: 'characters'}, {path: 'genres'}, {path: 'seasons'}]).exec((error, series) => {
                Series.populate(series, [{path: 'characters.star', model: 'Star'}, {path: 'seasons.episodes', model: 'Episode'}], (err, series) => {
                    if (err) {
                        reject(error);
                    } else {
                        resolve(series);
                    }
                });

            });
        });
    }

    static search(query) {
        return new Promise((resolve, reject) => {
            Series.find({ name: searchKey}).populate([{path: 'characters'}, {path: 'genres'}, {path: 'seasons'}]).exec((error, series) => {
                Series.populate(series, [{path: 'characters.star', model: 'Star'}, {path: 'seasons.episodes', model: 'Episode'}], (err, series) => {
                    if (err) {
                        reject(error);
                    } else {
                        resolve(series);
                    }
                });

            });
        });
    }
}

export default SeriesService;