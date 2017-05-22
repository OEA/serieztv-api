/**
 * Created by gbu on 08/11/2016.
 */
import mongoose from 'mongoose';
import User from '../../Models/User';
import bluebird from 'bluebird';

mongoose.promise = bluebird;

const Messages = {
    NOT_UNIQUE_EMAIL: "Email is not unique",
    NOT_UNIQUE_USERNAME: "Username is not unique",
    WRONG_PASSWORD: "Wrong Password",
    CANNOT_CREATE_USER: "Could not create user",
    USER_NOT_EXIST: "User does not exist",
};

class Login {

    static register(user) {

        return new Promise((resolve, reject) => {

            User.find({email:user.email}).count((error, count)=> {
                if (count > 0 || error) {
                    reject(Messages.NOT_UNIQUE_EMAIL);
                }
            })
                .then(() => {
                    User.find({username:user.username}).count((error, count)=> {
                        if (count > 0 || error) {
                            reject(Messages.NOT_UNIQUE_USERNAME);
                        }
                    });
                })
                .then(() => {
                    user.save( (error) => {
                        if (error) {
                            reject(Messages.CANNOT_CREATE_USER);
                        } else {
                            resolve(user);
                        }
                    });
                });
        });
    }

    static login(email, password) {
        return new Promise((resolve, reject) => {
            User.count({$or : [{email:email}, {username: email}]})
                .exec((error, count) => {
                    if (error || count < 1) {
                        reject(Messages.USER_NOT_EXIST);
                    }
                })
                .then(() => {
                    User.find({$or : [{email:email}, {username: email}], password: password}, {password: 0}).limit(1)
                        .exec((error, users)=> {
                        if (error || users.length < 1) {
                            reject(Messages.WRONG_PASSWORD);
                        } else {
                            resolve(users[0]);
                        }
                    });
                });
        });
    }

