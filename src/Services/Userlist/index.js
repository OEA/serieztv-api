/**
 * Created by gbu on 12/02/2017.
 */
import mongoose from 'mongoose';
import User from '../../Models/User';
import Promise from 'bluebird';
import Series from '../../Models/Series.js';
import Movie from '../../Models/Movie.js';
import Userlist from '../../Models/Userlist.js';

Promise.promisifyAll(mongoose);

const UserlistErrorMessages = {
    LIST_ALREADY_EXISTS: "List already exists",
    CANNOT_CREATE_LIST: "Could not create list",
    LIST_NOT_EXIST: "List does not exist"
};

class UserlistService {

    static create(list) {
        return new Promise((resolve, reject) => {
            list.save((error) => {
                if (error) {
                    console.log(error);
                    reject(UserlistErrorMessages.CANNOT_CREATE_LIST);
                } else {
                    resolve(list);
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            Userlist.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(UserlistErrorMessages.LIST_NOT_EXIST);
                }
            }).then((res) => {
                Userlist.findOneAndRemove({_id: id}, (error, list) => {
                    if (error) {

                    } else {
                        resolve(list);
                    }
                });
            });

        });
    }

    static addMovieToList(movieId, id) {
        return new Promise((resolve, reject) => {
            Userlist.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    console.log(error);
                    reject(UserlistErrorMessages.LIST_NOT_EXIST);
                }
            }).then((res) => {
                Userlist.findOneAndUpdate({_id: id}, {$push: {"movies": movieId}}, {safe: true, upsert: true, new: true}, (err, result) => {
                    if (err) {
                        reject(err);
                    }  else {
                        resolve(result);
                    }
                });
            });

        });
    }

    static addSeriesToList(seriesId, id) {
        return new Promise((resolve, reject) => {
            Userlist.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(UserlistErrorMessages.LIST_NOT_EXIST);
                }
            }).then((res) => {
                Userlist.findOneAndUpdate({_id: id}, {$push: {"series": seriesId}}, {safe: true, upsert: true, new: true}, (err, result) => {
                    if (err) {
                        reject(err);
                    }  else {
                        resolve(result);
                    }
                });
            });

        });
    }

    static removeMovieFromTheList(movieId, id) {
        return new Promise((resolve, reject) => {
            Userlist.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(UserlistErrorMessages.LIST_NOT_EXIST);
                }
            }).then((res) => {
                Userlist.findOneAndUpdate({_id: id}, {$pull: {"movies": movieId}}, {safe: true, upsert: true, new: true}, (err, result) => {
                    if (err) {
                        reject(err);
                    }  else {
                        resolve(result);
                    }
                });
            });

        });
    }

    static removeSeriesFromTheList(id, seriesId) {
        return new Promise((resolve, reject) => {
            Userlist.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(UserlistErrorMessages.LIST_NOT_EXIST);
                }
            }).then((res) => {
                Userlist.findOneAndUpdate({_id: id}, {$pull: {"movies": seriesId}}, {safe: true, upsert: true, new: true}, (err, result) => {
                    if (err) {
                        reject(err);
                    }  else {
                        resolve(result);
                    }
                });
            });

        });
    }

    static getMovies(id) {
        return new Promise((resolve, reject) => {
       /*     Userlist.findById(id).populate([{path: 'movies'}]).exec((error, list) => {
               // Userlist.populate(list, ([{path: 'characters'}, {path: 'genres'}]), (err, userList) => {
                   // Userlist.populate(userList, {path: 'characters.star', model: 'Star'}, (err, moviesArray) => {
                        if (error) {
                            console.log('error' + error);
                            reject(error);
                        } else {
                            console.log('lsit'+list);
                            resolve(list);
                        }
                //    });
               // });

            });*/

            Userlist.findOne({_id:id}, (error, list) => {
                if (error) {
                    console.log('error' + error);
                    console.log(id);
                    reject(error);
                } else {
                    console.log('lsit'+list);
                    console.log(id);
                    resolve(list);
                }
            });
        });


    }

    static getSeries(id) {
        return new Promise((resolve, reject) => {
            Userlist.findOne({_id: id}).populate([{path: 'series'}]).exec((error, list) => {
                Userlist.populate(list, ([{path: 'characters'}, {path: 'genres'}, {path: 'seasons'}]), (err, userList) => {
                    Userlist.populate(userList, {path: 'characters.star', model: 'Star'}, {path: 'seasons.episodes', model: 'Episode'}, (err, seriesArray) => {
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

    static getAllMedia(id) {
        return new Promise((resolve, reject) => {
            Series.findOne({_id: id}).populate([{path: 'characters'}, {path: 'genres'}, {path: 'seasons'}]).exec((error, series) => {

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

    static setListName(id, newName) {
        return new Promise((resolve, reject) => {
            Userlist.findOneAndUpdate({_id: id}, {listName: newName}, {new: true}, (err, result) => {
               if (err) {
                   reject(err);
               }  else {
                   resolve(result);
               }
            });
        });
    }

    static setStatus(id, newStatus) {
        return new Promise((resolve, reject) => {
            Userlist.findOneAndUpdate({_id: id}, {isPrivate: newStatus}, {new: true}, (err, result) => {
                if (err) {
                    reject(err);
                }  else {
                    resolve(result);
                }
            });
        });
    }

    static getListsOfUser(userId) {
        Userlist.find({userId: userId})
    }
}

export default UserlistService;
