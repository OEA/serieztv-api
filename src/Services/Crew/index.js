/**
 * Created by gbu on 15/11/2016.
 */

import mongoose from 'mongoose';
import Crew from '../../Models/Crew';
import Promise from 'bluebird';

Promise.promisifyAll(mongoose);

const CrewErrorMessages = {
    CREW_ALREADY_EXISTS: "Crew already exists",
    CANNOT_CREATE_CREW: "Could not create crew",
    CREW_NOT_EXIST: "Crew does not exist"
};

class CrewService {

    static create(crew) {
        return new Promise((resolve, reject) => {
            crew.save((error) => {
                if (error) {
                    reject(CrewErrorMessages.CANNOT_CREATE_CREW);
                } else {
                    resolve(crew);
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            Crew.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(CrewErrorMessages.CREW_NOT_EXIST);
                }
            }).then((test) => {
                Crew.findOneAndRemove({_id: id}, (error, crew) => {
                    if (error) {
                        console.log(error);
                    } else {
                        resolve(crew);
                    }
                });
            });

        });
    }

    static searchByName(value) {
        return new Promise((resolve, reject) => {
            Crew.find({name:value}).count((error, count) => {
                if (count == 0 || error) {
                    reject(CrewErrorMessages.CREW_NOT_EXIST);
                }
            }).then((count) => {
                Crew.find({name: value}, (error, crews) => {
                    if (error) {
                        console.log(error);
                    } else {
                        resolve(crews);
                    }
                });
            });

        });
    }

    static searchByJob(value) {
        return new Promise((resolve, reject) => {
            Crew.find({job:value}).count((error, count) => {
                if (count == 0 || error) {
                    reject(CrewErrorMessages.CREW_NOT_EXIST);
                }
            }).then((count) => {
                Crew.find({job: value}, (error, crews) => {
                    if (error) {
                        console.log(error);
                    } else {
                        resolve(crews);
                    }
                });
            });

        });
    }

}

export default CrewService;