    static followUser(id, followedId) {
        return new Promise((resolve, reject) => {
            User.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(Messages.USER_NOT_EXIST);
                }
            }).then((res) => {
                User.findOneAndUpdate({_id: id}, {$addToSet: {"following": followedId}}, {safe: true, upsert: true, new: true}, (err, result) => {
                    User.populate(result, [{path: 'following',  model: 'User'}, {path: 'followers',  model: 'User'},
                        {path: 'followedMovies',  model: 'Movie'}, {path: 'followedSeries',  model: 'Series'}], ((error, populated) => {
                        User.populate(populated, ([{path: 'followedMovies.characters', model: 'Character'}, {path: 'followedSeries.characters', model: 'Character'},
                            {path: 'followedSeries.genres', model: 'Genre'}, {path: 'followedMovies.genres', model: 'Genre'},
                            {path: 'followedSeries.seasons', model: 'Season'}]), (err, userList) => {
                            User.populate(userList, ([{path: 'followedSeries.characters.star', model: 'Star'}, {path: 'followedMovies.characters.star', model: 'Star'},
                                {path: 'followedSeries.seasons.episodes', model: 'Episode'}]), (err, seriesArray) => {
                                if (err) {
                                    reject(error);
                                } else {
                                    resolve(seriesArray);
                                }
                            });
                        });

                    }));
                });
            }).then((res) => {
                User.findOneAndUpdate({_id: followedId}, {$addToSet: {"followers": id}}, {safe: true, upsert: true, new: true}, (err, result) => {
                    User.populate(result, [{path: 'following',  model: 'User'}, {path: 'followers',  model: 'User'},
                        {path: 'followedMovies',  model: 'Movie'}, {path: 'followedSeries',  model: 'Series'}], ((error, populated) => {
                        User.populate(populated, ([{path: 'followedMovies.characters', model: 'Character'}, {path: 'followedSeries.characters', model: 'Character'},
                            {path: 'followedSeries.genres', model: 'Genre'}, {path: 'followedMovies.genres', model: 'Genre'},
                            {path: 'followedSeries.seasons', model: 'Season'}]), (err, userList) => {
                            User.populate(userList, ([{path: 'followedSeries.characters.star', model: 'Star'}, {path: 'followedMovies.characters.star', model: 'Star'},
                                {path: 'followedSeries.seasons.episodes', model: 'Episode'}]), (err, seriesArray) => {
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

    static followSeries(id, seriesId) {
        return new Promise((resolve, reject) => {
            User.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(Messages.USER_NOT_EXIST);
                }
            }).then((res) => {
                User.findOneAndUpdate({_id: id}, {$addToSet: {"followedSeries": seriesId}}, {safe: true, upsert: true, new: true}, (err, result) => {
                    User.populate(result, [{path: 'following',  model: 'User'}, {path: 'followers',  model: 'User'},
                        {path: 'followedMovies',  model: 'Movie'}, {path: 'followedSeries',  model: 'Series'}], ((error, populated) => {
                        User.populate(populated, ([{path: 'followedMovies.characters', model: 'Character'}, {path: 'followedSeries.characters', model: 'Character'},
                            {path: 'followedSeries.genres', model: 'Genre'}, {path: 'followedMovies.genres', model: 'Genre'},
                            {path: 'followedSeries.seasons', model: 'Season'}]), (err, userList) => {
                            User.populate(userList, ([{path: 'followedSeries.characters.star', model: 'Star'}, {path: 'followedMovies.characters.star', model: 'Star'},
                                {path: 'followedSeries.seasons.episodes', model: 'Episode'}]), (err, seriesArray) => {
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

    static unfollowUser(id, followedId) {
        return new Promise((resolve, reject) => {
            User.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(Messages.USER_NOT_EXIST);
                }
            }).then((res) => {
                User.findOneAndUpdate({_id: id}, {$pull: {"followedMovies": followedId}}, {safe: true, upsert: true, new: true}, (err, result) => {
                    User.populate(result, [{path: 'following',  model: 'User'}, {path: 'followers',  model: 'User'},
                        {path: 'followedMovies',  model: 'Movie'}, {path: 'followedSeries',  model: 'Series'}], ((error, populated) => {
                        User.populate(populated, ([{path: 'followedMovies.characters', model: 'Character'}, {path: 'followedSeries.characters', model: 'Character'},
                            {path: 'followedSeries.genres', model: 'Genre'}, {path: 'followedMovies.genres', model: 'Genre'},
                            {path: 'followedSeries.seasons', model: 'Season'}]), (err, userList) => {
                            User.populate(userList, ([{path: 'followedSeries.characters.star', model: 'Star'}, {path: 'followedMovies.characters.star', model: 'Star'},
                                {path: 'followedSeries.seasons.episodes', model: 'Episode'}]), (err, seriesArray) => {
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

    static unfollowSeries(id, seriesId) {
        return new Promise((resolve, reject) => {
            User.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(Messages.USER_NOT_EXIST);
                }
            }).then((res) => {
                User.findOneAndUpdate({_id: id}, {$pull: {"followedMovies": seriesId}}, {safe: true, upsert: true, new: true}, (err, result) => {
                    User.populate(result, [{path: 'following',  model: 'User'}, {path: 'followers',  model: 'User'},
                        {path: 'followedMovies',  model: 'Movie'}, {path: 'followedSeries',  model: 'Series'}], ((error, populated) => {
                        User.populate(populated, ([{path: 'followedMovies.characters', model: 'Character'}, {path: 'followedSeries.characters', model: 'Character'},
                            {path: 'followedSeries.genres', model: 'Genre'}, {path: 'followedMovies.genres', model: 'Genre'},
                            {path: 'followedSeries.seasons', model: 'Season'}]), (err, userList) => {
                            User.populate(userList, ([{path: 'followedSeries.characters.star', model: 'Star'}, {path: 'followedMovies.characters.star', model: 'Star'},
                                {path: 'followedSeries.seasons.episodes', model: 'Episode'}]), (err, seriesArray) => {
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

    static followMovie(id, movieId) {
        return new Promise((resolve, reject) => {
            User.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(Messages.USER_NOT_EXIST);
                }
            }).then((res) => {
                User.findOneAndUpdate({_id: id}, {$pull: {"followedMovies": movieId}}, {safe: true, upsert: true, new: true}, (err, result) => {
                    User.populate(result, [{path: 'following',  model: 'User'}, {path: 'followers',  model: 'User'},
                        {path: 'followedMovies',  model: 'Movie'}, {path: 'followedSeries',  model: 'Series'}], ((error, populated) => {
                        User.populate(populated, ([{path: 'followedMovies.characters', model: 'Character'}, {path: 'followedSeries.characters', model: 'Character'},
                            {path: 'followedSeries.genres', model: 'Genre'}, {path: 'followedMovies.genres', model: 'Genre'},
                            {path: 'followedSeries.seasons', model: 'Season'}]), (err, userList) => {
                            User.populate(userList, ([{path: 'followedSeries.characters.star', model: 'Star'}, {path: 'followedMovies.characters.star', model: 'Star'},
                                {path: 'followedSeries.seasons.episodes', model: 'Episode'}]), (err, seriesArray) => {
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

    static unfollowMovie(id, movieId) {
        return new Promise((resolve, reject) => {
            User.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(Messages.USER_NOT_EXIST);
                }
            }).then((res) => {
                User.findOneAndUpdate({_id: id}, {$pull: {"followedMovies": movieId}}, {safe: true, upsert: true, new: true}, (err, result) => {
                    User.populate(result, [{path: 'following',  model: 'User'}, {path: 'followers',  model: 'User'},
                        {path: 'followedMovies',  model: 'Movie'}, {path: 'followedSeries',  model: 'Series'}], ((error, populated) => {
                        User.populate(populated, ([{path: 'followedMovies.characters', model: 'Character'}, {path: 'followedSeries.characters', model: 'Character'},
                            {path: 'followedSeries.genres', model: 'Genre'}, {path: 'followedMovies.genres', model: 'Genre'},
                            {path: 'followedSeries.seasons', model: 'Season'}]), (err, userList) => {
                            User.populate(userList, ([{path: 'followedSeries.characters.star', model: 'Star'}, {path: 'followedMovies.characters.star', model: 'Star'},
                                {path: 'followedSeries.seasons.episodes', model: 'Episode'}]), (err, seriesArray) => {
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

    static getFollowers(id) {
        return new Promise((resolve, reject) => {
            User.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(Messages.USER_NOT_EXIST);
                }
            }).then((res) => {
                User.findOne({_id: id}, (err, result) => {
                    User.populate(result, [{path: 'followers',  model: 'User'}], ((error, populated) => {
                        if (err) {
                            reject(error);
                        } else {
                            resolve({followers: populated.followers});
                        }
                    }));
                });
            });
        });
    }

    static getFollowing(id) {
        return new Promise((resolve, reject) => {
            User.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(Messages.USER_NOT_EXIST);
                }
            }).then((res) => {
                User.findOne({_id: id}, (err, result) => {
                    User.populate(result, [{path: 'following',  model: 'User'}], ((error, populated) => {
                        if (err) {
                            reject(error);
                        } else {
                            resolve({following: populated.following});
                        }
                    }));
                });
            });

        });
    }

    static getFollowedMovies(id) {
        return new Promise((resolve, reject) => {
            User.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(Messages.USER_NOT_EXIST);
                }
            }).then((res) => {
                User.findOne({_id: id}, (err, result) => {
                    User.populate(result, [{path: 'followedMovies',  model: 'Movie'}], ((error, populated) => {
                        User.populate(populated, ([{path: 'followedMovies.characters', model: 'Character'},
                            {path: 'followedMovies.genres', model: 'Genre'}]), (err, userList) => {
                            User.populate(userList, ([{path: 'followedMovies.characters.star', model: 'Star'}]), (err, seriesArray) => {
                                if (err) {
                                    reject(error);
                                } else {
                                    resolve({followedMovies: seriesArray});
                                }
                            });
                        });

                    }));
                });
            });

        });
    }

    static getFollowedSeries(id) {
        return new Promise((resolve, reject) => {
            User.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(Messages.USER_NOT_EXIST);
                }
            }).then((res) => {
                User.findOne({_id: id}, (err, result) => {
                    User.populate(result, [{path: 'followedSeries',  model: 'Series'}], ((error, populated) => {
                        User.populate(populated, ([{path: 'followedSeries.characters', model: 'Character'},
                            {path: 'followedSeries.genres', model: 'Genre'}, {path: 'followedSeries.seasons', model: 'Season'}]), (err, userList) => {
                            User.populate(userList, ([{path: 'followedSeries.characters.star', model: 'Star'},
                                {path: 'followedSeries.seasons.episodes', model: 'Episode'}]), (err, seriesArray) => {
                                if (err) {
                                    reject(error);
                                } else {
                                    resolve({followedSeries: seriesArray});
                                }
                            });
                        });

                    }));
                });
            });

        });




    }
}

export default Login;