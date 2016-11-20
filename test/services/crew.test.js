/**
 * Created by gbu on 15/11/2016.
 */
import assert from 'assert';
import mongoose from 'mongoose';
import Crew from '../../src/Models/Crew';
import CrewService from '../../src/Services/Crew/index';
import bluebird from 'bluebird';

bluebird.promisifyAll(mongoose);

describe('CrewService', ()=> {

    before((done) => {
        Crew.remove({}).then(()=> {
            done();
        });
    });

    it('should create new crew', (done) => {
        const crew = new Crew({
            name: 'George Lucas',
            image: 'image',
            job: 'Director',
            department: 'Directing',
            apiID: '1'
        });
        CrewService.create(crew)
            .then((result) => {
                assert.equal(result.name, "George Lucas");
                done();
            });
    });

    it('should not create crew that has missing argument', (done) => {
        const crew = new Crew({
            name: 'George Lucas',
            image: 'image',
            job: 'Director',
            department: 'Directing'
        });
        CrewService.create(crew)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Could not create crew");
            done();
        });
    });

    it('should search crew by name and return job of crew with that name', (done) => {
        const crewSecond = new Crew({
            name: 'JJ Abraham',
            image: 'image',
            job: 'Producer',
            department: 'Producing',
            apiID: '1'
        });
        CrewService.create(crewSecond)
            .then((res) => {
                CrewService.searchByName(crewSecond.name)
                    .then((result) => {
                        assert.equal(result[0].job, 'Producer');
                        done();
                    });
            });

    });


    it('should search crew by name and return job of second crew with that name', (done) => {
        const crewFirstAbraham = new Crew({
            name: 'JJ Abraham',
            image: 'image',
            job: 'Writer',
            department: 'Writing',
            apiID: '1'
        });
        CrewService.create(crewFirstAbraham);
        CrewService.searchByName('JJ Abraham')
            .then((result) => {
                assert.equal(result[1].job, 'Writer');
                done();
            });
    });

    it('should search crew by job and return name of second crew with that job', (done) => {
        const crewThird = new Crew({
            name: 'Steven Spielberg',
            image: 'image',
            job: 'Producer',
            department: 'Producing',
            apiID: '1'
        });
        CrewService.create(crewThird);
        CrewService.searchByJob('Producer')
            .then((result) => {
                assert.equal(result[1].name, 'Steven Spielberg');
                done();
            });
    });

    it('should search crew by job and return names of crew with that job', (done) => {
        const crewSecond = new Crew({
            name: 'JJ Abraham',
            image: 'image',
            job: 'Producer',
            department: 'Producing',
            apiID: '1'
        });
        const crewThird = new Crew({
            name: 'Steven Spielberg',
            image: 'image',
            job: 'Producer',
            department: 'Producing',
            apiID: '1'
        });
        CrewService.create(crewSecond);
        CrewService.searchByJob('Producer')
            .then((result) => {
                assert.equal(result[0].name, crewSecond.name);
                assert.equal(result[1].name, crewThird.name);
                done();
            });
    });


    it('should search by name and not return for nonexistent crew', (done) => {
        const crew = new Crew({
            name: 'Han Solo',
            image: 'image',
            job: 'Director',
            department: 'Directing',
            apiID: '1'
        });
        CrewService.searchByName(crew.name)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Crew does not exist");
            done();
        });
    });

    it('should search by job and not return for nonexistent crew', (done) => {
        const crew = new Crew({
            name: 'Han Solo',
            image: 'image',
            job: 'Actor',
            department: 'Acting',
            apiID: '1'
        });
        CrewService.searchByJob(crew.job)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Crew does not exist");
            done();
        });
    });

    it('should delete the crew', (done) => {
        const crew = new Crew({
            name: 'George Lucas',
            image: 'image',
            job: 'Director',
            department: 'Directing',
            apiID: '1'
        });
        CrewService.create(crew)
            .then((test) => {
                CrewService.delete(crew._id)
                    .then((result) => {
                        assert.equal(result.name, "George Lucas");
                        done();
                    });
            });

    });

    it('should not delete nonexistent crew', (done) => {
        const crew = new Crew({
            name: 'Han Solo',
            image: 'image',
            job: 'Director',
            department: 'Directing',
            apiID: '1'
        });
        CrewService.delete(crew._id)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Crew does not exist");
            done();
        });
    });
});