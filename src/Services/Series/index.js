/**
 * Created by gbu on 26/11/2016.
 */
import mongoose from 'mongoose';
import Series from '../../Models/Series.js';
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
}

export default SeriesService;