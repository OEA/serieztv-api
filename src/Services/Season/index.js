/**
 * Created by gbu on 26/11/2016.
 */

import mongoose from 'mongoose';
import Season from '../../Models/Season.js';
import Promise from 'bluebird';

Promise.promisifyAll(mongoose);

const SeasonErrorMessages = {
    SEASON_ALREADY_EXISTS: "Season already exists",
    CANNOT_CREATE_SEASON: "Could not create season",
    SEASON_NOT_EXIST: "Season does not exist"
};

class SeasonService {

    static create(season) {
        return new Promise((resolve, reject) => {
            season.save((error) => {
                if (error) {
                    reject(SeasonErrorMessages.CANNOT_CREATE_SEASON);
                } else {
                    resolve(season);
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            Season.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(SeasonErrorMessages.SEASON_NOT_EXIST);
                }
            }).then((res) => {
                Season.findOneAndRemove({_id: id}, (error, season) => {
                    if (error) {
                        console.log(error);
                    } else {
                        resolve(season);
                    }
                });
            });

        });
    }

    static searchByName(value) {
        return new Promise((resolve, reject) => {
            Season.find({name:value}).count((error, count) => {
                if (count == 0 || error) {
                    reject(SeasonErrorMessages.SEASON_NOT_EXIST);
                }
            }).then((count) => {
                Season.find({name: value}, (error, seasons) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(seasons);
                    }
                });
            });

        });
    }

    static findSeriesOf(season) {
        return new Promise((resolve, reject) => {
            Season.findOne({_id:season._id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(SeasonErrorMessages.SEASON_NOT_EXIST);
                }
            }).then((count) => {
                Season.findOne({_id: season._id}).populate('series').exec((error, seasonSeries) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(seasonSeries.series);
                    }
                });
            });
        });
    }

    static populateSeason(season) {
        return new Promise((resolve, reject) => {
            Season.find({_id:season._id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(SeasonErrorMessages.SEASON_NOT_EXIST);
                }
            }).then((count) => {
                Season.findOne({_id: season._id}).populate({path: 'series'}).exec((error, seasonPopulated) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(seasonPopulated);
                    }
                });
            });
        });
    }

    static findSeasonsOf(series) {
        return new Promise((resolve, reject) => {
            Season.find({series: {$in: [series._id]}}).populate('series').exec((error, seasons) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(seasons);
                }
            });
        });
    }
}

export default SeasonService;