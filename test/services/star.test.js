/**
 * Created by gbu on 20/11/2016.
 */
import assert from 'assert';
import mongoose from 'mongoose';
import Star from '../../src/Models/Star';
import StarService from '../../src/Services/Star/index';
import bluebird from 'bluebird';

bluebird.promisifyAll(mongoose);

describe('StarService', ()=> {

    before((done) => {
        Star.remove({}).then(()=> {
            done();
        });
    });

    it('should create new star', (done) => {
        const star = new Star({
            name: 'Mark Hamill',
            image: 'image',
            active: true,
            apiID: '1'
        });
        StarService.create(star)
            .then((result) => {
                assert.equal(result.name, "Mark Hamill");
                done();
            });
    });

    it('should not create star that has missing argument', (done) => {
        const star = new Star({
            name: 'Mark Hamill',
            active: true,
            apiID: '1'
        });
        StarService.create(star)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Could not create star");
            done();
        });
    });

    it('should search star by name and return image of star with that name', (done) => {
        const starSecond = new Star({
            name: 'Daisy Ridley',
            image: 'imageSecond',
            active: true,
            apiID: '1'
        });
        StarService.create(starSecond)
            .then((res) => {
                StarService.searchByName(starSecond.name)
                    .then((result) => {
                        assert.equal(result[0].image, 'imageSecond');
                        done();
                    });
            });
    });

    it('should search star by name and return image of second star with that name', (done) => {
        const starSecondMark = new Star({
            name: 'Mark Hamill',
            image: 'imageSecondMark',
            active: true,
            apiID: '1'
        });
        StarService.create(starSecondMark)
            .then((test) => {
                StarService.searchByName('Mark Hamill')
                    .then((result) => {
                        assert.equal(result[1].image, 'imageSecondMark');
                        done();
                    });
            });
    });

    it('should search by name and not return for nonexistent star', (done) => {
        const star = new Star({
            name: 'George Clooney',
            image: 'image',
            active: true,
            apiID: '1'
        });
        StarService.searchByName(star.name)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Star does not exist");
            done();
        });
    });

    it('should delete the star', (done) => {
        const star = new Star({
            name: 'Mark Hamill',
            image: 'image',
            active: true,
            apiID: '1'
        });
        StarService.create(star)
            .then((test) => {
                StarService.delete(star._id)
                    .then((result) => {
                        assert.equal(result.name, "Mark Hamill");
                        done();
                    });
            });
    });

    it('should not delete nonexistent star', (done) => {
        const star = new Star({
            name: 'George Clooney',
            image: 'image',
            active: true,
            apiID: '1'
        });
        StarService.delete(star._id)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Star does not exist");
            done();
        });
    });
});