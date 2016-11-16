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

    }

    static delete(crewName, crewJob) {

    }

    static searchBy(parameter, value) {

    }

}

export default CrewService;