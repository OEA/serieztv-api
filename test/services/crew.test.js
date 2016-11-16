/**
 * Created by gbu on 15/11/2016.
 */
import assert from 'assert';
import mongoose from 'mongoose';
import Crew from '../../src/Models/Crew';
import CrewService from '../../src/Services/Crew/index';
import bluebird from 'bluebird';

bluebird.promisifyAll(mongoose);

describe('Crew', ()=> {

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
                console.log(result);
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
        CrewService.create(crewSecond);
        CrewService.searchBy('name', crewSecond.name)
            .then((result) => {
                console.log(result);
                assert.equal(result[0].job, 'Producer');
                done();
            });
    });


    it('should search crew by name and return job of second crew with that name', (done) => {
        const crewFirst = new Crew({
            name: 'JJ Abraham',
            image: 'image',
            job: 'Writer',
            department: 'Writing',
            apiID: '1'
        });
        CrewService.create(crewFirst);
        CrewService.searchBy('name', 'JJ Abraham')
            .then((result) => {
                console.log(result);
                assert.equal(result[1].job, 'Producer');
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
        CrewService.searchBy('job', 'Producer')
            .then((result) => {
                console.log(result);
                assert.equal(result[1].name, 'Steven Spielberg');
                done();
            });
    });

    it('should search crew by job and return list of crew with that job', (done) => {
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
        const list = [crewSecond, crewThird];
        CrewService.create(crewSecond);
        CrewService.searchBy('job', 'Producer')
            .then((result) => {
                console.log(result);
                assert.equal(result, list);
                done();
            });
    });



    it('should search crew by department and return list of crew in that department', (done) => {
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
        const list = [crewSecond, crewThird];
        CrewService.searchBy('department', 'Producing')
            .then((result) => {
                console.log(result);
                assert.equal(result, list);
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
        CrewService.searchBy('name', crew.name)
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
        CrewService.search(crew.job)
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
        CrewService.delete(crew.name)
            .then((result) => {
                console.log(result);
                assert.equal(result.name, "George Lucas");
                done();
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
        CrewService.delete(crew.name)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Crew does not exist");
            done();
        });
    });
});