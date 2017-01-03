/**
 * Created by gbu on 20/11/2016.
 */

import mongoose from 'mongoose';
import Star from '../../Models/Star.js';
import Promise from 'bluebird';

Promise.promisifyAll(mongoose);

const StarErrorMessages = {
    STAR_ALREADY_EXISTS: "Star already exists",
    CANNOT_CREATE_STAR: "Could not create star",
    STAR_NOT_EXIST: "Star does not exist"
};

class StarService {

    static create(star) {
        return new Promise((resolve, reject) => {
            star.save((error) => {
                if (error) {
                    reject(StarErrorMessages.CANNOT_CREATE_STAR);
                } else {
                    resolve(star);
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            Star.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(StarErrorMessages.STAR_NOT_EXIST);
                }
            }).then((test) => {
                Star.findOneAndRemove({_id: id}, (error, star) => {
                    if (error) {

                    } else {
                        resolve(star);
                    }
                });
            });

        });
    }

    static searchByName(value) {
        return new Promise((resolve, reject) => {
            Star.find({name:value}).count((error, count) => {
                if (count == 0 || error) {
                    reject(StarErrorMessages.STAR_NOT_EXIST);
                }
            }).then((count) => {
                Star.find({name: value}, (error, stars) => {
                    if (error) {

                    } else {
                        resolve(stars);
                    }
                });
            });

        });
    }

    static searchByName(value) {
        return new Promise((resolve, reject) => {
            Star.find({name:value}).count((error, count) => {
                if (count == 0 || error) {
                    reject(StarErrorMessages.STAR_NOT_EXIST);
                }
            }).then((count) => {
                Star.find({name: value}, (error, stars) => {
                    if (error) {

                    } else {
                        resolve(stars);
                    }
                });
            });

        });
    }

    static getList() {
        return new Promise((resolve, reject) => {
            Star.find().exec((error, stars) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stars);
                }
            });
        });
    }

}

export default StarService;