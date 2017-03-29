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
                    console.log("res is"+result)
                    Userlist.populate(result, [{path: 'movies'}], ((error, list) => {
                        Userlist.populate(list, ([{path: 'movies.characters', model: 'Character'}, {path: 'movies.genres', model: 'Genre'}]), (err, userList) => {
                            Userlist.populate(userList, {path: 'movies.characters.star', model: 'Star'}, (err, moviesArray) => {
                                if (error) {
                                    console.log('error' + error);
                                    reject(error);
                                } else {
                                    console.log('lsit'+moviesArray);
                                    resolve(moviesArray);
                                }
                            });
                        });

                    }));
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
                    Userlist.populate(result, [{path: 'series'}], ((error, list) => {
                        Userlist.populate(list, ([{path: 'series.characters', model: 'Character'}, {path: 'series.genres', model: 'Genre'},
                            {path: 'series.seasons', model: 'Season'}]), (err, userList) => {
                            Userlist.populate(userList, ([{path: 'series.characters.star', model: 'Star'}, {path: 'series.seasons.episodes', model: 'Episode'}]), (err, seriesArray) => {
                                if (err) {
                                    reject(error);
                                } else {
                                    resolve(seriesArray);
                                }
                            });
                        });
                    }));
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
                    Userlist.populate(result, [{path: 'movies'}], ((error, list) => {
                        Userlist.populate(list, ([{path: 'movies.characters', model: 'Character'}, {path: 'movies.genres', model: 'Genre'}]), (err, userList) => {
                            Userlist.populate(userList, {path: 'movies.characters.star', model: 'Star'}, (err, moviesArray) => {
                                if (error) {
                                    console.log('error' + error);
                                    reject(error);
                                } else {
                                    console.log('lsit'+moviesArray);
                                    resolve(moviesArray);
                                }
                            });
                        });

                    }));
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
                Userlist.findOneAndUpdate({_id: id}, {$pull: {"series": seriesId}}, {safe: true, upsert: true, new: true}, (err, result) => {
                    Userlist.populate(result, [{path: 'series'}], ((error, list) => {
                        Userlist.populate(list, ([{path: 'series.characters', model: 'Character'}, {path: 'series.genres', model: 'Genre'},
                            {path: 'series.seasons', model: 'Season'}]), (err, userList) => {
                            Userlist.populate(userList, ([{path: 'series.characters.star', model: 'Star'}, {path: 'series.seasons.episodes', model: 'Episode'}]), (err, seriesArray) => {
                                if (err) {
                                    reject(error);
                                } else {
                                    resolve(seriesArray);
                                }
                            });
                        });
                    }));
                });
            });

        });
    }

    static getMovies(id) {
        return new Promise((resolve, reject) => {
            Userlist.findById(id).populate([{path: 'movies'}]).exec((error, list) => {
                Userlist.populate(list, ([{path: 'movies.characters', model: 'Character'}, {path: 'movies.genres', model: 'Genre'}]), (err, userList) => {
                    Userlist.populate(userList, {path: 'movies.characters.star', model: 'Star'}, (err, moviesArray) => {
                        if (error) {
                            console.log('error' + error);
                            reject(error);
                        } else {
                            resolve(moviesArray);
                        }
                    });
                });

            });
        });
    }

    static getAllMedia(id) {
        return new Promise((resolve, reject) => {
            Userlist.findOne({_id: id}).populate([{path: 'movies', model:'Movie'}, {path: 'series', model:'Series'}]).exec((error, list) => {
                Userlist.populate(list, ([{path: 'series.characters', model: 'Character'}, {path: 'series.genres', model: 'Genre'},
                    {path: 'series.seasons', model: 'Season'}, {path: 'movies.characters', model: 'Character'},
                    {path: 'movies.genres', model: 'Genre'}]), (err, userList) => {
                    Userlist.populate(userList, ([{path: 'series.characters.star', model: 'Star'}, {path: 'series.seasons.episodes', model: 'Episode'},
                        {path: 'movies.characters.star', model: 'Star'}]), (err, seriesArray) => {
                        if (err) {
                            reject(error);
                        } else {
                            resolve({movies: seriesArray.movies, series: seriesArray.series});
                        }
                    });
                });
            });
        });
    }

    static getSeries(id) {
        return new Promise((resolve, reject) => {
            Userlist.findOne({_id: id}).populate([{path: 'series'}]).exec((error, list) => {
                Userlist.populate(list, ([{path: 'series.characters', model: 'Character'}, {path: 'series.genres', model: 'Genre'},
                    {path: 'series.seasons', model: 'Season'}]), (err, userList) => {
                    Userlist.populate(userList, ([{path: 'series.characters.star', model: 'Star'}, {path: 'series.seasons.episodes', model: 'Episode'}]), (err, seriesArray) => {
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
        return new Promise((resolve, reject) => {
            Userlist.find({userId: userId}, (error, lists) => {
                if (error) {
                    reject(error);
                } else {
                    console.log("userlists" + lists)
                    resolve(lists);
                }
            });
        });
    }
}

export default UserlistService;
