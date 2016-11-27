/**
 * Created by gbu on 26/11/2016.
 */
import mongoose from 'mongoose';
import Episode from '../../Models/Episode.js';
import Promise from 'bluebird';

Promise.promisifyAll(mongoose);

const EpisodeErrorMessages = {
    EPISODE_ALREADY_EXISTS: "Episode already exists",
    CANNOT_CREATE_EPISODE: "Could not create episode",
    EPISODE_NOT_EXIST: "Episode does not exist"
};

class EpisodeService {

    static create(episode) {
        return new Promise((resolve, reject) => {
            episode.save((error) => {
                if (error) {
                    reject(EpisodeErrorMessages.CANNOT_CREATE_EPISODE);
                } else {
                    resolve(episode);
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            Episode.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(EpisodeErrorMessages.EPISODE_NOT_EXIST);
                }
            }).then((res) => {
                Episode.findOneAndRemove({_id: id}, (error, episode) => {
                    if (error) {
                        console.log(error);
                    } else {
                        resolve(episode);
                    }
                });
            });

        });
    }

    static searchByName(value) {
        return new Promise((resolve, reject) => {
            Episode.find({name:value}).count((error, count) => {
                if (count == 0 || error) {
                    reject(EpisodeErrorMessages.EPISODE_NOT_EXIST);
                }
            }).then((count) => {
                Episode.find({name: value}, (error, episodes) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(episodes);
                    }
                });
            });

        });
    }

    static findSeasonOf(episode) {
        return new Promise((resolve, reject) => {
            Episode.findOne({_id:episode._id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(EpisodeErrorMessages.EPISODE_NOT_EXIST);
                }
            }).then((count) => {
                Episode.findOne({_id: episode._id}).populate('season').exec((error, founded) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(founded);
                    }
                });
            });
        });
    }

    static findCrewOf(episode) {
        return new Promise((resolve, reject) => {
            Episode.findOne({_id:episode._id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(EpisodeErrorMessages.EPISODE_NOT_EXIST);
                }
            }).then((count) => {
                Episode.findOne({_id: episode._id}).populate('crew').exec((error, episodes) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(episodes);
                    }
                });
            });
        });
    }

    static findGuestStarsOf(episode) {
        return new Promise((resolve, reject) => {
            Episode.findOne({_id:episode._id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(EpisodeErrorMessages.EPISODE_NOT_EXIST);
                }
            }).then((count) => {
                Episode.findOne({_id: episode._id}).populate('guestStars').exec((error, episodes) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(episodes);
                    }
                });
            });
        });
    }

    static populateEpisode(episode) {
        return new Promise((resolve, reject) => {
            Episode.find({_id:episode._id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(EpisodeErrorMessages.EPISODE_NOT_EXIST);
                }
            }).then((count) => {
                Episode.findOne({_id: episode._id}).populate({path: 'season'}, {path: 'crew'},  {path: 'guestStars'})
                    .exec((error, episodePopulated) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(episodePopulated);
                    }
                });
            });
        });
    }

    static findEpisodesOf(season) {
        return new Promise((resolve, reject) => {
            Episode.find({season: {$in: [season._id]}}).populate('season').exec((error, episodes) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(episodes);
                }
            });
        });
    }
}

export default EpisodeService;